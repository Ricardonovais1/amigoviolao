import {
  AULAS_POR_PLANO,
  ROTULO_PLANO,
  type Balanco,
  type Contrato,
  type Resultado,
} from "./calculo";
import {
  DIAS_SEMANA_NOME,
  DIAS_SEMANA_PLURAL,
  deIso,
  porExtenso,
  porExtensoCurto,
} from "./datas";

export type Item = { tipo: "paragrafo" | "bullet" | "nota"; texto: string };
export type Bloco = { titulo: string; itens: Item[] };

const plural = (n: number, um: string, muitos: string) =>
  n === 1 ? um : muitos;

/** "3 semanas" / "1 semana" */
const semanas = (n: number) => `${n} ${plural(n, "semana", "semanas")}`;

export function blocoReposicoes(contrato: Contrato): Bloco {
  const aluno = contrato.aluno.trim() || "o(a) aluno(a)";
  const professor = contrato.professor.trim() || "o(a) professor(a)";
  return {
    titulo: "Sobre as Reposições",
    itens: [
      {
        tipo: "paragrafo",
        texto: "Nós poderemos repor a aula sempre que acontecer alguma destas situações:",
      },
      { tipo: "bullet", texto: `Se ${aluno} ficar doente;` },
      {
        tipo: "bullet",
        texto: `Se eu, ${professor}, precisar faltar por qualquer motivo;`,
      },
      {
        tipo: "bullet",
        texto: "Se vocês precisarem desmarcar por outro motivo, desde que me avisem com pelo menos 48 horas de antecedência;",
      },
      {
        tipo: "bullet",
        texto: "Se nossa aula incidir em dois feriados dentro do mesmo semestre (nesse caso, repomos uma delas).",
      },
    ],
  };
}

export function blocoFerias(resultado: Resultado): Bloco {
  const { balanco } = resultado;
  const itens: Item[] = [
    {
      tipo: "paragrafo",
      texto: "Temos períodos de férias remuneradas ao longo do contrato — semanas em que não há aula e a mensalidade segue normal.",
    },
  ];

  if (balanco.semanasMarcadas > 0) {
    itens.push({
      tipo: "paragrafo",
      texto: `Neste calendário estão marcadas ${semanas(
        balanco.semanasMarcadas,
      )} de descanso, destacadas em laranja na grade.`,
    });
  }

  itens.push({
    tipo: "paragrafo",
    texto: "Como funciona: essas semanas de descanso são custeadas pelos meses do ano que têm cinco semanas. Nesses meses mais longos, a quinta aula acontece normalmente e não é cobrada à parte.",
  });

  // O disclaimer é o que impede o documento de virar uma promessa rígida: a
  // quantidade de descanso é calculada, mas as datas são combináveis.
  itens.push({
    tipo: "nota",
    texto: "As semanas de descanso poderão ser definidas em comum acordo entre professor e aluno. Este calendário não engessa essa questão: se as datas mudarem, ele pode ser gerado novamente a qualquer momento.",
  });

  return { titulo: "Sobre as Férias", itens };
}

/**
 * As observações que o professor não teria como escrever à mão, porque
 * dependem de contar feriado a feriado no dia da semana da aula.
 */
export function observacoesAutomaticas(
  contrato: Contrato,
  resultado: Resultado,
): string[] {
  const b: Balanco = resultado.balanco;
  const notas: string[] = [];
  const diaPlural = DIAS_SEMANA_PLURAL[contrato.diaSemana];

  if (b.aRepor > 0) {
    const nomes = b.feriadosNoDia.map((f) => f.nome).join(", ");
    const abonadas =
      b.abonados === 1 ? "Uma é abonada" : `${b.abonados} são abonadas`;
    // Com datas de reposição já marcadas, prometer "N serão repostas" soa
    // contraditório para quem lê: o número de feriados a repor nem sempre é o
    // número de datas marcadas, porque a folga do contrato absorve parte.
    notas.push(
      b.reposicoesMarcadas > 0
        ? `Neste período, ${b.feriadosNoDia.length} ${diaPlural} caem em feriados (${nomes}). ` +
            `${abonadas} pela regra, e as reposições necessárias estão marcadas no calendário.`
        : `Neste período, ${b.feriadosNoDia.length} ${diaPlural} caem em feriados (${nomes}). ` +
            `${abonadas} e ${
              b.aRepor === 1 ? "uma será reposta" : `${b.aRepor} serão repostas`
            } em comum acordo.`,
    );
  } else if (b.feriadosNoDia.length > 0) {
    const nomes = b.feriadosNoDia.map((f) => f.nome).join(", ");
    notas.push(
      `Neste período, ${b.feriadosNoDia.length} ${plural(
        b.feriadosNoDia.length,
        `${DIAS_SEMANA_NOME[contrato.diaSemana]} cai`,
        `${diaPlural} caem`,
      )} em feriado (${nomes}), sem necessidade de reposição — a regra abona um feriado por semestre.`,
    );
  }

  if (b.reposicoesMarcadas > 0) {
    const datas = contrato.reposicoes
      .filter(Boolean)
      .sort()
      .map((d) => porExtensoCurto(deIso(d)))
      .join(", ");
    notas.push(
      `${
        b.reposicoesMarcadas === 1
          ? "Uma aula de reposição está agendada"
          : `${b.reposicoesMarcadas} aulas de reposição estão agendadas`
      } fora do dia habitual: ${datas}.`,
    );
  }

  if (b.pendencia > 0 && contrato.combinarDepois) {
    notas.push(
      `${
        b.pendencia === 1 ? "Uma aula do período será reposta" : `${b.pendencia} aulas do período serão repostas`
      } em datas a combinar entre professor e responsável.`,
    );
  } else if (b.saldo < 0) {
    notas.push(
      `As semanas de descanso marcadas excedem em ${semanas(
        Math.abs(b.saldo),
      )} o que este contrato comporta. Para fechar as ${
        b.aulasEsperadas
      } aulas do período, ${plural(
        Math.abs(b.saldo),
        "uma semana precisa ser remarcada ou reposta",
        "essas semanas precisam ser remarcadas ou repostas",
      )}.`,
    );
  } else if (b.saldo > 0) {
    notas.push(
      `Este contrato ainda comporta ${semanas(
        b.saldo,
      )} de descanso além das já marcadas.`,
    );
  }

  // Só vale dizer quando a janela realmente vai além do compromisso: num plano
  // anual de 12 meses ela coincide com ele, e o aviso seria ruído.
  const contratadas = AULAS_POR_PLANO[contrato.plano];
  if (b.aulasEsperadas > contratadas) {
    notas.push(
      `Este calendário contempla aulas além do plano contratado (${ROTULO_PLANO[
        contrato.plano
      ].toLowerCase()}, ${contratadas} ${plural(
        contratadas,
        "aula",
        "aulas",
      )}), pressupondo a continuação do contrato.`,
    );
  }

  return notas;
}

export function blocoObservacoes(
  contrato: Contrato,
  resultado: Resultado,
): Bloco {
  const automaticas = observacoesAutomaticas(contrato, resultado);
  const livres = contrato.observacoes
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const aluno = contrato.aluno.trim();
  return {
    titulo: aluno ? `Observações para ${aluno}` : "Observações",
    itens: [...automaticas, ...livres].map((texto) => ({
      tipo: "bullet" as const,
      texto,
    })),
  };
}

/** Linhas da barra lateral da página 1. */
export function dadosDoContrato(
  contrato: Contrato,
  resultado: Resultado,
): Array<[string, string]> {
  const linhas: Array<[string, string]> = [
    ["ALUNO(A)", contrato.aluno.trim() || "—"],
    ["PLANO", ROTULO_PLANO[contrato.plano]],
    ["INÍCIO", porExtenso(resultado.primeiraAula)],
  ];

  if (resultado.ultimaAula) {
    linhas.push(["ÚLTIMA AULA DO PERÍODO", porExtenso(resultado.ultimaAula)]);
  }

  linhas.push([
    "AULAS ÀS",
    [DIAS_SEMANA_PLURAL[contrato.diaSemana], contrato.horario.trim()]
      .filter(Boolean)
      .join(", "),
  ]);

  linhas.push(["DURAÇÃO", `${contrato.duracao} minutos`]);

  if (contrato.valor.trim()) {
    linhas.push([
      "PAGAMENTO",
      contrato.vencimento.trim()
        ? `${contrato.valor} até dia ${contrato.vencimento} de cada mês`
        : contrato.valor,
    ]);
  }

  return linhas;
}
