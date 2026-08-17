# Rafael Quiosa — Portfolio + Admin seguro

Portfólio em React + TypeScript + Vite + Tailwind CSS, servido por um backend Node.js nativo.

## Painel `/admin`

O painel permite:

- adicionar fotografias e vídeos;
- escolher a secção/pasta lógica;
- associar media a projetos;
- apagar qualquer fotografia ou vídeo;
- criar novos projetos com título, categoria, descrição, tags, detalhes e link HTTPS;
- apagar projetos;
- controlar a biblioteca existente.

## Segurança

`/admin` não é uma password escondida no React. A autenticação acontece no servidor. Em produção:

- sessão server-side;
- cookie `__Host-rq_session` com `HttpOnly`, `Secure` e `SameSite=Lax`;
- CSRF para mutações;
- rate limiting;
- password hash com `scrypt`;
- validação server-side de uploads;
- originais fora de `public/`;
- URLs assinadas para media pública;
- CSP, HSTS, nosniff, frame denial e outras políticas de segurança.

## Performance

As fotografias são convertidas no servidor para WebP em 480, 960 e 1600 px. O site usa lazy loading e `decoding="async"`. Vídeos usam posters e HTTP Range para permitir reprodução parcial sem descarregar o ficheiro inteiro.

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
