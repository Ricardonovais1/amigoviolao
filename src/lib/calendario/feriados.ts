import { iso, novaData, somaDias } from "./datas";

export type Feriado = {
  /** "YYYY-MM-DD" */
  data: string;
  nome: string;
  /**
   * `true` para datas que não são feriado nacional na lei (Carnaval, Corpus
   * Christi) mas que na prática cancelam a aula. Vêm marcadas por padrão e o
   * professor pode desmarcar.
   */
  facultativo?: boolean;
  /** Feriado estadual ou municipal, digitado pelo professor. */
  local?: boolean;
};

/**
 * Domingo de Páscoa pelo algoritmo de Meeus/Jones/Butcher.
 * É daqui que saem Carnaval, Sexta-feira Santa e Corpus Christi — os únicos
 * feriados nacionais que mudam de data todo ano.
 */
export function domingoDePascoa(ano: number): Date {
  const a = ano % 19;
  const b = Math.floor(ano / 100);
  const c = ano % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mes = Math.floor((h + l - 7 * m + 114) / 31);
  const dia = ((h + l - 7 * m + 114) % 31) + 1;
  return novaData(ano, mes, dia);
}

/**
 * Feriados nacionais do ano. Consciência Negra é nacional desde a Lei
 * 14.759/2023.
 */
export function feriadosNacionais(ano: number): Feriado[] {
  const pascoa = domingoDePascoa(ano);
  const lista: Array<[Date, string, boolean?]> = [
    [novaData(ano, 1, 1), "Confraternização Universal"],
    [somaDias(pascoa, -48), "Carnaval (segunda)", true],
    [somaDias(pascoa, -47), "Carnaval (terça)", true],
    [somaDias(pascoa, -2), "Sexta-feira Santa"],
    [novaData(ano, 4, 21), "Tiradentes"],
    [novaData(ano, 5, 1), "Dia do Trabalho"],
    [somaDias(pascoa, 60), "Corpus Christi", true],
    [novaData(ano, 9, 7), "Independência"],
    [novaData(ano, 10, 12), "Nossa Senhora Aparecida"],
    [novaData(ano, 11, 2), "Finados"],
    [novaData(ano, 11, 15), "Proclamação da República"],
    [novaData(ano, 11, 20), "Consciência Negra"],
    [novaData(ano, 12, 25), "Natal"],
  ];

  return lista
    .map(([data, nome, facultativo]) => ({ data: iso(data), nome, facultativo }))
    .sort((a, b) => a.data.localeCompare(b.data));
}

/** Feriados nacionais de todos os anos tocados pela janela do calendário. */
export function feriadosNacionaisNoIntervalo(
  primeiroAno: number,
  ultimoAno: number,
): Feriado[] {
  const anos: Feriado[][] = [];
  for (let ano = primeiroAno; ano <= ultimoAno; ano++) {
    anos.push(feriadosNacionais(ano));
  }
  return anos.flat();
}
