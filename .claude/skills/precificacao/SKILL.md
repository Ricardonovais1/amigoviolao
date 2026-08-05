---
name: precificacao
description: Tabela de preços e regras de precificação dos cursos e pacotes do Amigo Violão. Use ao montar ou revisar páginas de venda, listas de bônus, "valor total", parcelamentos, promoções, upgrades entre pacotes, ou ao adicionar um curso novo ao catálogo.
---

# Precificação — Amigo Violão

Este arquivo é a **fonte única de verdade** de preços. Nenhum valor deve ser
inventado ou arredondado em página de venda: todos saem daqui.

## Regra fundamental

**Um curso tem um único preço, em qualquer lugar onde apareça.** O "Curso para
Crianças" custa R$ 397 na página dele e vale R$ 397 quando entra como bônus em
qualquer outro pacote. Preço divergente entre páginas é bug.

## Preço de cada curso

Os cursos são trilhas dentro do Hotmart. Faixas: **carro-chefe** (397–497),
**especialista** (197–297), **apoio** (97–147).

| Curso | Preço |
|---|---:|
| PROVIC – Professor de violão para crianças | 497 |
| Curso para Crianças | 397 |
| Curso para Iniciantes | 397 |
| VEM – Violão para educadores musicais | 347 |
| Teoria musical | 297 |
| Leitura musical | 297 |
| Técnicas de violão | 297 |
| Peças de violão solo | 247 |
| Técnicas de violão Flamenco | 197 |
| Universos Pentatônica (improvisação) | 197 |
| Tópicos de violão popular | 197 |
| Melodias de guitarra para crianças | 197 |
| Músicas Gospel para crianças | 197 |
| Dicionários de Ritmos | 147 |
| Cifras facilitadas | 147 |
| Jogos interativos para crianças | 97 |

## Composição dos pacotes

| Curso | Crianças | Iniciantes | Clássico | Completo |
|---|:-:|:-:|:-:|:-:|
| Curso para Crianças | x | | | x |
| Músicas Gospel para crianças | x | | | x |
| Melodias de guitarra para crianças | x | | | x |
| Jogos interativos para crianças | x | | | x |
| Cifras facilitadas | x | x | | x |
| Curso para Iniciantes | | x | x | x |
| Dicionários de Ritmos | | x | x | x |
| Tópicos de violão popular | | x | | x |
| Universos Pentatônica | | x | | x |
| Peças de violão solo | | | x | x |
| Leitura musical | | | x | x |
| Teoria musical | | | x | x |
| Técnicas de violão | | | x | x |
| Técnicas de violão Flamenco | | | x | x |
| PROVIC | | | | x |
| VEM | | | | x |
| **Total de cursos** | **5** | **5** | **7** | **16** |

Nenhum pacote é subconjunto de outro — cada um tem conteúdo exclusivo frente
aos demais. Isso é o que sustenta a existência de quatro SKUs; ao alterar a
matriz, revalide essa propriedade (ver *Invariantes*).

## Preço dos pacotes

| Pacote | Cursos | Soma dos cursos | À vista | 12x | Economia | Por curso |
|---|:-:|---:|---:|---:|---:|---:|
| Crianças | 5 | 1.035 | **567** | 58,64 | 468 (45,2%) | 113,40 |
| Iniciantes | 5 | 1.085 | **567** | 58,64 | 518 (47,7%) | 113,40 |
| Clássico | 7 | 1.879 | **657** | 67,95 | 1.222 (65,0%) | 93,86 |
| Completo | 16 | 4.152 | **937** | 96,91 | 3.215 (77,4%) | 58,56 |

O tier "Completo" é o antigo "Professores". PROVIC e VEM continuam sendo a
formação docente destacada dentro dele — o nome do tier não deve excluir o
hobbista que quer o catálogo inteiro.

### Parcelamento

```
parcela = preco_a_vista × 1,2411 ÷ 12
```

Fator 1,2411 ≈ 24,11% de juros — é o que o Hotmart pratica no 12x. Sempre
exibir as duas opções: "12x de R$ X ou R$ Y à vista". O valor exato quem
calcula é a plataforma; o da tabela serve para a página.

## Como montar a lista de bônus de uma página

1. Defina o **carro-chefe** da página (o curso que dá nome ao pacote).
2. **Bônus** = todos os outros cursos do pacote, cada um com seu preço de tabela.
3. **"Valor total"** exibido = soma de *todos* os cursos do pacote (carro-chefe
   incluído), nunca só os bônus.
4. O preço do pacote vem da tabela acima.

### Página Crianças — total R$ 1.035, por R$ 567

Carro-chefe: Curso para Crianças (397). Bônus (638):

| Bônus | Valor |
|---|---:|
| Músicas Gospel para crianças | 197 |
| Melodias de guitarra para crianças | 197 |
| Cifras facilitadas | 147 |
| Jogos interativos para crianças | 97 |

### Página Iniciantes — total R$ 1.085, por R$ 567

Carro-chefe: Curso para Iniciantes (397). Bônus (688):

| Bônus | Valor |
|---|---:|
| Tópicos de violão popular | 197 |
| Universos Pentatônica | 197 |
| Cifras facilitadas | 147 |
| Dicionários de Ritmos | 147 |

### Página Clássico — total R$ 1.879, por R$ 657

Núcleo (1.138): Leitura musical 297, Teoria musical 297, Técnicas de violão
297, Peças de violão solo 247. Bônus (741):

| Bônus | Valor |
|---|---:|
| Curso para Iniciantes | 397 |
| Técnicas de violão Flamenco | 197 |
| Dicionários de Ritmos | 147 |

O "Curso para Iniciantes" é a porta de entrada do Clássico — boa parte desse
público é iniciante no repertório erudito. Não remover.

### Página Completo — total R$ 4.152, por R$ 937

Núcleo docente (844): PROVIC 497, VEM 347. Bônus: os outros 14 cursos, somando
3.308. É o argumento "toda a família aprende" — aqui ele é cobrado, e não
entregue de graça nos tiers de entrada.

## Invariantes

Toda mudança de preço, promoção ou composição precisa preservar:

1. **Preço do pacote < soma dos seus cursos.**
2. **Desconto % cresce com o tamanho do pacote**: Crianças ≤ Iniciantes <
   Clássico < Completo. Hoje: 45,2% / 47,7% / 65,0% / 77,4%.
3. **Valor por curso cai conforme o pacote cresce**: 113,40 / 113,40 / 93,86 /
   58,56. O Completo é sempre o melhor negócio por real — é para lá que o
   funil empurra.
4. **Ordem de preços**: Crianças = Iniciantes < Clássico < Completo.
5. **Nenhum pacote é subconjunto de outro** (exceto o Completo, que contém
   todos por definição).
6. Nenhum pacote custa mais que o Completo.

Se uma promoção quebrar qualquer um destes pontos, a promoção está errada —
não o invariante.

## Promoções e descontos

- **Piso**: nunca abaixo de 30% off o preço à vista. Pisos atuais: Crianças e
  Iniciantes R$ 397, Clássico R$ 460, Completo R$ 656.
- **Promoção simultânea**: ao descontar, aplique a mesma % em todos os pacotes.
  Descontar um só quebra a ordem de preços e o gradiente de desconto.
- **Nunca descontar curso individual abaixo do preço de tabela** — isso
  invalida o "valor total" exibido em todas as páginas de bônus.
- Histórico: os cursos já foram vendidos a R$ 697 com promoção recorrente a
  R$ 479, com *todos* os cursos inclusos em qualquer pacote. A base antiga está
  ancorada em 479 por tudo; o Completo a 937 é um aumento real para esse
  público. Considerar condição de migração ao comunicar o lançamento.

## Upgrade entre pacotes

**Upgrade = diferença entre os preços à vista.** Nunca cobrar o preço cheio do
pacote de destino — há sobreposição de cursos entre os pacotes e o cliente
pagaria duas vezes pelo mesmo conteúdo.

| De → Para | Valor do upgrade |
|---|---:|
| Crianças → Clássico | 90 |
| Crianças → Completo | 370 |
| Iniciantes → Clássico | 90 |
| Iniciantes → Completo | 370 |
| Clássico → Completo | 280 |

Crianças → Iniciantes (ou o inverso) custa 0 pela regra da diferença, mas os
pacotes só compartilham "Cifras facilitadas". Trate como compra nova com
crédito do que já foi pago: cobre a soma dos cursos ainda não possuídos,
limitada ao preço do pacote de destino.

## Adicionar um curso novo ao catálogo

1. Enquadre numa das faixas: apoio (97/147), especialista (197/247/297),
   carro-chefe (397/497). Terminação sempre em 7.
2. Adicione ao **Completo** — ele contém tudo, por definição.
3. Adicione aos pacotes cujo público o curso realmente serve. Um curso infantil
   não entra num pacote adulto só para inflar o "valor total".
4. Recalcule a soma dos pacotes afetados e **revalide os invariantes**. Se o
   desconto % de um pacote passar o do pacote seguinte, ajuste o preço do
   pacote, não o do curso.
5. Atualize as listas de bônus das páginas afetadas.
