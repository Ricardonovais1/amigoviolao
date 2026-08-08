---
name: precificacao
description: Preços, ancoragem e arquitetura de oferta dos dois SKUs do Amigo Violão (Estudantes e Professores). Use ao montar ou revisar páginas de venda, listas de bônus, "valor total", parcelamentos, promoções, upgrade entre SKUs, ou ao adicionar um curso novo ao catálogo.
---

# Precificação — Amigo Violão

Fonte única de verdade de preços. Nenhum valor é inventado ou arredondado numa
página de venda: todos saem daqui.

A arquitetura de oferta de cada página está em `ofertas/`:

- [ofertas/estudantes.md](ofertas/estudantes.md) — Crianças, Iniciantes, Clássico
- [ofertas/professores.md](ofertas/professores.md) — Formação de Professor

## Dois SKUs, quatro páginas

O catálogo é vendido como **dois produtos**, cada um com sua turma no Hotmart
Club. As quatro páginas de venda continuam existindo — mas três delas são
portas de entrada para o mesmo produto.

| SKU | Páginas | Turma |
|---|---|---|
| **Estudantes** | `/cursos/criancas`, `/cursos/iniciantes`, `/cursos/classico` | Estudantes |
| **Professores** | `/cursos/professores` | Professores |

**Professores ⊃ Estudantes**: o SKU docente contém tudo do SKU de estudante,
mais a formação (PROVIC, VEM) e a certificação de 45h.

## Preços

| SKU | Âncora (riscado) | À vista | 12x | Desconto | Economia exibida |
|---|---:|---:|---:|---:|---:|
| **Estudantes** | 987 | **657** | 67,95 | 33,4% | 330 |
| **Professores** | 1.497 | **937** | 96,91 | 37,4% | 560 |

A âncora de Estudantes é 987 e não 997 de propósito: a diferença precisa fechar
em R$ 330 redondos, que é a economia que a página anuncia. A linha "Economize
R$ X hoje" é calculada pelo `PricingCTA` a partir da própria âncora — não há
como ela divergir dos dois preços exibidos.

Upgrade Estudantes → Professores: **R$ 280** (a diferença dos preços à vista).

### Parcelamento

```
parcela = preco_a_vista × 1,2411 ÷ 12
```

Fator 1,2411 ≈ 24,11% de juros — é o que o Hotmart pratica no 12x. Sempre
exibir as duas opções: "12x de R$ X ou R$ Y à vista". O valor exato quem
calcula é a plataforma; o da tabela serve para a página.

## Regra de ancoragem

**A âncora nunca é a soma dos cursos.** Somar o catálogo e chegar a R$ 4.152
produz um número grande demais para ser acreditado, e obriga a chamar curso
inteiro de "bônus" — o que esvazia a promessa principal em vez de reforçá-la.

A âncora se sustenta em três apoios, nesta ordem de força:

1. **É o preço real fora de campanha.** Precisa ser cobrado em algum momento do
   ano, senão é preço fictício.
2. **Comparação de mercado.** Para Estudantes, aula particular de violão
   (~R$ 320/mês): R$ 657 são cerca de dois meses de aula por três métodos
   completos, e a parcela de R$ 67,95 é **menos de um quarto de uma
   mensalidade**. Confira o arredondamento antes de escrever — 657 ÷ 320 =
   2,05, então "menos que dois meses" seria falso. Para Professores,
   comparação com formação docente presencial.
3. **ROI.** Professores: dois alunos novos em ~3 meses pagam a formação.

## Regra de bônus

1. **Bônus nunca é curso inteiro.** Curso inteiro é conteúdo principal — sobe
   para a promessa, não vira brinde.
2. **Faixa de R$ 97 a R$ 197 por item.** Acima disso não é bônus, é oferta.
3. **Bônus é sempre um recorte focado** de algo maior, dirigido ao público
   daquela página (*unbundling*).
4. **Bônus nunca contradiz o método.** A metodologia Amigo Violão defende que
   não há caminho único pré-estabelecido: o professor identifica a atividade
   certa para cada momento do aluno. Qualquer entregável no formato "cronograma
   fechado" enfraquece a oferta inteira. Entrega-se **critério de decisão**,
   nunca roteiro.
5. **O stack é idêntico nas três páginas de Estudantes** (R$ 391). Mesmo
   produto e mesmo preço com valor percebido diferente é o que quebra a
   confiança de quem compara duas abas.

Stacks atuais: Estudantes **R$ 391**, Professores **R$ 441**.

## Preço de tabela dos cursos

Estes valores **não vão para a página**. Servem para posicionar um curso novo
numa faixa e para compor as trilhas. Faixas: **carro-chefe** (397–497),
**especialista** (197–297), **apoio** (97–147). Terminação sempre em 7.

| Curso | Preço | Trilha |
|---|---:|---|
| PROVIC – Professor de violão para crianças | 497 | Formação docente |
| VEM – Violão para educadores musicais | 347 | Formação docente |
| Curso para Crianças | 397 | Infantil |
| Curso para Iniciantes | 397 | Iniciantes |
| Teoria musical | 297 | Clássico |
| Leitura musical | 297 | Clássico |
| Técnicas de violão | 297 | Clássico |
| Peças de violão solo | 247 | Clássico |
| Técnicas de violão Flamenco | 197 | Clássico |
| Universos Pentatônica (improvisação) | 197 | Iniciantes |
| Tópicos de violão popular | 197 | Iniciantes |
| Melodias de guitarra para crianças | 197 | Infantil |
| Músicas Gospel para crianças | 197 | Infantil |
| Dicionários de Ritmos | 147 | Iniciantes |
| Cifras facilitadas | 147 | Iniciantes |
| Jogos interativos para crianças | 97 | Infantil |

## Composição dos SKUs

| Trilha | Cursos | Estudantes | Professores |
|---|:-:|:-:|:-:|
| Infantil | 4 | x | x |
| Iniciantes | 5 | x | x |
| Clássico | 5 | x | x |
| Formação docente (PROVIC, VEM) | 2 | | x |
| **Total** | **16** | **14** | **16** |

Só o SKU de Professores tem **certificação de 45h**. É o que sustenta os R$ 280
de diferença e o que impede o professor de comprar a turma mais barata.

## Invariantes

Toda mudança de preço, promoção ou composição precisa preservar:

1. **Professores ⊃ Estudantes** (superconjunto estrito).
2. **Preço idêntico nas três páginas de Estudantes.** São portas do mesmo
   produto, não pacotes diferentes.
3. **Total de bônus idêntico nas três páginas de Estudantes.**
4. **Certificação existe só em Professores.** Nenhuma página de estudante a
   promete, nem no FAQ.
5. **Desconto exibido nos dois SKUs na mesma faixa** (33–38%). Âncoras
   incoerentes entre si denunciam que uma delas é inventada.
6. **Upgrade = diferença dos preços à vista.** Nunca cobrar o preço cheio do
   SKU de destino: o conteúdo se sobrepõe e o cliente pagaria duas vezes.
7. Nenhum bônus é curso inteiro, nem passa de R$ 197.

Se uma promoção quebrar qualquer um destes pontos, a promoção está errada —
não o invariante.

## Promoções e descontos

- **Piso**: nunca abaixo de 30% off o preço à vista. Pisos atuais: Estudantes
  **R$ 460**, Professores **R$ 656**.
- **Promoção simultânea**: ao descontar, aplique a mesma % nos dois SKUs.
  Descontar um só estreita a diferença de R$ 280 e mata o upgrade.
- **Nunca anunciar desconto sobre a soma dos cursos** — a âncora é o preço de
  tabela do SKU, não o catálogo somado.
- **Preço no build sai de `src/lib/ofertas.ts`**, não daqui. Para rodar uma
  promoção, preencha a constante `PROMOCAO` naquele arquivo: as quatro páginas
  acompanham, com a parcela recalculada pela fórmula. Este markdown é a fonte
  de verdade das *decisões*; aquele módulo é a do *build*.
- Os checkouts também: `CHECKOUT` em `ofertas.ts` guarda um link por página
  (as três portas de Estudantes apontam para ofertas diferentes do mesmo
  produto Hotmart, nomeadas pelo carro-chefe), com fallback para os links
  legados enquanto as ofertas novas não existirem.

## Base antiga

Os cursos já foram vendidos a R$ 697 com promoção recorrente a **R$ 479**, com
todos os cursos inclusos em qualquer pacote. Essa base está ancorada em 479, e
tanto 657 quanto 937 são aumento real para ela. Considerar condição de migração
ao comunicar o lançamento.

## Adicionar um curso novo ao catálogo

1. Enquadre numa faixa: apoio (97/147), especialista (197/247/297), carro-chefe
   (397/497). Terminação sempre em 7.
2. Escolha a **trilha** cujo público o curso realmente serve. Um curso infantil
   não entra na trilha clássica só para inflar número.
3. Ele entra automaticamente nos dois SKUs — as três trilhas são comuns. Só
   curso de formação docente fica restrito a Professores.
4. **Não recalcule preço de SKU por causa disso.** O preço vem da âncora e da
   comparação de mercado, não da soma. Um curso novo aumenta o valor entregue
   sem mexer no número da página.
5. Se o curso justificar um bônus de página, extraia um **recorte** dele
   (R$ 97–197) — nunca ofereça o curso inteiro como bônus.
