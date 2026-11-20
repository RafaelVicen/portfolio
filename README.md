# Rafael Quiosa — Portfolio 
## Requisitos do servidor

- Node.js 22+
- ImageMagick
- FFmpeg + FFprobe
- disco persistente para `data/`
- HTTPS em produção

## Configuração

```bash
cp .env.example .env
# editar .env com uma password forte e os dois segredos
npm install
npm run build
npm start
```

Ou usa Docker/Compose:

```bash
docker compose up -d --build
```

Consulta `DEPLOY.md` para os detalhes de produção.

## Verificações

```bash
npm run check:content
npm run check:security
npm run build
```
# portfolio
