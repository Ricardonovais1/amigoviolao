# Calendário do Professor — especificação

Ferramenta geradora do calendário/contrato que o professor entrega ao aluno.
Entra como **bônus 1** da oferta de Professores (ver
`.claude/skills/precificacao/ofertas/professores.md`) e depois é portada para o
app.

## O modelo econômico

O plano **é um número de aulas**, não uma duração:

| Plano | Aulas |
|---|--:|
| Mensal | 4 |
| Trimestral | 12 |
| Semestral | 24 |
| Anual | 48 |

O ano tem 52 semanas. Um contrato anual promete 48 aulas, logo **as 4 semanas
restantes são o descanso remunerado** — o aluno paga 12 mensalidades iguais e o
professor entrega 48 aulas. A "5ª aula" dos 4 meses que têm 5 ocorrências do dia
da semana é o que custeia esse descanso.

Férias, portanto, **não são um intervalo de datas**: são a **folga** entre as
ocorrências disponíveis e as N aulas prometidas. Isso vale para todos os planos
— o plano muda o preço e o compromisso, nunca o direito ao descanso.

## Regra de feriados (a que já vigora nos contratos)

> Um feriado por semestre que caia no dia da aula é **abonado** (não acontece e
> não é devido). Do segundo em diante, dentro do mesmo semestre, a aula é
> **reposta**.

### Cálculo da folga

```
O  ocorrências do dia da semana na janela
R  feriados a repor  = Σ por semestre: max(feriados_no_semestre − 1, 0)
U  aulas úteis       = O − R
folga (semanas de descanso) = U − N
```

### A folga não é constante — este é o ponto

Semanas de descanso que cada combinação comporta, num contrato anual (N=48):

| | SEG | TER | QUA | QUI | SEX | SÁB |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| **2025** | 3 | 4 | 5 | 2 | 4 | 4 |
| **2026** | 2 | 3 | 4 | 4 | 2 | 4 |
| **2027** | 4 | 2 | 4 | 4 | 4 | 3 |

Validação: terça/2025 → 4 semanas, exatamente as 4 terças pintadas de rosa no
calendário real da Larissa (07/01 e 16, 23, 30/12). O modelo reproduz a prática.

**Consequência prática:** o texto padrão em uso hoje promete 5 semanas (as 2
últimas de julho + a última de dezembro + as 2 primeiras de janeiro). Só
quarta/2025 comporta 5. Quinta/2025 e sexta/2026 comportam 2. O texto dos
combinados **não pode trazer as semanas de descanso escritas fixas** — tem de
ser preenchido pelo cálculo.

## Comportamento da ferramenta

### Janela

Janela rolante de N meses a partir do mês de início do contrato, **12 por
padrão**, mínimo 6. Não usa ano civil: quem começa em novembro vê janeiro em
tamanho normal, não em miniatura. O "ano seguinte reduzido" do calendário
antigo era um contorno para a falta da janela rolante; fica como opção
desligada por padrão.

Planos mensal e trimestral também recebem a janela cheia — mostrar o ano
inteiro ao aluno é o recado de continuidade.

### Marcação dos dias

| Estado | Cor | Significado |
|---|---|---|
| Aula | `#00A63E` verde | dia de aula do contrato |
| Reposição | `#48C2C3` teal | aula remarcada fora do dia habitual |
| Feriado | `#F89C2D` âmbar | não tem aula; abonada ou reposta conforme a regra |
| Férias | `#EF5400` laranja | descanso remunerado |

As aulas além do plano contratado usam **a mesma cor** das contratadas: o
calendário pressupõe a continuação, e diferenciá-las passaria a mensagem
contrária. A observação automática diz isso por escrito.

### Reposições

Quando o dia da semana não comporta as aulas do plano, o professor **precisa**
resolver antes de gerar o PDF: ou marca as datas de reposição, ou assinala
"Combinarei depois com o responsável". O botão de exportar fica desabilitado até
lá — é o que impede um contrato de sair prometendo aulas que o calendário não
entrega.

Uma data de reposição que caia num dia já marcado como aula ou como descanso é
ignorada no balanço: contá-la somaria a mesma aula duas vezes.

### Férias posicionáveis

A ferramenta calcula **quantas** semanas de descanso o contrato comporta,
pré-posiciona nos lugares tradicionais (2 últimas de julho, virada dez/jan) e
permite que o professor mova. Um contador exibe permanentemente **N/N aulas
marcadas**; se ele empurrar uma semana a mais, acusa 47/48 e o documento não
fecha. A quantidade é rígida, o posicionamento é livre — o "quando" pode ser
recombinado com o aluno depois.

### Feriados locais

Nacionais embutidos (fixos + móveis por algoritmo da Páscoa). Estaduais e
municipais são **entrada manual do professor**, antes de gerar o PDF. Nunca
gerados por LLM: o documento é assinado pelo aluno e uma data errada vira
conflito com cliente.

### Observação automática

Gerada a partir do cálculo, em duas versões:

- **Folga fecha**: explica que a 5ª aula dos meses longos custeia o descanso.
- **Folga apertada**: *"Neste período, 4 quintas-feiras caem em feriados. Duas
  são abonadas e duas serão repostas em comum acordo, o que reduz o descanso
  deste contrato a 2 semanas."*

Somam-se as observações livres que o professor escrever (ex.: "as aulas
começaram na última semana de junho/2026, período que não consta neste
calendário").

## Saída

Duas páginas A4:

1. **Calendário** — barra lateral com logo, legenda e dados do contrato
   (aluno, plano, início, fim, dia e horário, valor e vencimento) + grade dos
   meses, semana começando na segunda, domingo em destaque.
2. **Informações Importantes** — reposições, férias e observações, com texto
   padrão pré-preenchido e editável.

Renderização: **SVG em dimensões A4 exatas** como fonte única — o mesmo SVG vai
para a tela e para o PDF via `jsPDF` + `svg2pdf.js`. Evita o `window.print()`,
que carimba URL e data na folha. Vetorial, sem marca de navegador, e roda 100%
no cliente.

## Estado da implementação (v1)

| Arquivo | Papel |
|---|---|
| `src/lib/calendario/datas.ts` | helpers date-only (nunca `new Date("…")`, que parseia em UTC) |
| `src/lib/calendario/feriados.ts` | Páscoa por Meeus/Jones/Butcher + feriados nacionais |
| `src/lib/calendario/calculo.ts` | janela, marcação dos dias, balanço, férias padrão |
| `src/lib/calendario/textos.ts` | combinados e observações automáticas |
| `src/components/ferramentas/CalendarioDocumento.tsx` | as 2 páginas em SVG A4 |
| `src/components/ferramentas/CalendarioDoProfessor.tsx` | formulário, conferência e exportação |
| `src/components/ferramentas/CalendarioClient.tsx` | carrega a ferramenta com `ssr: false` |
| `src/app/ferramentas/calendario-do-professor/page.tsx` | rota, `noindex` |

Validação do motor: terça-feira em 2025 devolve folga de 4 semanas — exatamente
as 4 terças pintadas de rosa no calendário real da Larissa. PDF conferido: 2
páginas, A4 exato (595,3 × 841,9 pt), texto vetorial selecionável, sem carimbo
de navegador.

### Tipografia

O PDF sai em **Poppins**, embutida via `src/lib/calendario/poppins.ts` (subset
latino do Google Fonts, 16 KB por peso, com todos os acentos do português
conferidos). O SVG declara `font-family: Poppins, var(--font-poppins),
sans-serif`: o navegador ignora o primeiro nome e cai na variável do next/font,
enquanto o `svg2pdf` casa com "Poppins" — o nome sob o qual a fonte é
registrada no jsPDF. Preview e impressão ficam com a mesma tipografia.

O módulo das fontes entra por import dinâmico, junto do jsPDF, só na hora de
exportar.

### Marca no documento

O logo é o lockup completo (`public/images/logo-amigo-violao-completo.png`),
com a linha **"Gerado na plataforma Amigo Violão"** logo abaixo. A distinção
importa: o documento é emitido por quem já dá aula, não por quem foi
credenciado pelo Amigo Violão — a marca identifica a plataforma que gerou o
papel, não chancela o professor.

O PNG é reduzido para 320 px sobre fundo branco antes de entrar no PDF. O jsPDF
grava bitmap cru a 4 bytes por pixel; sem essa redução, o arquivo original
sozinho levava o PDF a 1,2 MB (hoje ~310 KB).

### Pendências conhecidas

- **Proteção na borda ainda não existe**: hoje só há `noindex` e a exclusão do
  sitemap. A CloudFront Function e a chave de acesso do Ricardo (`?k=…`)
  precisam ser criadas no deploy.
- **Feriado e férias são dois laranjas** (`#F89C2D` e `#EF5400`). Distinguem-se,
  mas não à primeira vista; se virar queixa, a legenda resolve — ou troca-se o
  feriado por um tom mais amarelo.

## Restrições de arquitetura

- O site é `output: "export"` (estático em S3/CloudFront): **sem servidor, sem
  API routes, sem middleware**. A v1 é inteiramente client-side e sem segredos.
- **Sem Claude API na v1.** Datas são aritmética; LLM alucina feriado
  municipal. A API entra na v2/app apenas para **redigir os combinados** a
  partir de texto solto do professor — geração de texto, não fato datado. Isso
  exige backend e pertence ao app.
- Rota protegida: `/ferramentas/calendario-do-professor`, `noindex`, fora do
  sitemap, atrás da CloudFront Function (referer Hotmart + `Sec-Fetch-Dest:
  iframe`). Acesso do próprio Ricardo por **chave na URL** (`?k=…`) que grava
  cookie de longa duração — sem login e senha.
