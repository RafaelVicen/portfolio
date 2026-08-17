# Deploy seguro

## Requisitos
- Node.js 22+ (usa `node:sqlite`).
- HTTPS em produção.
- ImageMagick em `/opt/imagemagick/bin/magick`.
- FFmpeg e FFprobe em `/usr/bin/ffmpeg` e `/usr/bin/ffprobe`.
- Disco persistente para `DATA_DIR`.

## Configuração
1. Copia `.env.example` para `.env`.
2. Define `ADMIN_PASSWORD`, `SESSION_SECRET` e `MEDIA_SECRET` com valores longos e aleatórios.
3. `npm install` e `npm run build`.
4. `npm start`.

O painel fica em `/admin`. Em produção a sessão usa cookie `__Host-rq_session` com `HttpOnly`, `Secure` e `SameSite=Lax`. O servidor exige CSRF para alterações, limita tentativas de login, valida assinaturas de ficheiros, mantém os originais fora de `public/` e entrega media pública através de URLs assinadas.

## Performance
Imagens carregadas pelo painel são convertidas para WebP em 480/960/1600 px. O frontend usa lazy loading/decoding assíncrono. Vídeos são servidos com HTTP Range e posters separados.

## Backup
Faz backup de `data/app.sqlite` e `data/media/`. Não coloques essa pasta dentro de `public/`.
