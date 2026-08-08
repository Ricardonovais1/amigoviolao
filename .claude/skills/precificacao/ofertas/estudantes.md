# Arquitetura de oferta — Estudantes

SKU: **Estudantes** (turma própria no Hotmart Club).
Páginas: `/cursos/criancas`, `/cursos/iniciantes`, `/cursos/classico`.

As três páginas vendem **o mesmo produto**. Não são pacotes diferentes: são
três portas de entrada, cada uma falando com um público. Quem compra pela
página de Crianças recebe também as trilhas de Iniciantes e Clássico.

## Preço

| | |
|---|---:|
| Âncora (preço de tabela, riscado) | **R$ 987** |
| À vista | **R$ 657** |
| Parcelado | **12x R$ 67,95** |
| Desconto exibido | 33,4% |
| Economia exibida | **R$ 330** |
| Upgrade para Professores | R$ 280 |

A âncora é 987 e não um número redondo em 997 porque a diferença para o preço à
vista precisa fechar em R$ 330 — a economia anunciada na página.

Parcela pela fórmula da tabela: `657 × 1,2411 ÷ 12 = 67,95`.

**O preço é idêntico nas três páginas.** Preço divergente entre portas do mesmo
SKU não é posicionamento, é bug — e o comprador que abre duas abas percebe.

### Como sustentar a âncora de 987

1. **É o preço real fora de campanha.** Precisa ser cobrado em algum momento do
   ano, senão vira preço fictício.
2. **Comparação com aula particular** — o argumento mais forte desta oferta.
   Uma mensalidade de aula particular de violão gira em torno de **R$ 320**.

   Cuidado com o arredondamento, porque isto vai para a página: 657 ÷ 320 =
   **2,05 meses**, então "cerca de dois meses de aula" é verdade e "menos que
   dois meses" é mentira. A parcela de 67,95 é **21%** de uma mensalidade —
   "um quinto" está no limite, mas **"menos de um quarto de uma mensalidade"
   é seguro e é a frase que está nas páginas**. Afirmação de preço numa
   landing page precisa aguentar conferência.
3. **Nunca a soma dos cursos.** Os 14 cursos somam R$ 3.308 de tabela, mas esse
   número não vai para a página: é grande demais para ser acreditado e força a
   chamar curso inteiro de "bônus". Ver o mesmo raciocínio em
   [professores.md](professores.md).

## Oferta principal (core) — as 3 Trilhas

Idênticas às do SKU de Professores, menos a formação docente. São **conteúdo
principal em qualquer uma das três páginas** — o que muda é a ordem em que
aparecem.

| Trilha | Cursos | Tabela |
|---|---|---:|
| **Infantil** | Violão para Crianças, Músicas Gospel para crianças, Melodias de guitarra para crianças, Jogos interativos | 888 |
| **Iniciantes** | Violão para Iniciantes, Cifras facilitadas, Dicionário de Ritmos, Tópicos de violão popular, Universos Pentatônica | 1.085 |
| **Clássico** | Leitura musical, Teoria musical, Técnicas de violão, Peças de violão solo, Técnicas de violão flamenco | 1.335 |

14 cursos. Mais: **2 anos de acesso**, materiais para baixar, suporte da
comunidade e garantia de 30 dias.

**Sem certificação.** O certificado de 45h existe só no SKU de Professores — é
ele que sustenta os R$ 280 de diferença. Nenhuma página de estudante pode
prometer certificado, nem por engano no FAQ.

## Bônus — R$ 391 em todas as três páginas

Dois bônus são comuns às três portas; o terceiro é o recorte que serve o
público daquela página. **O total precisa fechar igual nas três** — mesmo
produto, mesmo preço, mesmo valor percebido.

### Comuns às três páginas

| Bônus | Valor | Por quê |
|---|---:|---|
| **Como estudar violão sozinho sem travar** | R$ 147 | A dor real de quem estuda sem professor: saber o que fazer quando empaca. É **critério de decisão**, não cronograma — um plano fechado de estudo contradiria o método (ver invariante 6 em [professores.md](professores.md)). |
| **Escolhendo e cuidando do seu violão** | R$ 97 | Ansiedade de pré-compra: qual instrumento, corda de nylon ou aço, afinação, troca de cordas. Derruba a objeção que trava a matrícula antes mesmo do preço. |

### Específico de cada página

| Página | Bônus | Valor |
|---|---|---:|
| **Crianças** | **Violão para Pais — toque junto com seu filho**: recorte da Trilha Iniciantes, as primeiras músicas em poucos acordes, para o pai ou mãe que não sabe música acompanhar o estudo | R$ 147 |
| **Iniciantes** | **Repertório Clássico Facilitado**: recorte da Trilha Clássico, as peças eruditas ao alcance de quem está começando | R$ 147 |
| **Clássico** | **Da cifra à partitura**: recorte da Trilha Iniciantes e de Tópicos de violão popular, para quem já toca cifra e quer entrar no erudito sem recomeçar do zero | R$ 147 |

Nenhum deles é curso inteiro — são extratos focados, do tamanho certo para
serem acreditados. É o *unbundling*: em vez de anunciar "Curso de Clássico
(R$ 1.335) de bônus", entrega-se o recorte do clássico que mais serve ao
iniciante.

## O que muda de página para página

Só isto. Todo o resto é o mesmo documento.

| | Crianças | Iniciantes | Clássico |
|---|---|---|---|
| **Carro-chefe** | Trilha Infantil | Trilha Iniciantes | Trilha Clássico |
| **Promessa** | Seu filho aprendendo com método — e você acompanhando sem saber música | Do zero ao primeiro repertório, sem depender de aula particular | Leitura, técnica e repertório erudito — o caminho que a cifra não ensina |
| **Dor** | Desmotivação e desistência da criança | Travar nos primeiros acordes e desistir | Tocar de ouvido e nunca sair do lugar |
| **Ordem das trilhas** | Infantil → Iniciantes → Clássico | Iniciantes → Clássico → Infantil | Clássico → Iniciantes → Infantil |
| **Bônus específico** | Violão para Pais | Repertório Clássico Facilitado | Da cifra à partitura |
| **Prova social** | depoimentos de pais | depoimentos de iniciantes adultos | depoimentos de quem migrou do popular |

### As outras trilhas não são "compre também"

O bloco de cross-sell das três páginas perde a função: não há o que vender a
mais. Ele vira uma seção **"e você ainda leva"** — as outras duas trilhas
apresentadas como parte do que já está incluso. É aqui que a oferta fica
grande, e é de graça: o conteúdo já existe.

## Estrutura das páginas

1. **Hero** — promessa da página.
2. **Dor** — a específica daquele público.
3. **A trilha carro-chefe** — módulos, o que a pessoa vai tocar.
4. **"E você ainda leva"** — as outras duas trilhas (ocupa o lugar do antigo
   cross-sell).
5. **Bônus** — os 3 itens, R$ 391.
6. **Prova social** do público daquela página.
7. **Preço** — R$ 997 riscado → R$ 657 à vista ou 12x R$ 67,95, com a
   comparação da aula particular ("dois meses de aula, três métodos, dois anos").
8. **Garantia 30 dias · FAQ · CTA final.**

## Implicações de código

- Todas as três páginas passam a apontar para o **checkout de Estudantes**.
  `HOTMART_CHECKOUT_URL` hoje serve a página de Crianças; confirmar se é o
  produto certo para o SKU unificado ou se um produto novo será criado.
- `PricingCTA` já é prop-driven: cada página passa `anchorPrice={997}`,
  `installmentPrice={67.95}`, `cashPrice={657}`.
- **JSON-LD com `price: "479.00"`** nas três páginas (`criancas`, `iniciantes`,
  `classico`) precisa virar `657.00`. Preço estruturado divergente do exibido é
  inconsistência que o Google lê.
- `StickyMobileCTA` recebe `price="12x de R$67,95"`.
- `CrossSell` vira a seção "e você ainda leva"; `ValueStack` recebe os 3 bônus
  novos e `totalNote` de R$ 391.
- FAQ das três páginas: remover qualquer menção a certificado e à antiga
  linguagem de pacotes/NAVE; responder "tem certificado?" com o caminho de
  upgrade para Professores.

## Base antiga

Os cursos já foram vendidos a R$ 697 com promoção recorrente a **R$ 479**. Quem
comprou está ancorado nesse número, e R$ 657 é aumento real para essa base —
ainda que hoje receba as três trilhas em vez de um pacote. Vale uma condição de
migração no lançamento; sem ela, o reajuste vira atrito com quem já é cliente.

## Invariantes desta oferta

1. **Preço idêntico nas três páginas.** São portas, não pacotes.
2. **Total de bônus idêntico nas três páginas** (R$ 391). Valor percebido
   diferente para o mesmo produto é o que quebra a confiança de quem compara.
3. **Nenhuma página de estudante promete certificação.**
4. Bônus nunca é curso inteiro; faixa de R$ 97 a R$ 197 por item.
5. Bônus nunca contradiz o método — nada de cronograma fechado de estudo.
6. Estudantes ⊂ Professores. Upgrade = R$ 280, a diferença dos preços à vista.
