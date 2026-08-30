# Cronograma de implementação — IA no site

Roteiro de execução das ideias discutidas em [conversa sobre personalização e IA
na página de vendas]. Ordenado por dependência técnica, não só por prioridade —
alguns itens de alto impacto (🥇) exigem fundação que ainda não existe no repo
(Supabase não está wireado, só a Home existe).

## Como ler isto

Cada fase pressupõe a anterior pronta. Dentro de uma fase, os itens podem ser
paralelizados. "Esforço" é relativo, não em dias — este projeto ainda não tem
histórico de velocidade para estimar em tempo real.

---

## Fase 0 — Fundação (pré-requisito de tudo)

Nada de personalização dinâmica funciona sem isto:

| Item | Por quê é bloqueante |
|---|---|
| Wireup do Supabase | Guarda perfil do visitante, eventos, respostas do quiz |
| Tracking de eventos básico (page view, scroll, clique em CTA, tempo na seção de preço) | Sem isso, "funil comportamental" e "analytics com IA" não têm dados pra analisar |
| Estruturar conteúdo dos cursos como dados (não só JSX hardcoded) — idade, objetivo, nível, preço | Pré-requisito do quiz/recomendador e da personalização por perfil |
| Repositório central de depoimentos com metadados (idade da criança, objetivo, dificuldade inicial) | Pré-requisito de "depoimentos segmentados" |

**Sem esta fase, os itens 🥇 da tabela original viram só protótipos estáticos
sem aprendizado real.**

---

## Fase 1 — Quick wins (client-side, sem IA generativa)

Alto impacto, baixo risco, não dependem de LLM em produção — são lógica de
regras + os dados da Fase 0.

| Item | Descrição | Esforço |
|---|---|---|
| **Quiz/recomendador de curso** | Perguntas (quem vai aprender, idade, já toca, objetivo) → mapeamento determinístico pra curso. Não precisa de LLM, precisa de dados estruturados. | Médio |
| **Depoimentos segmentados** | Filtrar depoimentos existentes pelo perfil detectado (quiz, UTM, ou página de entrada). Sem inventar nada — só reordenar/filtrar o que já existe. | Baixo |
| **Demonstração interativa** (Ritmo → Acordes → Jogo → Música) | Maior esforço de produto/UX do que de IA — é sequência de mídia + interação, não requer modelo. Vale começar o design cedo porque é o item mais trabalhoso de construir bem. | Alto |

---

## Fase 2 — IA generativa com escopo fechado

Aqui entra LLM de verdade, mas ainda com respostas ancoradas em conteúdo
oficial (RAG), não geração livre.

| Item | Descrição | Esforço |
|---|---|---|
| **FAQ inteligente** | Responde com base no conteúdo oficial (cursos, política de garantia, metodologia) via RAG. Base de conhecimento é pequena — bom ponto de entrada para testar o padrão de "IA + fonte de verdade" antes do vendedor completo. | Médio |
| **Vendedor/consultor de IA** | Extensão do FAQ: conduz conversa, faz perguntas de qualificação, recomenda curso. Reusa a base de conhecimento e a lógica do quiz da Fase 1 como "grounding". | Alto |
| **Busca inteligente** | Entende intenção ("quero aprender aquela música do Titanic") e cruza com catálogo de conteúdo. Menor prioridade se o catálogo de músicas/aulas pesquisável ainda não existe como dado. | Alto (depende de ter conteúdo indexável) |

---

## Fase 3 — Personalização dinâmica

Precisa da Fase 0 (dados de comportamento) madura — sem histórico de eventos
real, qualquer personalização "dinâmica" é só regra hardcoded disfarçada.

| Item | Descrição | Esforço |
|---|---|---|
| **Personalização da página em tempo real** | Adapta headline/CTA/depoimentos conforme intenção detectada (busca, UTM, respostas do quiz). Começa como regras simples, evolui pra modelo depois que houver volume de dados. | Alto |
| **Funil comportamental / retorno personalizado** | Reconhece visitante recorrente e adapta a experiência ("ainda em dúvida sobre qual curso escolher?"). Depende de tracking persistente (Supabase) funcionando de verdade. | Alto |
| **Exit intent contextual** | Variante mais simples do funil comportamental — usa o mesmo sinal (seção vista, tempo, quiz) só que no momento de saída. Fácil de encaixar depois que o funil existe. | Baixo (uma vez que a Fase 3 anterior está pronta) |

---

## Fase 4 — Otimização e escala

Só faz sentido com tráfego e dados suficientes pra ter significância.

| Item | Descrição | Esforço |
|---|---|---|
| **Testes automáticos de copy** | Múltiplas variantes de headline/CTA com decisão de qual venceu baseada em dados reais — decisão final continua humana. | Médio |
| **Analytics com IA** ("onde estamos perdendo compradores?") | Análise de funil com linguagem natural sobre os eventos coletados desde a Fase 0. Quanto mais dados acumulados, mais útil fica — não adianta adiantar isso. | Alto |
| **Vídeos personalizados por perfil** | Biblioteca de vídeos curtos reais, montados por perfil (pra mim / pro meu filho / sou professor). Produção de conteúdo é o gargalo, não engenharia. | Médio (+ produção de vídeo, fora do escopo de código) |

---

## Resumo visual

```
Fase 0 (fundação)
   │
   ├──► Fase 1 (quick wins, sem LLM)
   │        │
   │        └──► Fase 2 (IA generativa com RAG)
   │
   └──► Fase 3 (personalização dinâmica, precisa de dados reais)
            │
            └──► Fase 4 (otimização, precisa de tráfego)
```

## O que fica de fora por enquanto

- Avatar de IA em vídeo — biblioteca de vídeos reais resolve o mesmo problema
  com menos risco de parecer artificial.
- Qualquer personalização que exija inventar depoimento, resultado ou dado —
  IA só reorganiza/filtra conteúdo real, nunca gera prova social.
- Recursos da Fase 3/4 antes de Supabase estar wireado e ter volume de tráfego
  — sem dados reais, "personalização" e "analytics com IA" viram teatro.
