# Arquitetura de oferta — Formação de Professor Amigo Violão

SKU: **Professores** (turma própria no Hotmart Club).
Página: `/cursos/professores`.

## Preço

| | |
|---|---:|
| Âncora (preço de tabela, riscado) | **R$ 1.497** |
| À vista | **R$ 937** |
| Parcelado | **12x R$ 96,91** |
| Desconto exibido | 37,4% |
| Diferença para o SKU Estudantes | R$ 280 |

Parcela pela fórmula da tabela: `937 × 1,2411 ÷ 12 = 96,91`.

### Como sustentar a âncora de 1.497

A âncora **não** é mais a soma dos cursos do catálogo. Somar 16 cursos e chegar
a R$ 4.152 é o erro que essa remodelagem corrige: número grande demais para ser
acreditado, e obriga a chamar curso inteiro de "bônus". Três apoios legítimos,
nesta ordem de força:

1. **É o preço real fora de campanha.** 1.497 precisa ser cobrado em algum
   momento do ano (fora de janela de lançamento/promo), senão vira preço fictício.
2. **Comparação de mercado**: uma formação docente presencial ou uma
   especialização em ensino de música custa múltiplos disso.
3. **ROI**: com mensalidade média de aula particular de violão, **2 alunos novos
   em ~3 meses pagam a formação**. O parcelado (96,91) é menos que uma
   mensalidade de um único aluno.

## Oferta principal (core) — os 3 pilares

O que o professor compra é **a formação completa que o habilita a ensinar nas
3 vertentes**. As trilhas são conteúdo principal, não brinde.

### Pilar 1 — Formação docente (o que te habilita)

- **PROVIC 3.0** — método completo de ensino de violão para crianças: 8 módulos
  (cordas soltas → leitura relativa e absoluta), avaliações e didática de aula.
- **VEM — Violão para Educadores Musicais** — musicalização, aula em grupo e
  aplicação em escola.
- **Organização e condução das aulas** — como decidir o que vem a seguir para
  cada aluno: ler o momento dele, escolher a música/atividade certa, manter
  ritmo de evolução sem apostila fixa.

> **Não existe plano de semestre pronto, e isso é posição de método.** A
> metodologia Amigo Violão defende que não há um caminho único pré-estabelecido
> — o professor identifica a música e a atividade certas para cada momento do
> aluno. Qualquer entregável no formato "roteiro fechado de 6 meses" contradiz o
> que o curso ensina e enfraquece a oferta inteira. O que se entrega é
> **critério de decisão**, não cronograma.

### Pilar 2 — As 3 Trilhas de Aplicação (o que você vai ensinar)

Cada trilha é o método pronto de uma vertente, com o repertório e o material de
apoio que a sustenta:

| Trilha | O que inclui |
|---|---|
| **Trilha Infantil** | Método Violão para Crianças, Músicas Gospel para crianças, Melodias de guitarra para crianças, Jogos interativos |
| **Trilha Iniciantes** | Método Violão para Iniciantes, Cifras facilitadas, Dicionário de Ritmos, Tópicos de violão popular, Universos Pentatônica |
| **Trilha Clássico** | Leitura musical, Teoria musical, Técnicas de violão, Peças de violão solo, Técnicas de violão flamenco |

### Pilar 3 — Credencial, materiais e comunidade

- **Certificado de 45 horas** após aprovação nas avaliações.
- **Materiais para usar em aula**: atividades imprimíveis, PDFs e áudios para
  baixar. São **core** — é o material da metodologia, não um brinde separável.
- **Comunidade de professores** + suporte por WhatsApp.
- **Acesso por 2 anos.**

O certificado é **core, não bônus**. Ele é a única coisa que o SKU Estudantes
nunca entrega — é o que justifica os R$ 280 de diferença e o que impede o
professor de comprar a turma mais barata.

## Bônus exclusivos da Formação — R$ 441

Regra do stack: **o curso te ensina a ensinar; os bônus te ensinam a viver
disso.** Todo bônus é do lado comercial da profissão — por isso nenhum deles
colide com o conteúdo pedagógico do core, e nenhum é curso inteiro.

| # | Bônus | Valor | Status |
|---|---|---:|---|
| 1 | **Calendário do Professor** — gerador de calendário do semestre/ano com os dias de aula do aluno e os feriados já marcados, que garante **2 semanas de férias remuneradas** em julho e janeiro. Serve também de contrato: traz dados do aluno, dia de aula, regras de reposição e a cláusula do descanso remunerado | R$ 197 | produzir (ver abaixo) |
| 2 | **Guia de Precificação e Captação de Alunos** — quanto cobrar, como conseguir o primeiro aluno, como conduzir a aula experimental que fecha matrícula, como reajustar sem perder turma | R$ 147 | produzir |
| 3 | **Kit de Credenciamento** — arte do cartão de visita e selo de professor credenciado Amigo Violão | R$ 97 | já existe |

O bônus 2 saiu de conteúdo que o Ricardo já escreveu no blog
(*ganhar-mais-como-professor-de-violao*, *dar-aulas-de-violao-4-criterios-para-prosperar*)
— custo de produção baixo e ataca a dor **comercial** do professor, que nenhum
curso do catálogo cobre. A aula experimental foi absorvida aqui: é captação, não
merece bônus próprio.

O contrato saiu do antigo "Kit de Início do Professor" porque o **Calendário o
absorve** — o formato mais funcional da ferramenta já é o contrato. O que sobrou
do kit (cartão + selo) virou o bônus 3.

### Por que o Calendário é o bônus mais forte da oferta

1. **Resolve dinheiro, não conteúdo.** Todo o resto do catálogo ensina a
   ensinar. Este garante renda no mês em que o professor não trabalha — a dor
   que nenhum concorrente endereça.
2. **É proprietário.** Nasceu da prática do Ricardo (aprendido com a esposa,
   professora de costura). Não é commodity que o comprador acha no YouTube.
3. **Dobra como contrato**, então entrega duas coisas num artefato só.
4. **Vira ponte para o app**: é a primeira ferramenta do app entregue como
   bônus do curso, e prepara o público para o SaaS.

### Decisão técnica da v1 (importante)

A v1 deve ser **determinística e 100% client-side**, sem chamada à Claude API:

- Dias de aula = recorrência semanal, aritmética pura.
- Feriados nacionais = tabela fixa (lei) + móveis derivados da Páscoa por
  algoritmo.
- Feriados estaduais/municipais = **entrada manual do professor**, nunca
  gerados por LLM. Um modelo inventa feriado municipal com naturalidade, e o
  documento é assinado pelo aluno: data errada vira conflito com cliente.

Consequência boa: sem segredo e sem backend, a ferramenta roda no **export
estático** (`output: "export"`) e é incorporável em qualquer lugar, inclusive
numa rota protegida.

A Claude API entra em **v2, para redigir os "combinados"** (regras de reposição,
descanso remunerado) em linguagem de contrato a partir do texto solto do
professor — geração de texto, não fato datado. Isso exige backend, então
pertence ao app.

### Como proteger quizzes e ferramentas embutidas no Club

O site é export estático em S3/CloudFront: **não há middleware do Next**. A
proteção vive na borda. Em ordem de esforço:

1. **Não-listado forte (hoje, sem infra nova)**: `noindex` + fora do sitemap +
   CloudFront Function em viewer-request exigindo `Referer` de `*.hotmart.com` e
   `Sec-Fetch-Dest: iframe`, mais CSP `frame-ancestors https://*.hotmart.com`.
   Tira do Google e bloqueia acesso direto por URL; o embed continua funcionando.
   Header é forjável — barra o curioso, não o determinado.
2. **CloudFront signed URL/cookie**: validade controlada, URL colada na aula e
   rotacionada.
3. **Auth real (Supabase + webhook Hotmart)**: correto a longo prazo. Atenção:
   cookie de terceiro em iframe cross-site é bloqueado pelo Chrome — exige
   `SameSite=None; Secure` / Storage Access API, ou abrir em aba nova.

Manter **alguns quizzes públicos como isca de SEO** e proteger o banco completo
preserva o topo de funil sem esvaziar o valor do entregável.

### Slot 4 — reservado para o App Amigo Violão (em aberto)

O app (quizzes, jogos e ferramentas de escrita musical) está em
desenvolvimento como projeto separado. Se entrar na oferta, entra neste slot,
com R$ 197 — o que levaria o stack a R$ 638. Três coisas a decidir antes:

1. **Os quizzes de hoje são públicos.** Estão em URL aberta (não divulgada) para
   serem incorporados ao curso. Conteúdo que qualquer um alcança de graça não
   ancora preço nenhum — se virar bônus, um comprador que descobre isso sente
   que pagou por algo gratuito. O caminho mais forte é o inverso: **manter os
   quizzes públicos como topo de funil** (SEO e captação) e colocar no bônus o
   que só o app faz.
2. **O que só o app faz** é o que vale como bônus de professor: acompanhar
   turma, atribuir atividades a alunos, ver resultados, ferramentas de escrita
   musical. Um *painel de turma* é entregável exclusivo de professor — nem o
   quiz público nem o SKU Estudantes têm equivalente.
3. **O app é SaaS futuro com receita própria.** Dar acesso vitalício como bônus
   de curso canibaliza esse produto. Se entrar, entra **com prazo** (ex.: 12
   meses do plano professor), o que preserva o modelo e ainda cria renovação.

Enquanto não decidir, o stack fica em R$ 441 — nada na página depende disso.
O **Calendário do Professor** (bônus 1) já é a primeira peça do app entregue
como bônus, então boa parte dessa ponte já está feita.

### O que sai da lista de bônus atual

A página hoje anuncia como bônus itens que agora são core:

- ~~Curso de Violão Clássico (R$ 479)~~ → **Trilha Clássico** (Pilar 2)
- ~~Violão para Educadores Musicais (R$ 197)~~ → **Pilar 1**
- ~~Técnica de violão flamenco (R$ 197)~~ → dentro da **Trilha Clássico**
- ~~Campo Harmônico e Ritmos brasileiros (R$ 197)~~ → dentro da **Trilha Iniciantes**
- ~~Certificado de 45h~~ → **Pilar 3**
- ~~Contrato + comunidade~~ → contrato vira **Bônus 1**; comunidade é **Pilar 3**

Total de bônus cai de R$ 1.070 para R$ 441 — e a oferta fica mais forte, porque
o que saiu subiu para a promessa principal em vez de virar brinde.

## Estrutura da página

1. **Hero** — promessa docente (professor reconhecido, com método, menos desistência).
2. **Dor** — os 4 erros do ensino de violão para crianças.
3. **O método PROVIC** — módulos (Pilar 1).
4. **As 3 Trilhas de Aplicação** — seção nova; ocupa o lugar do antigo bloco de
   "bônus" com cursos inteiros. É aqui que a oferta fica grande.
5. **Certificação, materiais e comunidade** (Pilar 3).
6. **Bônus exclusivos** — os 3 itens, R$ 441, sob a linha "o curso te ensina a
   ensinar; os bônus te ensinam a viver disso". O Calendário abre a seção: é o
   único item da página que fala de renda, e merece demonstração visual.
7. **Prova social** — professores formados, depoimentos.
8. **Preço** — R$ 1.497 riscado → R$ 937 à vista ou 12x R$ 96,91, com o
   enquadramento de ROI ("2 alunos pagam a formação").
9. **Garantia 30 dias · FAQ · CTA final.**

## Implicações de código

- `src/components/sales/PricingCTA.tsx` tinha preço hardcoded (R$ 697 / 12x
  R$ 49,54 / R$ 479) — agora é prop-driven (`anchorPrice`, `installments`,
  `cashPrice`), com os valores antigos como default. Nenhuma página mudou de
  preço ainda; ao aplicar a oferta nova, cada página passa os valores do SKU.
- `ValueStack` na página de professores: `bonuses` passa a ter os 3 itens novos
  e `totalNote` passa a citar R$ 441.
- O bloco `CrossSell` com `bonusItems` vira uma seção **Trilhas** (não é mais
  "bônus" nem cross-sell).
- O checkout deste SKU vem de `checkoutDaPagina("professores")` em
  `src/lib/ofertas.ts`, apontando para a oferta `off=u486ufop&bid=1786198009168`
  do produto `D16391337C`, já atribuída à turma Professores.
- FAQ: as respostas que citam "acesso à NAVE com os bônus" precisam ser
  reescritas para a linguagem de trilhas + 2 turmas.

## Invariantes que esta oferta assume

1. Professores ⊃ Estudantes (superconjunto estrito). Substitui o antigo
   invariante de "nenhum pacote é subconjunto de outro".
2. Certificação existe **só** em Professores.
3. Desconto exibido nos dois SKUs fica na mesma faixa (33–38%) — âncoras
   coerentes entre si.
4. Upgrade Estudantes → Professores = R$ 280 (diferença dos preços à vista).
5. Bônus nunca é curso inteiro; faixa de R$ 97 a R$ 197 por item.
6. Bônus nunca contradiz o método. Nada de cronograma fechado — o core ensina
   critério de decisão, não roteiro.
