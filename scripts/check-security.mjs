import fs from 'node:fs'
const required = ['SECURITY.md','server.mjs','src/pages/Admin.tsx','.env.example','Dockerfile']
let ok = true
for (const f of required) if (!fs.existsSync(f)) { console.error(`Falta: ${f}`); ok = false }
const server = fs.readFileSync('server.mjs','utf8')
for (const token of ['HttpOnly','Secure','SameSite','csrf-token','rateLimit','scrypt','X-Content-Type-Options','MEDIA_SECRET']) {
  if (!server.includes(token)) { console.error(`Falta controlo: ${token}`); ok = false }
}
if (!ok) process.exit(1)
console.log('✓ Controlos server-side de segurança presentes.')
