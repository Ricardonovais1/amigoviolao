/**
 * Fonte única de verdade de preço e composição de oferta para o build.
 *
 * As decisões (por que a âncora é 997, por que bônus nunca é curso inteiro)
 * estão documentadas na skill `precificacao`, em `.claude/skills/precificacao/`.
 * Aquele markdown não entra no build — este arquivo é o que as páginas leem.
 * Mudou preço aqui, mudou nas quatro páginas.
 *
 * Regras que este arquivo existe para tornar impossíveis de quebrar:
 *  - as três páginas de estudante vendem o MESMO produto, pelo MESMO preço,
 *    com o MESMO valor de bônus;
 *  - o desconto exibido nos dois SKUs fica na mesma faixa;
 *  - o upgrade é sempre a diferença dos preços à vista.
 */

export type SkuId = "estudantes" | "professores";

/** Cada página de venda é uma porta; três delas levam ao mesmo SKU. */
export type PaginaVenda = "criancas" | "iniciantes" | "classico" | "professores";

export const SKU_DA_PAGINA: Record<PaginaVenda, SkuId> = {
  criancas: "estudantes",
  iniciantes: "estudantes",
  classico: "estudantes",
  professores: "professores",
};

/** Juros que o Hotmart pratica no 12x. Quem calcula de verdade é a plataforma. */
const FATOR_PARCELAMENTO = 1.2411;
const PARCELAS = 12;

/** Valor da parcela derivado do preço à vista — nunca digitado à mão. */
export function parcelaDe(precoAVista: number): number {
  return (
    Math.round(((precoAVista * FATOR_PARCELAMENTO) / PARCELAS) * 100) / 100
  );
}

type Preco = {
  /** Preço de tabela, exibido riscado. */
  ancora: number;
  aVista: number;
};

const PRECO_PADRAO: Record<SkuId, Preco> = {
  // 987 e não 997: a diferença para o preço à vista precisa fechar em R$ 330
  // redondos, que é o número que a página anuncia como economia.
  estudantes: { ancora: 987, aVista: 657 },
  professores: { ancora: 1497, aVista: 937 },
};

/**
 * Promoção ativa. `null` = preço cheio nas quatro páginas.
 *
 * Ao descontar, desconte os DOIS SKUs na mesma proporção: mexer só num deles
 * estreita a diferença de R$ 280 e mata o upgrade. Piso de 30% off sobre o
 * preço à vista — Estudantes R$ 460, Professores R$ 656.
 */
const PROMOCAO: Record<SkuId, Preco> | null = null;

export function precoDoSku(sku: SkuId): {
  ancora: number;
  aVista: number;
  parcelas: number;
  parcela: number;
  descontoPercentual: number;
  emPromocao: boolean;
} {
  const emPromocao = PROMOCAO !== null;
  const { ancora, aVista } = (PROMOCAO ?? PRECO_PADRAO)[sku];
  return {
    ancora,
    aVista,
    parcelas: PARCELAS,
    parcela: parcelaDe(aVista),
    descontoPercentual: Math.round((1 - aVista / ancora) * 1000) / 10,
    emPromocao,
  };
}

export function precoDaPagina(pagina: PaginaVenda) {
  return precoDoSku(SKU_DA_PAGINA[pagina]);
}

/** Diferença dos preços à vista. Nunca cobrar o preço cheio do SKU de destino. */
export function valorDoUpgrade(): number {
  return precoDoSku("professores").aVista - precoDoSku("estudantes").aVista;
}

/**
 * Checkout por página, não por SKU: as três portas de Estudantes apontam para
 * ofertas diferentes do mesmo produto Hotmart, cada uma nomeada pelo curso
 * carro-chefe, para o comprador reconhecer o que comprou no e-mail e no
 * recibo. Todas entregam a mesma turma.
 */
const CHECKOUT: Record<PaginaVenda, string> = {
  criancas: "https://pay.hotmart.com/D16391337C?off=qjvbqgvs",
  iniciantes: "https://pay.hotmart.com/D16391337C?off=ku418bn6",
  classico: "https://pay.hotmart.com/D16391337C?off=nn1uvh6n",
  professores:
    "https://pay.hotmart.com/D16391337C?off=u486ufop&bid=1786198009168",
};

export function checkoutDaPagina(pagina: PaginaVenda): string {
  return CHECKOUT[pagina];
}

/* ------------------------------------------------------------- composição */

export type Trilha = {
  id: "infantil" | "iniciantes" | "classico";
  nome: string;
  resumo: string;
  cursos: string[];
};

export const TRILHAS: Trilha[] = [
  {
    id: "infantil",
    nome: "Trilha Infantil",
    resumo:
      "A metodologia Amigo Violão® é uma das mais eficazes para as crianças, aprovada por centenas de professores no Brasil.",
    cursos: [
      "Violão para Crianças",
      "Músicas Gospel para crianças",
      "Melodias de guitarra para crianças",
      "Jogos interativos",
    ],
  },
  {
    id: "iniciantes",
    nome: "Trilha Iniciantes",
    resumo:
      "Do primeiro acorde ao primeiro repertório, com as levadas e as cifras que fazem você tocar música de verdade.",
    cursos: [
      "Violão para Iniciantes",
      "Cifras facilitadas",
      "Dicionário de Ritmos",
      "Tópicos de violão popular",
      "Universos Pentatônica",
    ],
  },
  {
    id: "classico",
    nome: "Trilha Clássico",
    resumo:
      "Leitura, teoria, técnica e repertório erudito — o caminho que a cifra não ensina.",
    cursos: [
      "Leitura musical",
      "Teoria musical",
      "Técnicas de violão",
      "Peças de violão solo",
      "Técnicas de violão flamenco",
    ],
  },
];

/**
 * Ordem de exibição das trilhas em cada página: o carro-chefe primeiro e, logo
 * depois, a trilha mais adjacente àquele público — quem chega pelo Clássico
 * costuma vir do popular, e quem chega pelos Iniciantes tem o Clássico como
 * próximo passo. A ordem é explícita porque essa vizinhança não sai de nenhuma
 * regra genérica.
 */
const ORDEM_DAS_TRILHAS: Record<
  "criancas" | "iniciantes" | "classico",
  Trilha["id"][]
> = {
  criancas: ["infantil", "iniciantes", "classico"],
  iniciantes: ["iniciantes", "classico", "infantil"],
  classico: ["classico", "iniciantes", "infantil"],
};

/** A trilha que dá nome e promessa a cada página de estudante. */
export const TRILHA_CARRO_CHEFE: Record<
  "criancas" | "iniciantes" | "classico",
  Trilha["id"]
> = {
  criancas: "infantil",
  iniciantes: "iniciantes",
  classico: "classico",
};

/** Trilhas na ordem em que a página deve exibi-las: carro-chefe primeiro. */
export function trilhasDaPagina(
  pagina: "criancas" | "iniciantes" | "classico",
): Trilha[] {
  return ORDEM_DAS_TRILHAS[pagina].map(
    (id) => TRILHAS.find((t) => t.id === id)!,
  );
}

/* ------------------------------------------------------------------ bônus */

export type Bonus = {
  titulo: string;
  valor: number;
  descricao: string;
};

/**
 * Bônus nunca é curso inteiro — curso inteiro sobe para a promessa principal.
 * Faixa de R$ 97 a R$ 197, sempre um recorte focado no público da página.
 */
const BONUS_COMUNS_ESTUDANTES: Bonus[] = [
  {
    titulo: "Como estudar violão sozinho sem travar",
    valor: 147,
    descricao:
      "O que fazer quando você empaca: como escolher o próximo passo sem depender de alguém dizendo o que estudar.",
  },
  {
    titulo: "Escolhendo e cuidando do seu violão",
    valor: 97,
    descricao:
      "Nylon ou aço, qual comprar, como afinar e trocar as cordas sem medo de estragar o instrumento.",
  },
];

/**
 * Os três bônus específicos valem o mesmo de propósito, e por isso o valor é
 * uma constante só: o total precisa fechar igual nas três páginas. Mesmo
 * produto e mesmo preço com valor percebido diferente é o que quebra a
 * confiança de quem abre duas abas. Mudar aqui muda nas três de uma vez.
 */
const VALOR_BONUS_ESPECIFICO = 147;

const BONUS_ESPECIFICO: Record<"criancas" | "iniciantes" | "classico", Bonus> = {
  criancas: {
    titulo: "Violão para Pais — toque junto com seu filho",
    valor: VALOR_BONUS_ESPECIFICO,
    descricao:
      "As primeiras músicas em poucos acordes, para você acompanhar o estudo do seu filho mesmo sem saber música.",
  },
  iniciantes: {
    titulo: "Repertório Clássico Facilitado",
    valor: VALOR_BONUS_ESPECIFICO,
    descricao:
      "As peças eruditas que já estão ao seu alcance agora, sem esperar anos de técnica.",
  },
  classico: {
    titulo: "Da cifra à partitura",
    valor: VALOR_BONUS_ESPECIFICO,
    descricao:
      "Para quem já toca cifra e quer entrar no erudito aproveitando o que sabe, sem recomeçar do zero.",
  },
};

const BONUS_PROFESSORES: Bonus[] = [
  {
    titulo: "Calendário do Professor",
    valor: 197,
    descricao:
      "Gera o calendário do semestre ou do ano com os dias de aula e os feriados do seu aluno, garantindo suas 2 semanas de férias remuneradas. Serve também de contrato.",
  },
  {
    titulo: "Guia de Precificação e Captação de Alunos",
    valor: 147,
    descricao:
      "Quanto cobrar, como conseguir o primeiro aluno, como conduzir a aula experimental e como reajustar sem perder turma.",
  },
  {
    titulo: "Kit de Credenciamento",
    valor: 97,
    descricao:
      "Arte do cartão de visita e selo de professor credenciado Amigo Violão.",
  },
];

export function bonusDaPagina(pagina: PaginaVenda): Bonus[] {
  if (pagina === "professores") return BONUS_PROFESSORES;
  return [...BONUS_COMUNS_ESTUDANTES, BONUS_ESPECIFICO[pagina]];
}

/** Soma exibida no "e mais estes bônus". Idêntica nas três páginas de estudante. */
export function totalDosBonus(pagina: PaginaVenda): number {
  return bonusDaPagina(pagina).reduce((soma, b) => soma + b.valor, 0);
}

/* ------------------------------------------------------------- formatação */

/** "R$1.497,00" — mesmo formato usado em todas as páginas de venda. */
export function formatarBRL(valor: number): string {
  return `R$${valor.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** "R$ 147" — sem centavos, para as etiquetas de bônus. */
export function formatarInteiroBRL(valor: number): string {
  return `R$ ${valor.toLocaleString("pt-BR")}`;
}
