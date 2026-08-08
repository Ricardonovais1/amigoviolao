---
name: violao
description: Gera imagens com Fal.AI (sem assinatura, pay-as-you-go) para o blog do Amigo Violão — capas de post, imagens de apoio. Use quando o usuário pedir uma imagem/capa gerada por IA para um post, ou disser "/violao".
---

# Geração de imagens — Amigo Violão

Gera imagens via [Fal.AI](https://fal.ai) para o blog, sem depender de
assinatura (ao contrário do Higgsfield). Cobrança é por imagem gerada
(pay-as-you-go).

**Estilo-alvo: pintura, não foto.** Deliberadamente pouco comprometido com
realismo fotográfico — pinceladas grossas visíveis, textura de tinta, um
toque rústico, tipo Van Gogh/pós-impressionista. Não é uma foto de banco de
imagens gerada por IA tentando passar por real (isso fica óbvio e barato).
Lúdico, mas sem os clichês de "imagem de violão" (ver lista abaixo). Sempre
clean e sem texto na imagem.

## Pré-requisito

`FAL_KEY` precisa estar preenchida em `.env.local` (raiz do repo, já
git-ignored). Se estiver vazia, peça ao usuário para criar uma key em
https://fal.ai/dashboard/keys e colar lá antes de continuar — não dá para
gerar nada sem isso.

## Teto de gasto: US$3

O script recusa gerar se o gasto acumulado estimado passar de **US$3**
(rastreado localmente em `scripts/.fal_spend.json`, git-ignored — é só uma
estimativa local, o valor real é o de https://fal.ai/dashboard/billing).
Antes de gerar, se quiser conferir o acumulado: `python
scripts/fal_generate_image.py --show-spend`.

Preço por imagem (16:9 = 1MP, arredondado pra cima): `flux/schnell` $0.003,
`flux/dev` $0.025, `flux-pro/v1.1` $0.04. Todos irrisórios perto do teto de
$3 (~1000, ~120 e ~75 imagens respectivamente) — **não economize modelo por
causa do teto**, a diferença real é de centavos.

**Use `--model fal-ai/flux-pro/v1.1`, não o default do script.** O default
(`flux/schnell`, mais barato) é ótimo pra cena/composição mas **ignora
instruções de estilo pictórico** — testado ao vivo pedindo "Van Gogh" e ele
manteve tudo foto-realista. `flux-pro/v1.1` segue a instrução de estilo de
forma muito mais consistente em toda a cena, o que é o requisito principal
aqui (ver seção de estilo acima). Só vale tentar `flux/schnell` pra rascunho
rápido de composição antes de gastar num `flux-pro` final.

## Como gerar

```
python scripts/fal_generate_image.py \
  --model fal-ai/flux-pro/v1.1 \
  --prompt "<descrição em inglês>" \
  --out public/images/blog/<slug-do-post>.jpg \
  --aspect-ratio 16:9
```

- `--aspect-ratio 16:9` é o padrão e casa com o `PostCover` (`fill`, `object-cover`)
  usado nos cards e no topo dos posts — não mude sem motivo.
- O script baixa a imagem pronta em `--out` (sobrescreve se já existir — normal
  durante iteração). Rode de novo com um prompt ajustado ou `--seed` diferente
  se o resultado não ficar bom — cada chamada é uma nova geração (custa de novo,
  mas centavos).
- **Mostre a imagem gerada e peça aprovação antes de seguir pra otimização e
  front matter.** Na prática leva 2–3 tentativas até acertar estilo/composição
  — normal, não é sinal de que algo está quebrado.

## Escrevendo o prompt

- Escreva em **inglês** — os modelos FLUX respondem melhor.
- **Lidere a frase com o estilo, não descreva a cena primeiro e o estilo
  depois.** Testado ao vivo: colocar "Van Gogh"/"painterly" no meio ou fim do
  prompt foi ignorado pelo modelo, que voltou pra foto-realismo. Comece com
  `"A Van Gogh painting of..."` (ou variação) e só então descreva a cena —
  essa estrutura é o que realmente muda o resultado.
- **Diga explicitamente que o estilo cobre as pessoas, não só o fundo.** Sem
  isso o modelo estiliza céu/cenário e deixa rostos, pele e roupas
  foto-realistas — visualmente inconsistente. Inclua algo como "thick
  brushstrokes covering the entire scene including the people's faces, skin
  and clothes, not just the background".
- Descreva a cena depois do estilo, não o produto: "...of a child practicing
  acoustic guitar at home" funciona melhor que "capa para post de blog sobre
  violão".
- Vocabulário de pintura que funciona bem com FLUX, além de "Van Gogh":
  `post-impressionist`, `thick swirling impasto brushstrokes`, `gouache and
  oil painting texture`, `textured paper grain`, `rustic hand-painted feel`,
  `vivid expressive color`. Combine 2–3 por prompt, não a lista inteira.
- **Não peça foto realista** — nada de `photo`, `photorealistic`, `DSLR`,
  `35mm`, `shallow depth of field`: esses termos empurram o modelo de volta
  pra foto de banco de imagens, que é exatamente o que queremos evitar aqui.
- **Evite pedir texto dentro da imagem** — modelos de imagem erram letras quase
  sempre. Título e texto ficam por conta do layout do post, não da imagem.
- Pode referenciar a paleta da marca como *elementos* da cena (ex: "warm orange
  accent lighting", "teal wall in the background") em vez de tentar cravar o
  hex — o modelo não interpreta `#EF5400` literalmente.
- Público do blog é pais, crianças e professores de violão — cenas de aula,
  prática em casa, professor com aluno, criança com violão infantil, etc.

### Clichês de "imagem de violão" a evitar

Não repetir estas composições batidas (redundantes, sem narrativa, já
apareceram em toda capa de blog de música do mercado):

- Close-up isolado de mão dedilhando/na pestana, sem contexto de cena.
- Violão sozinho encostado na parede/num canto vazio.
- Pessoa tocando de olhos fechados em fundo desfocado genérico.
- Violão flutuando ou em still-life de estúdio sobre fundo liso.

Prefira cena com **narrativa e contexto**: alguém (criança, adulto, professor
e aluno) num ambiente real e específico — sala de casa, aula, quintal — fazendo
algo além de só segurar o instrumento. O violão é parte da cena, não o objeto
de still-life dela.

## Depois de gerar

1. **Tarja de título**: `python scripts/fal_add_title_bar.py --image <caminho>
   --title "<título curto>"` desenha por cima da imagem gerada uma tarja
   branca translúcida (13% da altura, 55% de opacidade) com o título em
   Poppins 28px e a logo real (`public/images/logo-amigo-violao-completo.png`)
   à direita. **Composição determinística com Pillow, não geração por IA** —
   pedir isso pro modelo de imagem não funciona (erra texto, não conhece a
   logo real). `--title` é um título **curto e editorial**, não
   necessariamente o `title` completo do front matter (que geralmente tem
   sufixo de SEO tipo " - Amigo Violão" — não incluir isso na tarja).
2. **Otimize**: `python scripts/optimize_images.py --src public/images/blog`
   converte para `.webp` e redimensiona se estiver largo demais. Mantém o
   `.jpg` original ao lado até alguém atualizar as referências e rodar
   `git rm` nele (mesma convenção do resto do repo). Se a tarja já foi
   aplicada direto num `.webp` (passo 1 depois de já ter otimizado), pode
   pular este passo.
3. **Referencie no post**: no front matter do `.md` em `content/blog/`, aponte
   `featured_image: /images/blog/<slug-do-post>.webp` (caminho público, sem
   `public/` no início — ver outros posts em `content/blog/` para conferir o
   padrão).
4. Confira a capa em `/<slug-do-post>` antes de considerar pronto —
   `next.config.ts` não tem os domínios do Fal na whitelist de imagem remota,
   então a imagem **precisa** estar baixada em `public/images/`, não linkada
   direto na URL do Fal (que além disso expira). **Antes de rodar `npm run
   dev`, cheque se já não tem um dev server ativo** (`curl localhost:3000`)
   — subir um segundo processo no mesmo repo derrubou o worker de otimização
   de imagem do primeiro (erro 500, cache do Turbopack em conflito). Se já
   tiver um rodando, só reaproveite; senão suba um novo.
