import http from 'node:http'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'
import { DatabaseSync } from 'node:sqlite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = __dirname
const distDir = path.join(root, 'dist')
const dataDir = process.env.DATA_DIR || path.join(root, 'data')
const mediaDir = path.join(dataDir, 'media')
const dbPath = path.join(dataDir, 'app.sqlite')
const isProd = process.env.NODE_ENV === 'production'
const PORT = Number(process.env.PORT || 3000)
const SESSION_TTL = 8 * 60 * 60 * 1000
const PUBLIC_MEDIA_TTL = 60 * 60
const MAX_IMAGE_BYTES = 12 * 1024 * 1024
const MAX_VIDEO_BYTES = 120 * 1024 * 1024
const MAX_IMAGE_PIXELS = 50_000_000
const MAX_VIDEO_SECONDS = 10 * 60
const ADMIN_USER = process.env.ADMIN_USER || 'admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
const SESSION_SECRET = process.env.SESSION_SECRET
const MEDIA_SECRET = process.env.MEDIA_SECRET
const MAGICK_BIN = process.env.MAGICK_BIN || (fs.existsSync('/opt/imagemagick/bin/magick') ? '/opt/imagemagick/bin/magick' : (fs.existsSync('/usr/bin/magick') ? '/usr/bin/magick' : '/usr/bin/convert'))
const FFMPEG_BIN = process.env.FFMPEG_BIN || '/usr/bin/ffmpeg'
const FFPROBE_BIN = process.env.FFPROBE_BIN || '/usr/bin/ffprobe'
const SESSION_COOKIE = isProd ? '__Host-rq_session' : 'rq_session'

if (!ADMIN_PASSWORD || !SESSION_SECRET || !MEDIA_SECRET) {
  console.error('Missing ADMIN_PASSWORD, SESSION_SECRET or MEDIA_SECRET environment variable.')
  process.exit(1)
}

fs.mkdirSync(mediaDir, { recursive: true })
const db = new DatabaseSync(dbPath)
db.exec(`
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS sessions (
  id_hash TEXT PRIMARY KEY,
  csrf_hash TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  last_seen INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS media (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL CHECK(kind IN ('image','video')),
  original_name TEXT NOT NULL,
  mime TEXT NOT NULL,
  size INTEGER NOT NULL,
  category TEXT NOT NULL,
  alt TEXT NOT NULL,
  width INTEGER,
  height INTEGER,
  duration REAL,
  original_path TEXT NOT NULL,
  poster_path TEXT,
  variants_json TEXT,
  project_id TEXT,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  description TEXT NOT NULL,
  tags_json TEXT NOT NULL,
  details_json TEXT NOT NULL,
  link TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_media_category ON media(category);
CREATE INDEX IF NOT EXISTS idx_media_project ON media(project_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expiry ON sessions(expires_at);
`)

function now() { return Date.now() }
function id() { return crypto.randomUUID() }
function sha256(value) { return crypto.createHash('sha256').update(value).digest('hex') }
function timingSafeEqualString(a, b) {
  const aa = Buffer.from(a); const bb = Buffer.from(b)
  return aa.length === bb.length && crypto.timingSafeEqual(aa, bb)
}
function base64url(buf) { return Buffer.from(buf).toString('base64url') }
function hmac(value, secret = MEDIA_SECRET) { return base64url(crypto.createHmac('sha256', secret).update(value).digest()) }
function signMedia(id, exp) { return `${exp}.${hmac(`${id}.${exp}`)}` }
function verifyMedia(id, token) {
  const [exp, sig] = String(token || '').split('.')
  if (!exp || !sig || Number(exp) < Math.floor(Date.now() / 1000)) return false
  return timingSafeEqualString(sig, hmac(`${id}.${exp}`))
}
function passwordHash(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex')
  return `scrypt:${salt}:${hash}`
}
function passwordVerify(password, stored) {
  const [scheme, salt, expected] = String(stored).split(':')
  if (scheme !== 'scrypt' || !salt || !expected) return false
  const actual = crypto.scryptSync(password, salt, 64).toString('hex')
  return timingSafeEqualString(actual, expected)
}
function cookie(name, value, opts = {}) {
  const parts = [`${name}=${value}`]
  if (opts.maxAge != null) parts.push(`Max-Age=${Math.floor(opts.maxAge / 1000)}`)
  parts.push(`Path=${opts.path || '/'}`)
  if (opts.httpOnly) parts.push('HttpOnly')
  if (opts.secure) parts.push('Secure')
  if (opts.sameSite) parts.push(`SameSite=${opts.sameSite}`)
  return parts.join('; ')
}
function parseCookies(req) {
  const out = {}
  for (const pair of String(req.headers.cookie || '').split(';')) {
    const idx = pair.indexOf('='); if (idx < 0) continue
    out[pair.slice(0, idx).trim()] = pair.slice(idx + 1).trim()
  }
  return out
}
function json(res, status, body, extra = {}) {
  const data = JSON.stringify(body)
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extra })
  res.end(data)
}
function text(res, status, body, extra = {}) { res.writeHead(status, extra); res.end(body) }
function securityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()')
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin')
  res.setHeader('Content-Security-Policy', "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; img-src 'self' data: blob:; media-src 'self' blob:; font-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; upgrade-insecure-requests")
  if (isProd) res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
}

function ensureAdmin() {
  db.prepare('INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').run('admin_password_hash', passwordHash(ADMIN_PASSWORD))
}
ensureAdmin()

function seedProjects() {
  const count = Number(db.prepare('SELECT COUNT(*) AS n FROM projects').get().n)
  if (count > 0) return
  const file = path.join(root, 'server', 'seed-projects.json')
  if (!fs.existsSync(file)) return
  const items = JSON.parse(fs.readFileSync(file, 'utf8'))
  const t = now()
  const stmt = db.prepare('INSERT OR IGNORE INTO projects(id,slug,title,category,subtitle,description,tags_json,details_json,link,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?)')
  for (const p of items) stmt.run(id(), p.slug, p.title, p.category, p.subtitle, p.description, JSON.stringify(p.tags), JSON.stringify(p.details), null, t, t)
}
seedProjects()

const loginBuckets = new Map()
function rateLimit(key, limit, windowMs) {
  const t = now(); const item = loginBuckets.get(key)
  if (!item || item.reset < t) { loginBuckets.set(key, { count: 1, reset: t + windowMs }); return true }
  if (item.count >= limit) return false
  item.count++
  return true
}
function clientIp(req) { return String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim() }

function createSession() {
  const raw = base64url(crypto.randomBytes(32))
  const csrf = base64url(crypto.randomBytes(32))
  const t = now(); const exp = t + SESSION_TTL
  db.prepare('INSERT INTO sessions(id_hash,csrf_hash,expires_at,created_at,last_seen) VALUES(?,?,?,?,?)').run(sha256(raw), sha256(csrf), exp, t, t)
  return { raw, csrf, exp }
}
function getSession(req) {
  const raw = parseCookies(req)[SESSION_COOKIE]
  if (!raw) return null
  const row = db.prepare('SELECT * FROM sessions WHERE id_hash = ? AND expires_at > ?').get(sha256(raw), now())
  if (!row) return null
  db.prepare('UPDATE sessions SET last_seen = ? WHERE id_hash = ?').run(now(), row.id_hash)
  return { raw, row }
}
function requireAuth(req, res) {
  const session = getSession(req)
  if (!session) { json(res, 401, { error: 'Não autenticado.' }); return null }
  return session
}
function issueCsrf(session) {
  const token = base64url(crypto.randomBytes(32))
  db.prepare('UPDATE sessions SET csrf_hash = ? WHERE id_hash = ?').run(sha256(token), session.row.id_hash)
  return token
}
function requireCsrf(req, res, session) {
  const token = req.headers['x-csrf-token']
  if (!token || !timingSafeEqualString(sha256(String(token)), session.row.csrf_hash)) { json(res, 403, { error: 'CSRF inválido.' }); return false }
  return true
}

async function formData(req, maxBytes) {
  let total = 0
  const chunks = []
  for await (const chunk of req) {
    total += chunk.length
    if (total > maxBytes) throw Object.assign(new Error('Payload demasiado grande.'), { status: 413 })
    chunks.push(chunk)
  }
  const body = Buffer.concat(chunks)
  const headers = new Headers(req.headers)
  const request = new Request(`http://${req.headers.host || 'localhost'}${req.url}`, { method: req.method, headers, body, duplex: 'half' })
  return request.formData()
}
function safeName(name) { return String(name || 'file').replace(/[^a-zA-Z0-9._-]/g, '-').slice(0, 120) }
function mediaPath(id, suffix) { return path.join(mediaDir, `${id}${suffix}`) }
function storedPath(relative) { return path.resolve(dataDir, String(relative || '')) }
function ensureInside(file) { return path.resolve(file).startsWith(path.resolve(mediaDir) + path.sep) }
function fileHeaderValid(kind, buf) {
  if (kind === 'image') {
    if (buf.subarray(0, 3).equals(Buffer.from([0xff,0xd8,0xff]))) return 'image/jpeg'
    if (buf.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) return 'image/png'
    if (buf.subarray(0, 4).toString() === 'RIFF' && buf.subarray(8, 12).toString() === 'WEBP') return 'image/webp'
  } else {
    if (buf.subarray(4, 8).toString() === 'ftyp') return 'video/mp4'
    if (buf.subarray(0, 4).toString() === '\x1a\x45\xdf\xa3') return 'video/webm'
    if (buf.subarray(0, 4).toString() === 'RIFF' && buf.subarray(8, 12).toString() === 'AVI ') return 'video/x-msvideo'
  }
  return null
}
function run(command, args, inputPath) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ['ignore','pipe','pipe'] })
    let out = ''; let err = ''
    child.stdout.on('data', d => out += d.toString())
    child.stderr.on('data', d => err += d.toString())
    child.on('error', reject)
    child.on('close', code => code === 0 ? resolve(out.trim()) : reject(new Error(`${command} failed: ${err.slice(-800)}`)))
  })
}
async function optimizeImage(input, id) {
  const variants = {}
  for (const width of [480, 960, 1600]) {
    const out = mediaPath(id, `-${width}.webp`)
    await run(MAGICK_BIN, [input, '-auto-orient', '-strip', '-resize', `${width}x${width}>`, '-quality', '82', out])
    variants[width] = `/api/media/${id}?v=${width}`
  }
  return variants
}
async function makeVideoPoster(input, id) {
  const poster = mediaPath(id, '-poster.jpg')
  await run(FFMPEG_BIN, ['-y','-ss','00:00:01','-i',input,'-frames:v','1','-vf','scale=960:-2','-q:v','5',poster])
  return poster
}
function imageDimensions(buf, mime) {
  try {
    if (mime === 'image/png') return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) }
    if (mime === 'image/webp') {
      const chunk = buf.subarray(12, 30).toString('ascii')
      if (chunk.startsWith('VP8X')) return { width: 1 + buf.readUIntLE(24,3), height: 1 + buf.readUIntLE(27,3) }
    }
    if (mime === 'image/jpeg') {
      let i = 2
      while (i + 9 < buf.length) {
        if (buf[i] !== 0xff) { i++; continue }
        const marker = buf[i+1]; const len = buf.readUInt16BE(i+2)
        if ([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(marker)) return { height: buf.readUInt16BE(i+5), width: buf.readUInt16BE(i+7) }
        i += 2 + len
      }
    }
  } catch {}
  return null
}
async function handleUpload(req, res, session) {
  if (!rateLimit(`admin-upload:${clientIp(req)}`, 30, 60 * 1000)) return json(res, 429, { error: 'Demasiados uploads. Tenta novamente em breve.' }, { 'Retry-After': '60' })
  if (!requireCsrf(req, res, session)) return
  const fd = await formData(req, MAX_VIDEO_BYTES + 2 * 1024 * 1024)
  const file = fd.get('file')
  if (!(file instanceof File)) return json(res, 400, { error: 'Ficheiro em falta.' })
  const kind = String(fd.get('kind') || 'image')
  const category = String(fd.get('category') || 'Outras').slice(0, 60)
  const alt = String(fd.get('alt') || file.name || 'Media').slice(0, 240)
  const projectId = String(fd.get('projectId') || '').slice(0, 80) || null
  if (!['image','video'].includes(kind)) return json(res, 400, { error: 'Tipo inválido.' })
  const max = kind === 'image' ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES
  if (file.size <= 0 || file.size > max) return json(res, 413, { error: `Ficheiro excede o limite de ${Math.round(max/1024/1024)} MB.` })
  const buf = Buffer.from(await file.arrayBuffer())
  const detected = fileHeaderValid(kind, buf.subarray(0, Math.min(buf.length, 64)))
  if (!detected) return json(res, 415, { error: 'Assinatura do ficheiro inválida.' })
  const idv = id(); const ext = kind === 'image' ? (detected.split('/')[1] === 'jpeg' ? 'jpg' : detected.split('/')[1]) : (detected === 'video/webm' ? 'webm' : 'mp4')
  const original = mediaPath(idv, `-original.${ext}`)
  fs.writeFileSync(original, buf, { flag: 'wx', mode: 0o600 })
  let width = null, height = null, duration = null, variants = {}, posterPath = null
  try {
    if (kind === 'image') {
      const dims = imageDimensions(buf, detected)
      if (dims && dims.width * dims.height > MAX_IMAGE_PIXELS) throw new Error('Resolução demasiado elevada.')
      width = dims?.width || null; height = dims?.height || null
      variants = await optimizeImage(original, idv)
    } else {
      const probe = await run(FFPROBE_BIN, ['-v','error','-show_entries','format=duration:stream=width,height','-of','json',original])
      const parsed = JSON.parse(probe); const fmt = Number(parsed.format?.duration || 0)
      duration = Number.isFinite(fmt) ? fmt : null
      if (duration && duration > MAX_VIDEO_SECONDS) throw new Error('Vídeo demasiado longo.')
      width = Number(parsed.streams?.[0]?.width || 0) || null; height = Number(parsed.streams?.[0]?.height || 0) || null
      posterPath = await makeVideoPoster(original, idv)
    }
  } catch (e) {
    try { fs.rmSync(original, { force: true }) } catch {}
    return json(res, 422, { error: `O ficheiro não passou o processamento: ${e.message}` })
  }
  const t = now()
  db.prepare(`INSERT INTO media(id,kind,original_name,mime,size,category,alt,width,height,duration,original_path,poster_path,variants_json,project_id,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(idv, kind, safeName(file.name), detected, file.size, category, alt, width, height, duration, path.relative(dataDir, original), posterPath ? path.relative(dataDir, posterPath) : null, JSON.stringify(variants), projectId, t)
  const token = signMedia(idv, Math.floor(t/1000)+PUBLIC_MEDIA_TTL)
  return json(res, 201, { id: idv, kind, category, alt, width, height, duration, mediaUrl: `/api/media/${idv}?token=${token}`, variants, poster: posterPath ? `/api/media/${idv}?token=${token}&poster=1` : null })
}
function projectRow(row) {
  return { id: row.id, slug: row.slug, title: row.title, category: row.category, subtitle: row.subtitle, description: row.description, tags: JSON.parse(row.tags_json), details: JSON.parse(row.details_json), link: row.link }
}
function allProjects() {
  return db.prepare('SELECT * FROM projects ORDER BY updated_at DESC').all().map(row => {
    const project = projectRow(row)
    const cover = db.prepare("SELECT * FROM media WHERE project_id = ? AND kind = 'image' ORDER BY created_at DESC LIMIT 1").get(row.id)
    return { ...project, cover: cover ? mediaRow(cover) : null }
  })
}
function mediaRow(row) {
  const exp = Math.floor(now()/1000) + PUBLIC_MEDIA_TTL
  const token = signMedia(row.id, exp)
  const variants = JSON.parse(row.variants_json || '{}')
  return { id: row.id, kind: row.kind, name: row.original_name, mime: row.mime, category: row.category, alt: row.alt, width: row.width, height: row.height, duration: row.duration, projectId: row.project_id, mediaUrl: `/api/media/${row.id}?token=${token}`, posterUrl: row.poster_path ? `/api/media/${row.id}?token=${token}&poster=1` : null, variants: Object.fromEntries(Object.entries(variants).map(([k]) => [k, `/api/media/${row.id}?token=${token}&v=${k}`])) }
}
function serveMedia(req, res, idv, url) {
  const row = db.prepare('SELECT * FROM media WHERE id = ?').get(idv)
  if (!row) return text(res, 404, 'Not found')
  const token = url.searchParams.get('token')
  if (!verifyMedia(idv, token)) return text(res, 403, 'Forbidden')
  let file = storedPath(row.original_path)
  let contentType = row.mime
  if (row.kind === 'image' && url.searchParams.get('v')) {
    const v = Number(url.searchParams.get('v'))
    if (![480,960,1600].includes(v)) return text(res, 400, 'Bad variant')
    file = mediaPath(idv, `-${v}.webp`); contentType = 'image/webp'
  }
  if (row.kind === 'video' && url.searchParams.get('poster') === '1') { file = mediaPath(idv, '-poster.jpg'); contentType = 'image/jpeg' }
  if (!ensureInside(file) || !fs.existsSync(file)) return text(res, 404, 'Not found')
  const stat = fs.statSync(file); const range = req.headers.range
  res.setHeader('Content-Type', contentType); res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400')
  if (row.kind === 'video' && range) {
    const m = /^bytes=(\d+)-(\d*)$/.exec(range); if (!m) return text(res, 416, 'Range not satisfiable')
    const start = Number(m[1]); const end = m[2] ? Math.min(Number(m[2]), stat.size-1) : stat.size-1
    if (start >= stat.size) return text(res, 416, 'Range not satisfiable')
    res.writeHead(206, { 'Content-Range': `bytes ${start}-${end}/${stat.size}`, 'Accept-Ranges':'bytes', 'Content-Length': end-start+1 })
    return fs.createReadStream(file, { start, end }).pipe(res)
  }
  res.setHeader('Content-Length', stat.size); fs.createReadStream(file).pipe(res)
}
function cleanupExpiredSessions() { db.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(now()) }
setInterval(cleanupExpiredSessions, 30 * 60 * 1000).unref()

const server = http.createServer(async (req, res) => {
  try {
    securityHeaders(res)
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
    if (req.method === 'OPTIONS') { res.writeHead(204, { 'Access-Control-Allow-Origin': 'null' }); return res.end() }

    if (url.pathname === '/api/auth/csrf' && req.method === 'GET') {
      const s = getSession(req); if (!s) return json(res, 401, { error:'Não autenticado.' })
      return json(res, 200, { authenticated:true, csrf: issueCsrf(s) }, { 'X-CSRF-Status':'ready' })
    }
    if (url.pathname === '/api/auth/login' && req.method === 'POST') {
      const ip = clientIp(req); if (!rateLimit(`login:${ip}`, 8, 15*60*1000)) return json(res, 429, { error:'Demasiadas tentativas. Tenta novamente mais tarde.' }, { 'Retry-After':'900' })
      const fd = await formData(req, 32*1024); const username = String(fd.get('username') || ''); const password = String(fd.get('password') || '')
      const stored = db.prepare('SELECT value FROM settings WHERE key=?').get('admin_password_hash')?.value
      if (username !== ADMIN_USER || !passwordVerify(password, stored)) return json(res, 401, { error:'Credenciais inválidas.' })
      const s = createSession()
      res.setHeader('Set-Cookie', cookie(SESSION_COOKIE, s.raw, { httpOnly:true, secure:isProd, sameSite:'Lax', path:'/', maxAge:SESSION_TTL }))
      return json(res, 200, { authenticated:true, csrf:s.csrf })
    }
    if (url.pathname === '/api/auth/me' && req.method === 'GET') {
      const s = getSession(req); return json(res, 200, { authenticated:!!s, user:s ? ADMIN_USER : null })
    }
    if (url.pathname === '/api/auth/logout' && req.method === 'POST') {
      const s = getSession(req); if (s && !requireCsrf(req, res, s)) return; if (s) db.prepare('DELETE FROM sessions WHERE id_hash=?').run(sha256(s.raw))
      res.setHeader('Set-Cookie', cookie(SESSION_COOKIE, '', { httpOnly:true, secure:isProd, sameSite:'Lax', path:'/', maxAge:0 }))
      return json(res, 200, { authenticated:false })
    }

    if (url.pathname === '/api/public/projects' && req.method === 'GET') return json(res, 200, { projects: allProjects() })
    if (url.pathname === '/api/public/media' && req.method === 'GET') {
      const category = url.searchParams.get('category')
      const rows = category ? db.prepare('SELECT * FROM media WHERE category=? ORDER BY created_at DESC').all(category) : db.prepare('SELECT * FROM media ORDER BY created_at DESC').all()
      return json(res, 200, { media: rows.map(mediaRow) }, { 'Cache-Control':'public, max-age=60, stale-while-revalidate=300' })
    }
    if (url.pathname.startsWith('/api/media/')) return serveMedia(req, res, url.pathname.split('/').pop(), url)

    const session = (url.pathname.startsWith('/api/admin/') ? requireAuth(req,res) : null)
    if (url.pathname.startsWith('/api/admin/') && !session) return
    if (url.pathname === '/api/admin/media' && req.method === 'GET') {
      const rows = db.prepare('SELECT * FROM media ORDER BY created_at DESC').all(); return json(res, 200, { media: rows.map(mediaRow) })
    }
    if (url.pathname === '/api/admin/media' && req.method === 'POST') return await handleUpload(req,res,session)
    if (url.pathname.startsWith('/api/admin/media/') && req.method === 'DELETE') {
      if (!requireCsrf(req,res,session)) return
      const idv = url.pathname.split('/').pop(); const row = db.prepare('SELECT * FROM media WHERE id=?').get(idv)
      if (!row) return json(res,404,{error:'Media não encontrada.'})
      db.prepare('DELETE FROM media WHERE id=?').run(idv)
      for (const p of [storedPath(row.original_path), row.poster_path ? storedPath(row.poster_path) : null, ...Object.keys(JSON.parse(row.variants_json || '{}')).map(v=>mediaPath(idv,`-${v}.webp`))]) if (p && ensureInside(p)) fs.rmSync(p,{force:true})
      return json(res,200,{ok:true})
    }
    if (url.pathname === '/api/admin/projects' && req.method === 'GET') return json(res,200,{projects:allProjects()})
    if (url.pathname === '/api/admin/projects' && req.method === 'POST') {
      if (!rateLimit(`admin-project:${clientIp(req)}`, 20, 60 * 1000)) return json(res, 429, { error: 'Demasiadas alterações. Tenta novamente em breve.' }, { 'Retry-After': '60' })
      if (!requireCsrf(req,res,session)) return
      const fd = await formData(req, 64*1024); const title=String(fd.get('title')||'').trim(); const category=String(fd.get('category')||'').trim(); const subtitle=String(fd.get('subtitle')||'').trim(); const description=String(fd.get('description')||'').trim(); const slug=String(fd.get('slug')||title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')).slice(0,80); const link=String(fd.get('link')||'').trim() || null; const tags=String(fd.get('tags')||'').split(',').map(x=>x.trim()).filter(Boolean).slice(0,12); const details=String(fd.get('details')||'').split('\n').map(x=>x.trim()).filter(Boolean).slice(0,20)
      if (!title || !category || !subtitle || !description || !slug) return json(res,400,{error:'Preenche os campos obrigatórios.'})
      if (link && !/^https:\/\//i.test(link)) return json(res,400,{error:'O link deve usar HTTPS.'})
      const t=now(); const pid=id(); db.prepare('INSERT INTO projects(id,slug,title,category,subtitle,description,tags_json,details_json,link,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?)').run(pid,slug,title,category,subtitle,description,JSON.stringify(tags),JSON.stringify(details),link,t,t); return json(res,201,{project:projectRow(db.prepare('SELECT * FROM projects WHERE id=?').get(pid))})
    }
    if (url.pathname.startsWith('/api/admin/projects/') && req.method === 'DELETE') {
      if (!requireCsrf(req,res,session)) return
      const pid=url.pathname.split('/').pop(); const row=db.prepare('SELECT id FROM projects WHERE id=?').get(pid); if(!row) return json(res,404,{error:'Projeto não encontrado.'})
      db.prepare('UPDATE media SET project_id=NULL WHERE project_id=?').run(pid); db.prepare('DELETE FROM projects WHERE id=?').run(pid); return json(res,200,{ok:true})
    }

    if (url.pathname.startsWith('/api/admin/')) return json(res,404,{error:'Endpoint não encontrado.'})

    if (req.method === 'GET') {
      const filePath = url.pathname === '/' ? path.join(distDir,'index.html') : path.join(distDir, url.pathname.replace(/^\//,''))
      const safe = path.resolve(filePath).startsWith(path.resolve(distDir) + path.sep) ? filePath : path.join(distDir,'index.html')
      if (fs.existsSync(safe) && fs.statSync(safe).isFile()) {
        const ext=path.extname(safe); const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp'}
        res.setHeader('Content-Type',types[ext]||'application/octet-stream'); res.setHeader('Cache-Control', ext==='.html'?'no-cache':'public, max-age=31536000, immutable'); return fs.createReadStream(safe).pipe(res)
      }
      const index=path.join(distDir,'index.html'); if(fs.existsSync(index)){res.setHeader('Content-Type','text/html; charset=utf-8');res.setHeader('Cache-Control','no-cache');return fs.createReadStream(index).pipe(res)}
    }
    text(res,404,'Not found')
  } catch (e) {
    console.error(e)
    json(res, Number(e.status)||500, { error: isProd ? 'Erro interno.' : String(e.message || e) })
  }
})

server.listen(PORT, () => console.log(`Rafael Quiosa portfolio running on http://localhost:${PORT}`))
