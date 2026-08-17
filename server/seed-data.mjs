import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { DatabaseSync } from 'node:sqlite'
import { spawn } from 'node:child_process'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dataDir = process.env.DATA_DIR || path.join(root, 'data')
const mediaDir = path.join(dataDir, 'media')
const MAGICK_BIN = process.env.MAGICK_BIN || (fs.existsSync('/opt/imagemagick/bin/magick') ? '/opt/imagemagick/bin/magick' : (fs.existsSync('/usr/bin/magick') ? '/usr/bin/magick' : '/usr/bin/convert'))
const db = new DatabaseSync(path.join(dataDir, 'app.sqlite'))
fs.mkdirSync(mediaDir, { recursive: true })
const id = () => crypto.randomUUID()
const run = (command, args) => new Promise((resolve, reject) => {
  const p = spawn(command, args, { stdio: ['ignore', 'pipe', 'pipe'] })
  let out = ''; let err = ''
  p.stdout.on('data', d => out += d)
  p.stderr.on('data', d => err += d)
  p.on('error', reject)
  p.on('close', code => code === 0 ? resolve(out.trim()) : reject(new Error(err.slice(-800))))
})
function headerValid(p) {
  const b = fs.readFileSync(p).subarray(0, 16)
  if (b.subarray(0, 3).equals(Buffer.from([255, 216, 255]))) return 'image/jpeg'
  if (b.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) return 'image/png'
  if (b.subarray(0, 4).toString() === 'RIFF' && b.subarray(8, 12).toString() === 'WEBP') return 'image/webp'
  return null
}
const map = {
  'ecoangola-acoes-ambientais': { category: 'EcoAngola', title: 'EcoAngola — Ações Ambientais & Comunidade' },
  'formacoes': { category: 'Formações', title: 'Formações & Aprendizagem' },
  'hackathon-ecoangola': { category: 'Hackathons', title: 'Hackathon EcoAngola — Semana Verde da Juventude' },
  'eventos-comunidade': { category: 'Eventos', title: 'Eventos & Comunidade' }
}
for (const [folder, meta] of Object.entries(map)) {
  const dir = path.join(root, 'public', 'gallery', folder)
  if (!fs.existsSync(dir)) continue
  for (const name of fs.readdirSync(dir)) {
    const src = path.join(dir, name)
    if (!fs.statSync(src).isFile()) continue
    const mime = headerValid(src)
    if (!mime) continue
    const mid = id()
    const ext = mime === 'image/jpeg' ? 'jpg' : mime.split('/')[1]
    const original = path.join(mediaDir, `${mid}-original.${ext}`)
    fs.copyFileSync(src, original)
    const variants = {}
    for (const w of [480, 960, 1600]) {
      const out = path.join(mediaDir, `${mid}-${w}.webp`)
      await run(MAGICK_BIN, [original, '-auto-orient', '-strip', '-resize', `${w}x${w}>`, '-quality', '82', out])
      variants[w] = true
    }
    const stat = fs.statSync(original)
    const t = Date.now()
    db.prepare(`INSERT OR IGNORE INTO media(id,kind,original_name,mime,size,category,alt,width,height,duration,original_path,poster_path,variants_json,project_id,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(mid, 'image', name, mime, stat.size, meta.category, `${meta.title}: ${name}`, null, null, null, path.relative(dataDir, original), null, JSON.stringify(variants), null, t)
  }
}
console.log('Existing gallery media migrated to private storage.')
