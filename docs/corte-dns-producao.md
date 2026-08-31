# Corte de amigoviolao.com para a AWS

Runbook do dia da virada: tirar o domínio do WordPress (Cloudways, atrás do
proxy do Cloudflare) e apontá-lo para o site estático no CloudFront.

Decisões que já estão tomadas (não são para revisitar no meio do corte):

- **Stack de produção separado** do staging — bucket `amigo-violao-website-prod`
  e distribuição próprios, deploy saindo da branch `master`. O staging continua
  existindo como ambiente de teste, `noindex`.
- **DNS only** (nuvem cinza) no Cloudflare. O CloudFront já é CDN e já termina o
  TLS; empilhar o proxy do Cloudflare significaria dois caches para limpar a
  cada publicação.
- **O WordPress sai do ar junto com o corte** — não fica endereço legado. Por
  isso todo asset que vinha de `wp-content` foi baixado para `public/images/legacy/`
  e `public/downloads/` antes (commit `767399a`).

O e-mail do domínio **não** é afetado: os MX apontam para a Rackspace
(`mx1/mx2.emailsrvr.com`), não para a Cloudways, e nenhum passo aqui toca em MX.

---

## 1. Infraestrutura de produção (AWS)

```bash
python scripts/cloudfront_function.py --env prod   # cria e publica a function
python scripts/provision_prod.py                   # bucket + OAC + distribuição
python scripts/provision_prod.py --fix-staging-errors
```

O terceiro comando conserta, também no staging, o mapeamento de erro que fazia
qualquer URL inexistente responder **200 com a Home**. A distribuição nasce
**sem aliases** — anexar `amigoviolao.com` exige o certificado ACM já emitido.

Anote o ID da distribuição impresso e:

1. Coloque-o em `ENVIRONMENTS["prod"]["distribution_id"]`, em
   `scripts/cloudfront_function.py`.
2. `gh secret set CLOUDFRONT_DISTRIBUTION_ID_PROD --body <ID>`
3. `python scripts/iam_prod_access.py` — dá à role do GitHub Actions acesso ao
   bucket novo e permite push na `master` (hoje ela só confia na `staging`).

## 2. Certificado

O certificado já foi pedido (`arn:...:certificate/6632d7ba-4559-4af2-8e2c-76d555b5c17e`,
apex + www, us-east-1) e está `PENDING_VALIDATION`. Com o token do Cloudflare em
`.env.local` (`CLOUDFLARE_API_TOKEN=...`, permissão Zone:DNS:Edit):

```bash
python scripts/cloudflare_dns.py --status         # confere a zona antes de mexer
python scripts/cloudflare_dns.py --validate-acm   # cria os 2 CNAME de validação
python scripts/provision_prod.py --status         # acompanha até sair de PENDING
```

Emitido, anexa o domínio à distribuição:

```bash
python scripts/provision_prod.py --attach-domain
```

## 3. Conteúdo em produção, antes do DNS

```bash
git checkout master && git merge staging && git push origin master
```

O workflow publica no bucket de produção. Este é o único deploy que gera um
build indexável (`SITE_URL=https://amigoviolao.com`), e ele aborta sozinho se o
`robots.txt` ou o `<meta robots>` não bater com o ambiente.

**Verifique o site de produção antes de qualquer mudança de DNS**, forçando o
nome no resolvedor local — o domínio ainda aponta para o WordPress:

```bash
IP=$(dig +short <distribuicao>.cloudfront.net | head -1)
curl -sSI --resolve amigoviolao.com:443:$IP https://amigoviolao.com | head -5
curl -sSI --resolve amigoviolao.com:443:$IP https://amigoviolao.com/curso-para-criancas/ | head -5   # 301
curl -sSI --resolve amigoviolao.com:443:$IP https://amigoviolao.com/pagina-que-nao-existe | head -3  # 404
curl -s   --resolve amigoviolao.com:443:$IP https://amigoviolao.com/robots.txt                      # Allow: /
curl -sSI --resolve www.amigoviolao.com:443:$IP https://www.amigoviolao.com | head -5              # 301 para o apex
```

O último é o único teste que não dá para fazer antes: o 301 de `www` para o
apex é decidido pelo header `Host` dentro da CloudFront Function. Se ele vier
200 em vez de 301, o site responderia em dois hostnames (conteúdo duplicado) —
nesse caso a alternativa é uma Redirect Rule no Cloudflare com o `www`
proxiado, e o corte espera por isso.

## 4. O corte

```bash
python scripts/cloudflare_dns.py --cutover <distribuicao>.cloudfront.net
```

Faz backup da zona inteira em `backups/` antes de tocar em nada, apaga os A/AAAA
do apex e do www (Cloudways) e cria os CNAME para o CloudFront, DNS only, TTL
300. Propagação em minutos.

Depois:

```bash
curl -sSI https://amigoviolao.com | head -5
curl -sSI https://www.amigoviolao.com | head -5   # 301 para o apex
```

## 5. Rollback

Enquanto o TTL for 300, volta em minutos:

```bash
python scripts/cloudflare_dns.py --rollback backups/cloudflare-dns-<timestamp>.json
```

Isso restaura apex e www exatamente como estavam (A/AAAA proxiados apontando
para a Cloudways). Só funciona enquanto o WordPress ainda estiver no ar — este é
o motivo para **não** cancelar a hospedagem no mesmo dia do corte, mesmo tendo
decidido que não haverá endereço legado.

## 6. Depois que estabilizar

- Search Console: nova propriedade, enviar `https://amigoviolao.com/sitemap.xml`.
- Subir o TTL do apex/www de 300 para 3600.
- Cancelar a Cloudways.
- Desligar o deploy automático do projeto na Vercel (o build de lá continua
  saindo `noindex` pela guarda em `robots.ts`, mas não há mais motivo para ele
  existir).

## Pendências que não bloqueiam o DNS, mas vão ao ar incompletas

- **Formulário de contato**: sem `NEXT_PUBLIC_FORMSPREE_ENDPOINT` o
  `ContactForm` retorna `null` — a página `/contato` sobe **sem formulário
  nenhum**. Criar a conta no Formspree e
  `gh secret set NEXT_PUBLIC_FORMSPREE_ENDPOINT --body <url>`.
- **Analytics**: sem `NEXT_PUBLIC_GA_MEASUREMENT_ID` não há medição nenhuma do
  tráfego a partir do primeiro dia no domínio real.
