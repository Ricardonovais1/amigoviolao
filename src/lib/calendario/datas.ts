/**
 * Helpers de data para o Calendário do Professor.
 *
 * Regra da casa: toda data aqui é "date-only" e é construída em horário local.
 * Nunca use `new Date("2025-01-01")` — esse parse é UTC e, em fuso negativo
 * como o do Brasil, volta 31/12. O calendário inteiro erraria um dia.
 */

export function novaData(ano: number, mes: number, dia: number): Date {
  return new Date(ano, mes - 1, dia);
}

/** Date -> "YYYY-MM-DD" (local, sem passar por UTC). */
export function iso(d: Date): string {
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mes}-${dia}`;
}

/** "YYYY-MM-DD" -> Date local. */
export function deIso(s: string): Date {
  const [ano, mes, dia] = s.split("-").map(Number);
  return novaData(ano, mes, dia);
}

export function somaDias(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

/** Primeiro dia do mês, n meses à frente. */
export function inicioDeMes(d: Date, deslocamentoMeses = 0): Date {
  return new Date(d.getFullYear(), d.getMonth() + deslocamentoMeses, 1);
}

export function ultimoDiaDoMes(ano: number, mes: number): number {
  return new Date(ano, mes, 0).getDate();
}

/** "21/01/2025" */
export function porExtensoCurto(d: Date): string {
  return `${String(d.getDate()).padStart(2, "0")}/${String(
    d.getMonth() + 1,
  ).padStart(2, "0")}/${d.getFullYear()}`;
}

/** "21 de janeiro de 2025" */
export function porExtenso(d: Date): string {
  return `${d.getDate()} de ${MESES_MINUSCULOS[d.getMonth()]} de ${d.getFullYear()}`;
}

/**
 * Coluna do dia na grade, com a semana começando na segunda-feira.
 * getDay() é 0=domingo; aqui segunda=0 e domingo=6.
 */
export function colunaDaSemana(d: Date): number {
  return (d.getDay() + 6) % 7;
}

/** Semestre civil (1 = jan–jun, 2 = jul–dez). Base da regra de feriados. */
export function semestre(d: Date): number {
  return d.getMonth() < 6 ? 1 : 2;
}

/** Índices seguem getDay(): 0 = domingo. */
export const DIAS_SEMANA_CURTO = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

export const DIAS_SEMANA_NOME = [
  "domingo",
  "segunda-feira",
  "terça-feira",
  "quarta-feira",
  "quinta-feira",
  "sexta-feira",
  "sábado",
];

/** Plural usado nas observações: "4 quintas-feiras caem em feriados". */
export const DIAS_SEMANA_PLURAL = [
  "domingos",
  "segundas-feiras",
  "terças-feiras",
  "quartas-feiras",
  "quintas-feiras",
  "sextas-feiras",
  "sábados",
];

/** Ordem das colunas da grade: segunda a domingo. */
export const COLUNAS_SEMANA = [1, 2, 3, 4, 5, 6, 0];

export const MESES = [
  "JANEIRO",
  "FEVEREIRO",
  "MARÇO",
  "ABRIL",
  "MAIO",
  "JUNHO",
  "JULHO",
  "AGOSTO",
  "SETEMBRO",
  "OUTUBRO",
  "NOVEMBRO",
  "DEZEMBRO",
];

export const MESES_MINUSCULOS = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];
