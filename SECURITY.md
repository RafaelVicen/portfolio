# Segurança

Este projeto trata `/admin` como uma superfície de ataque.

- Autenticação e autorização são verificadas no servidor.
- Passwords são armazenadas como hashes `scrypt`; nenhum segredo de autenticação fica no frontend.
- Sessões são armazenadas por hash e, em produção, usam cookie `__Host-rq_session` com `HttpOnly`, `Secure` e `SameSite=Lax`.
- Alterações exigem token CSRF.
- Login e mutações administrativas têm rate limiting.
- Uploads são validados no servidor por assinatura real do ficheiro, tipo, tamanho e limites de processamento.
- Originais ficam fora de `public/` e são servidos através de URLs assinadas com expiração.
- Imagens são reprocessadas para WebP e os vídeos usam HTTP Range para reduzir custo de carregamento.
- Headers de segurança incluem CSP, HSTS em produção, frame denial, nosniff, Referrer-Policy e Permissions-Policy.
- O painel é `noindex` e não é incluído na navegação pública.

## Operação

Usa HTTPS em produção, mantém Node atualizado, faz backup de `data/app.sqlite` e `data/media/`, limita acesso de infraestrutura e define segredos fortes através de variáveis de ambiente.
