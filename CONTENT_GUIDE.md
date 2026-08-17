# Manutenção do conteúdo (não é exibido no site)

Conteúdo base:
- `src/data/site.ts` — identidade, contactos, redes e CV.
- `src/data/profile.ts` — sobre, competências, experiência, educação, certificações e comunidade.
- `src/data/projects.ts` — conteúdo de fallback dos projetos.
- `data/app.sqlite` + `data/media/` — conteúdo administrável em produção.

## Fotografias e vídeos

Não é necessário colocar ficheiros manualmente em `public/`. Entra em `/admin`, autentica-te e usa o carregador. A media é guardada fora da pasta pública, processada no servidor e entregue ao site através de URLs assinadas.
