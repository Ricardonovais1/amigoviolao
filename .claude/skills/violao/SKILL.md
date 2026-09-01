---
name: violao
description: Cria a imagem destacada (capa) de um post do blog do Amigo Violão de ponta a ponta — gera a arte no Fal.AI, aplica a tarja com logo e título, otimiza e aponta o front matter. Use quando pedirem imagem destacada, capa, thumbnail ou imagem de apoio para um post, ou disserem "/violao".
---

# Imagem destacada de post — Amigo Violão

Gera imagens via [Fal.AI](https://fal.ai) para o blog, sem depender de
assinatura (ao contrário do Higgsfield). Cobrança é por imagem gerada
(pay-as-you-go).

## O fluxo inteiro, em ordem

Uma capa só está pronta quando os 5 passos rodaram. Nunca pare no passo 1: um
`.jpg` solto em `public/images/blog/` sem tarja, sem `.webp` e sem front
matter não aparece em lugar nenhum do site.

1. **Gerar a arte** — `fal_generate_image.py`, `flux-pro/v1.1`, 16:9, saída em
   `public/images/blog/<slug>.jpg`. Mostre pro Ricardo e só siga com aprovação.
2. **Tarja** — `fal_add_title_bar.py` (logo + título + cor da marca). Salva
   sozinho a arte limpa em `content/blog-cover-originals/<slug>.jpg`.
3. **Otimizar** — `optimize_images.py --src public/images/blog` gera o `.webp`.
4. **Front matter** — aponte **`featured_image` E `og_image`** (os dois, sempre)
   para `/images/blog/<slug>.webp`. Esquecer o `og_image` deixa o
   compartilhamento no WhatsApp/Facebook com a capa velha do WordPress.
5. **Limpar** — `rm` o `.jpg` intermediário de `public/` (o original limpo já
   está guardado em `content/blog-cover-originals/`), e confira em `/<slug>`.

As cenas já usadas ficam em `content/blog-cover-originals/cenas.json`
(`slug`, `titulo` da tarja, `cena` em inglês). Consulte antes de inventar uma
cena nova: é de lá que se refaz uma capa sem ter que redesenhar o conceito, e
é o que evita repetir a mesma composição em dois posts parecidos.

## Lote grande (dezenas de capas)

Não gere uma a uma pedindo aprovação — vira dezenas de idas e voltas. Gere em
lotes de ~13, monte uma **folha de contato** (grade das capas já tarjadas, com
o número e o slug embaixo de cada uma) e mostre uma imagem só por lote.
Pré-filtre você mesmo antes de mostrar: refaça o que já reprovaria sozinho,
para o que chega ao Ricardo ser a sua melhor versão.

Os quatro motivos de refação que apareceram de verdade num lote de 77 (≈20%
precisaram voltar, é o normal, não sinal de problema):

1. **Sujeito pequeno ou baixo demais** — a tarja come 49% e sobra paisagem
   vazia. É o mais comum de longe. Corrige pedindo "large and filling the
   upper half of the frame".
2. **O objeto do post sumiu** — capa de afinação sem violão, metáfora da
   bicicleta sem bicicleta. Sempre confira se o que dá nome ao post
   sobreviveu à cena.
3. **Resultado impróprio** — uma cena de "mãe ouvindo música com os filhos"
   voltou com a mãe seminua. Num blog de família isso não passa: peça roupa
   explicitamente ("fully clothed", "modest everyday clothing") ao descrever
   adulto e criança juntos, e olhe cada imagem antes de publicar.
4. **Cena genérica demais** — o modelo devolve "duas pessoas numa sala" em vez
   do que o post trata. Nomeie a ação concreta, não o tema.

O script `fal_generate_image.py` já leva timeout de leitura do Fal de vez em
quando: num lote, uma falha não pode derrubar as outras — repita a chamada em
vez de abortar o lote inteiro.

Ao refazer a tarja de uma capa que já existe, rode o passo 2 com
`--image content/blog-cover-originals/<slug>.jpg --out public/images/blog/<slug>.jpg`.
Rodar em cima do `.jpg` já com tarja faz o script salvar a versão *já tarjada*
como "original" e a arte limpa se perde.

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

## Teto de gasto: US$5

O script recusa gerar se o gasto acumulado estimado passar de **US$5**
(rastreado localmente em `scripts/.fal_spend.json`, git-ignored — é só uma
estimativa local, o valor real é o de https://fal.ai/dashboard/billing).
Antes de gerar, se quiser conferir o acumulado: `python
scripts/fal_generate_image.py --show-spend`.

Preço por imagem (16:9 = 1MP, arredondado pra cima): `flux/schnell` $0.003,
`flux/dev` $0.025, `flux-pro/v1.1` $0.04. Todos irrisórios perto do teto de
$5 (~1600, ~200 e ~125 imagens respectivamente) — **não economize modelo por
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

### Fórmula fixa

Todas as capas de `curso-de-violao-completo` em diante usam este prefixo,
literalmente, seguido da cena:

```
A Van Gogh painting, thick swirling impasto brushstrokes covering the entire
scene including the people's faces, skin and clothes, not just the background,
post-impressionist, vivid expressive color, <cena>
```

Não reescreva o prefixo a cada post — é ele que mantém as capas parecendo uma
série só no grid do `/blog`. O que muda de post pra post é só a `<cena>`.

### Enquadramento: a tarja come a metade de baixo

A tarja cobre os **49% inferiores**. Então rostos, mãos e a ação da cena
precisam estar na **metade de cima** — o que sobrar embaixo vira fundo atrás
do texto. Peça isso no prompt quando a cena tender a centralizar
(ex: "both heads close together in the upper part of the scene"). Nesta
leva a capa da pestana precisou ser refeita exatamente por isso: os dois
personagens saíram nas bordas com um vazio no meio, e a tarja engoliu a parte
que contava a história.

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

**Mas o violão precisa aparecer.** Post sobre medo de partitura virou, na
primeira tentativa, uma mulher linda estudando partitura ao laptop — sem
violão nenhum. Cena bonita, capa errada pra um blog de violão. Ao traduzir um
tema abstrato (medo, motivação, níveis) numa cena, confira se o instrumento
sobreviveu à tradução.

Quando o tema é abstrato demais pra virar cena de aula, vale a **metáfora**:
"Como aprender violão do zero? Os 6 níveis" virou um iniciante subindo uma
trilha de pedra na serra com o violão nas costas, a neblina se abrindo à
frente — que é a imagem que o próprio texto do post usa.

## Depois de gerar

1. **Tarja de título**: `python scripts/fal_add_title_bar.py --image <caminho>
   --title "<título curto>"` desenha por cima da imagem gerada uma tarja
   colorida translúcida cobrindo os 49% inferiores da imagem (72% de
   opacidade), com a logo branca (`public/images/logo-amigo-violao-branco.webp`)
   centralizada no topo da tarja e o título em Poppins ~72px (reduz
   automaticamente se não couber em 2 linhas), branco, centralizado abaixo da
   logo. **Composição determinística com Pillow, não geração por IA** — pedir
   isso pro modelo de imagem não funciona (erra texto, não conhece a logo
   real). `--title` é um título **curto e editorial**, não necessariamente o
   `title` completo do front matter (que geralmente tem sufixo de SEO tipo
   " - Amigo Violão" — não incluir isso na tarja).
   - **Como encurtar**: pegue a promessa do post e jogue fora o resto. O
     título de SEO "Curso de violão completo: O que deve conter?" virou
     "O que um curso de violão deve conter?"; "Dedilhado Violão: Os vários
     níveis e como aprimorar!" virou "Como aprimorar seu dedilhado". Corte o
     prefixo de palavra-chave (o que vem antes dos dois-pontos), o sufixo da
     marca e a exclamação. Mire em 4–7 palavras: a fonte encolhe sozinha se
     não couber em 2 linhas, mas título espremido em corpo 40 no grid do
     `/blog` fica ilegível no celular.
   - **Salva sempre uma cópia sem a tarja** em
     `content/blog-cover-originals/<slug>.jpg` (fora de `public/`, nunca é
     servida no site) antes de desenhar por cima. Existe pra nunca mais
     perder a arte original — já aconteceu de precisar reaplicar a tarja com
     outra cor/texto e a base já ter sido sobrescrita, sem alternativa a não
     ser gerar tudo de novo do zero (novo custo, composição diferente).
   - **Cor da tarja é automática** (`--bar-color auto`, o default): calcula a
     cor média da região que a tarja vai cobrir e escolhe, entre **6 cores
     oficiais da marca** agrupadas em **3 famílias de matiz** — laranja
     (`orange`/`orange-dark`), teal (`teal`/`teal-dark`) e escuro
     (`dark`/`charcoal`; ver `--brand-*` em `globals.css`) — a que contrasta
     mais: fundo frio → família laranja; fundo quente → família teal; fundo
     escuro/pouco saturado → família escura. Nunca uma cor arbitrária fora
     dessas 6.
     **Anti-repetição em duas camadas**: nunca repete a cor exata das
     últimas 4 gerações, e **nunca repete a família das últimas 2** —
     essencial, porque `teal` seguido de `teal-dark` tecnicamente não repete
     mas de longe, no grid do `/blog`, parece a mesma cor duas vezes seguidas
     (foi exatamente o que aconteceu antes desse ajuste: 3 capas seguidas em
     tons de teal). Com só 3 famílias e janela 2, sempre sobra pelo menos uma
     livre — na prática roda em ciclo pelas 3. Force uma cor específica com
     `--bar-color <nome>` se quiser (nesse caso não passa pelo anti-repetição).
   - **Legibilidade filtra antes da harmonia.** Como a tarja é translúcida
     (72%), a cena por baixo continua influindo: uma tarja clara sobre um
     trecho claro da imagem apaga o texto branco. O script mede o contraste
     do branco contra o **pixel mais claro** da faixa onde o título cai e
     descarta qualquer cor abaixo de **3:1** (piso do WCAG pra texto grande,
     que é o caso em ~72px) antes de aplicar a preferência de matiz. Na
     prática isso barra quase sempre o `teal` claro — ele mede 1,9–2,2:1
     contra branco, **em qualquer cena**, então nunca deve ser forçado via
     `--bar-color` numa capa com título.
   - **O histórico (`.fal_bar_color_history.json`) é versionado de propósito**
     — não coloque no `.gitignore`. Já esteve ignorado uma vez, o arquivo
     sumiu junto com o estado, o anti-repetição passou a ver histórico vazio e
     6 das 9 capas da época saíram todas em teal. Se ele sumir de novo,
     reconstrua a partir das capas publicadas (abra os `.webp` em
     `public/images/blog/`, amostre a tarja e anote as últimas 4 na ordem
     cronológica do `git log`) antes de gerar a próxima.
2. **Otimize**: `python scripts/optimize_images.py --src public/images/blog`
   converte para `.webp` e redimensiona se estiver largo demais. Mantém o
   `.jpg` original ao lado até alguém atualizar as referências e rodar
   `git rm` nele (mesma convenção do resto do repo). Se a tarja já foi
   aplicada direto num `.webp` (passo 1 depois de já ter otimizado), pode
   pular este passo.
3. **Referencie no post**: no front matter do `.md` em `content/blog/`, aponte
   `featured_image:` **e** `og_image:` para `/images/blog/<slug-do-post>.webp`
   (caminho público, sem `public/` no início — ver outros posts em
   `content/blog/` para conferir o padrão). Nos posts migrados do WordPress os
   dois campos vêm preenchidos com a capa antiga (`/images/blog/2021/09/...`);
   troque os dois. O arquivo antigo fica onde está — outros posts podem
   referenciá-lo no corpo do texto.
4. Confira a capa em `/<slug-do-post>` antes de considerar pronto —
   `next.config.ts` não tem os domínios do Fal na whitelist de imagem remota,
   então a imagem **precisa** estar baixada em `public/images/`, não linkada
   direto na URL do Fal (que além disso expira). **Antes de rodar `npm run
   dev`, cheque se já não tem um dev server ativo** (`curl localhost:3000`)
   — subir um segundo processo no mesmo repo derrubou o worker de otimização
   de imagem do primeiro (erro 500, cache do Turbopack em conflito). Se já
   tiver um rodando, só reaproveite; senão suba um novo.
