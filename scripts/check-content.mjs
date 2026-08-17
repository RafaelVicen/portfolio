import fs from 'node:fs'
const files = ['src/data/site.ts','src/data/profile.ts','src/data/projects.ts','src/pages/Gallery.tsx','src/pages/Admin.tsx']
const forbidden = ['ADICIONAR POSTERIORMENTE','Adicionar posteriormente','TODO: período','Informação disponível para completar posteriormente']
let errors = 0
for (const file of files) {
  const text = fs.readFileSync(file,'utf8')
  for (const word of forbidden) if (text.includes(word)) { console.error(`Conteúdo pendente encontrado em ${file}: ${word}`); errors++ }
}
if (errors) process.exit(1)
console.log('✓ Conteúdo público e painel sem placeholders proibidos.')
