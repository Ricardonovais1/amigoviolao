import { deIso, inicioDeMes, iso, semestre, ultimoDiaDoMes } from "./datas";
import type { Feriado } from "./feriados";

export type Plano = "mensal" | "trimestral" | "semestral" | "anual";

/**
 * O plano é um número de aulas, não uma duração — e todos eles são 4 aulas por
 * mês. O que muda é o horizonte do compromisso (e o preço), nunca o ritmo.
 */
export const AULAS_POR_PLANO: Record<Plano, number> = {
  mensal: 4,
  trimestral: 12,
  semestral: 24,
  anual: 48,
};

export const AULAS_POR_MES = 4;

export const ROTULO_PLANO: Record<Plano, string> = {
  mensal: "Mensal",
  trimestral: "Trimestral",
  semestral: "Semestral",
  anual: "Anual",
};

export type PeriodoFerias = {
  /** "YYYY-MM-DD" */
  inicio: string;
  /** "YYYY-MM-DD", inclusivo */
  fim: string;
};

export type Contrato = {
  aluno: string;
  professor: string;
  plano: Plano;
  /** Data da primeira aula, "YYYY-MM-DD". */
  inicio: string;
  /** Tamanho da janela em meses inteiros (padrão 12, mínimo 6). */
  meses: number;
  /** getDay(): 0 = domingo … 6 = sábado. */
  diaSemana: number;
  horario: string;
  /** Duração da aula em minutos. */
  duracao: number;
  valor: string;
  vencimento: string;
  feriados: Feriado[];
  ferias: PeriodoFerias[];
  /**
   * Datas de reposição escolhidas pelo professor, para quando o dia da semana
   * não comporta todas as aulas do plano.
   */
  reposicoes: string[];
  /** Libera o documento sem datas de reposição definidas. */
  combinarDepois: boolean;
  observacoes: string;
};

export const DURACOES = [30, 45, 60] as const;

export type TipoDia = "aula" | "feriado" | "ferias" | "reposicao";

export type Balanco = {
  /** Ocorrências do dia da semana dentro da janela, a partir da 1ª aula. */
  ocorrencias: number;
  /** Feriados que caem no dia da aula (fora dos períodos de férias). */
  feriadosNoDia: Feriado[];
  /** Abonados pela regra: o 1º de cada semestre não é reposto. */
  abonados: number;
  /** Do 2º feriado do semestre em diante — o professor deve repor. */
  aRepor: number;
  /** Aulas prometidas pelo plano no período: 4 × meses. */
  aulasEsperadas: number;
  /** Quantas semanas de descanso a aritmética do contrato comporta. */
  folgaDisponivel: number;
  /** Semanas de descanso efetivamente marcadas no calendário. */
  semanasMarcadas: number;
  /** Datas de reposição marcadas dentro da janela. */
  reposicoesMarcadas: number;
  /** Aulas que o calendário entrega (abonadas contam; repostas não). */
  entregues: number;
  /** entregues − aulasEsperadas. Zero é o alvo. */
  saldo: number;
  /** Aulas que ainda faltam marcar para fechar o plano. Zero é o alvo. */
  pendencia: number;
};

export type Resultado = {
  /** Blocos de mês exibidos, na ordem. */
  meses: Array<{ ano: number; mes: number }>;
  /** Estado de cada dia marcado, indexado por "YYYY-MM-DD". */
  estados: Map<string, TipoDia>;
  /** Feriado por data, para o tooltip e a legenda. */
  nomesFeriado: Map<string, string>;
  primeiraAula: Date;
  ultimaAula: Date | null;
  fimDaJanela: Date;
  balanco: Balanco;
};

function dentroDeAlgumPeriodo(dia: string, periodos: PeriodoFerias[]): boolean {
  return periodos.some((p) => p.inicio <= dia && dia <= p.fim);
}

/**
 * Regra dos contratos: um feriado por semestre que caia no dia da aula é
 * abonado; do segundo em diante, dentro do mesmo semestre, a aula é reposta.
 */
function repartirFeriados(datas: Date[]): { abonados: number; aRepor: number } {
  const porSemestre = new Map<string, number>();
  for (const d of datas) {
    const chave = `${d.getFullYear()}-${semestre(d)}`;
    porSemestre.set(chave, (porSemestre.get(chave) ?? 0) + 1);
  }
  let abonados = 0;
  let aRepor = 0;
  for (const n of porSemestre.values()) {
    abonados += Math.min(n, 1);
    aRepor += Math.max(n - 1, 0);
  }
  return { abonados, aRepor };
}

export function calcular(contrato: Contrato): Resultado {
  const primeiraAula = deIso(contrato.inicio);

  // A janela são meses civis inteiros a partir do mês da primeira aula: o
  // calendário sempre fecha com exatamente `meses` blocos, o que mantém a
  // grade previsível.
  const meses: Array<{ ano: number; mes: number }> = [];
  for (let i = 0; i < contrato.meses; i++) {
    const d = inicioDeMes(primeiraAula, i);
    meses.push({ ano: d.getFullYear(), mes: d.getMonth() + 1 });
  }
  const ultimo = meses[meses.length - 1];
  const fimDaJanela = new Date(
    ultimo.ano,
    ultimo.mes - 1,
    ultimoDiaDoMes(ultimo.ano, ultimo.mes),
  );

  const feriadosPorData = new Map(contrato.feriados.map((f) => [f.data, f]));
  const nomesFeriado = new Map(contrato.feriados.map((f) => [f.data, f.nome]));

  const estados = new Map<string, TipoDia>();
  const ocorrencias: Date[] = [];
  const feriadosNoDia: Feriado[] = [];
  let semanasMarcadas = 0;

  // Percorre só as ocorrências do dia da aula, da primeira aula ao fim da
  // janela.
  const cursor = new Date(primeiraAula);
  while (cursor.getDay() !== contrato.diaSemana) {
    cursor.setDate(cursor.getDate() + 1);
  }
  while (cursor <= fimDaJanela) {
    const dia = iso(cursor);
    ocorrencias.push(new Date(cursor));

    // Precedência: férias > feriado. Um feriado dentro do descanso já não
    // teria aula de qualquer forma — contá-lo duas vezes distorceria o saldo.
    if (dentroDeAlgumPeriodo(dia, contrato.ferias)) {
      estados.set(dia, "ferias");
      semanasMarcadas++;
    } else if (feriadosPorData.has(dia)) {
      estados.set(dia, "feriado");
      feriadosNoDia.push(feriadosPorData.get(dia)!);
    } else {
      estados.set(dia, "aula");
    }
    cursor.setDate(cursor.getDate() + 7);
  }

  // Períodos de férias pintam o intervalo inteiro, não só o dia da aula.
  for (const periodo of contrato.ferias) {
    const ini = deIso(periodo.inicio);
    const fim = deIso(periodo.fim);
    for (const d = new Date(ini); d <= fim; d.setDate(d.getDate() + 1)) {
      if (d < primeiraAula || d > fimDaJanela) continue;
      const dia = iso(d);
      if (estados.get(dia) !== "ferias") estados.set(dia, "ferias");
    }
  }

  // Feriados que não caem no dia da aula continuam visíveis na grade — é o que
  // deixa o aluno enxergar o ano dele.
  for (const f of contrato.feriados) {
    const d = deIso(f.data);
    if (d < primeiraAula || d > fimDaJanela) continue;
    if (!estados.has(f.data)) estados.set(f.data, "feriado");
  }

  // Reposições caem fora do dia habitual, então entram como marcação extra.
  // Uma data que já é aula regular ou semana de descanso não vira reposição:
  // ela já foi contada no balanço, e marcá-la de novo somaria a mesma aula
  // duas vezes.
  let reposicoesMarcadas = 0;
  for (const dia of contrato.reposicoes) {
    if (!dia) continue;
    const d = deIso(dia);
    if (d < primeiraAula || d > fimDaJanela) continue;
    const atual = estados.get(dia);
    if (atual === "aula" || atual === "ferias") continue;
    estados.set(dia, "reposicao");
    reposicoesMarcadas++;
  }

  const { abonados, aRepor } = repartirFeriados(
    feriadosNoDia.map((f) => deIso(f.data)),
  );

  const aulasEsperadas = AULAS_POR_MES * contrato.meses;
  const folgaDisponivel = ocorrencias.length - aRepor - aulasEsperadas;
  const entregues =
    ocorrencias.length - semanasMarcadas - aRepor + reposicoesMarcadas;

  const aulas = ocorrencias.filter((d) => estados.get(iso(d)) === "aula");

  return {
    meses,
    estados,
    nomesFeriado,
    primeiraAula,
    ultimaAula: aulas.length ? aulas[aulas.length - 1] : null,
    fimDaJanela,
    balanco: {
      ocorrencias: ocorrencias.length,
      feriadosNoDia,
      abonados,
      aRepor,
      aulasEsperadas,
      folgaDisponivel,
      semanasMarcadas,
      reposicoesMarcadas,
      entregues,
      saldo: entregues - aulasEsperadas,
      pendencia: Math.max(0, aulasEsperadas - entregues),
    },
  };
}

/**
 * Períodos de descanso sugeridos: 2ª quinzena de julho e 1ª de janeiro, que é
 * o padrão praticado. O professor move à vontade — o calendário fixa a
 * quantidade, não as datas.
 */
export function feriasPadrao(
  primeiraAula: Date,
  meses: number,
): PeriodoFerias[] {
  const periodos: PeriodoFerias[] = [];
  const fim = inicioDeMes(primeiraAula, meses);

  for (
    let ano = primeiraAula.getFullYear();
    ano <= fim.getFullYear();
    ano++
  ) {
    periodos.push({ inicio: `${ano}-07-16`, fim: `${ano}-07-31` });
    periodos.push({ inicio: `${ano}-01-01`, fim: `${ano}-01-15` });
  }

  const diaInicial = iso(primeiraAula);

  return periodos
    .filter((p) => deIso(p.fim) >= primeiraAula && deIso(p.inicio) < fim)
    // Um contrato que começa dentro de um período de descanso sugerido seria
    // uma contradição na cara do aluno: a primeira aula pintada de férias.
    .filter((p) => !(p.inicio <= diaInicial && diaInicial <= p.fim))
    .sort((a, b) => a.inicio.localeCompare(b.inicio));
}
