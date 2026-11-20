FROM node:22-bookworm-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends imagemagick ffmpeg \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npm run build
RUN chown -R node:node /app

USER node
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["node", "server.mjs"]
