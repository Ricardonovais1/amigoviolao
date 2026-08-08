import {
  AULAS_POR_PLANO,
  ROTULO_PLANO,
  type Contrato,
  type Resultado,
  type TipoDia,
} from "@/lib/calendario/calculo";
import {
  COLUNAS_SEMANA,
  DIAS_SEMANA_CURTO,
  MESES,
  iso,
  novaData,
  porExtensoCurto,
  ultimoDiaDoMes,
} from "@/lib/calendario/datas";
import {
  blocoFerias,
  blocoObservacoes,
  blocoReposicoes,
  dadosDoContrato,
  type Bloco,
} from "@/lib/calendario/textos";

/* Folha A4 em milímetros: o viewBox é 1:1 com o papel, então toda medida deste
   arquivo é literalmente milímetro no PDF. */
export const A4_LARGURA = 210;
export const A4_ALTURA = 297;

const MARGEM = 11;

export const CORES = {
  aula: "#00A63E",
  reposicao: "#48C2C3",
  feriado: "#F89C2D",
  ferias: "#EF5400",
  texto: "#212121",
  suave: "#6B7280",
  linha: "#D9DEE7",
  domingo: "#EF5400",
} as const;

const CONTRASTE: Record<TipoDia, string> = {
  aula: "#FFFFFF",
  reposicao: "#12494A",
  feriado: "#3E2A0B",
  ferias: "#FFFFFF",
};

/**
 * "Poppins" primeiro porque é o nome com que a fonte é registrada no jsPDF —
 * é ele que o svg2pdf procura. No navegador esse nome não resolve e a cascata
 * cai na variável do next/font, que aponta para a mesma Poppins. Assim a
 * pré-visualização e o PDF usam a mesma tipografia.
 */
const FONTE = "Poppins, var(--font-poppins), sans-serif";
const ESTILO = { fontFamily: FONTE } as const;

/**
 * SVG não quebra linha sozinho. A largura média por caractere da Poppins fica
 * perto de 0,54 em, o que basta para uma quebra visualmente correta — qualquer
 * erro sobra como espaço à direita, nunca como texto cortado.
 */
function quebrarTexto(
  texto: string,
  larguraMm: number,
  tamanhoMm: number,
): string[] {
  const porLinha = Math.max(8, Math.floor(larguraMm / (tamanhoMm * 0.54)));
  const linhas: string[] = [];
  let atual = "";
  for (const palavra of texto.split(/\s+/)) {
    const candidata = atual ? `${atual} ${palavra}` : palavra;
    if (candidata.length > porLinha && atual) {
      linhas.push(atual);
      atual = palavra;
    } else {
      atual = candidata;
    }
  }
  if (atual) linhas.push(atual);
  return linhas;
}

/**
 * Empilha os blocos da barra lateral. Fica fora do componente porque a altura
 * de cada bloco depende de quantas linhas o valor ocupou — é acumulação, e
 * acumular durante o render do JSX é justamente o que não se deve fazer.
 */
function empilharLateral(
  linhasDados: Array<[string, string]>,
  largura: number,
  yInicial: number,
): Array<{ rotulo: string; linhas: string[]; y: number }> {
  const saida: Array<{ rotulo: string; linhas: string[]; y: number }> = [];
  let y = yInicial;
  for (const [rotulo, valor] of linhasDados) {
    const linhas = quebrarTexto(valor, largura, 3.4);
    saida.push({ rotulo, linhas, y });
    y += 4.8 + linhas.length * 4.2 + 3;
  }
  return saida;
}

export type Contato = {
  redeSocial: string;
  whatsapp: string;
  email: string;
  site: string;
};

type PaginaProps = {
  contrato: Contrato;
  resultado: Resultado;
  logoDataUrl: string | null;
  contato: Contato;
};

/* ---------------------------------------------------------------- página 1 */

function BlocoMes({
  ano,
  mes,
  x,
  y,
  largura,
  alturaCelula,
  estados,
  mostrarAno,
}: {
  ano: number;
  mes: number;
  x: number;
  y: number;
  largura: number;
  alturaCelula: number;
  estados: Map<string, TipoDia>;
  mostrarAno: boolean;
}) {
  const celula = largura / 7;
  const alturaTitulo = alturaCelula * 1.25;
  const alturaCabecalho = alturaCelula * 0.85;
  const primeiro = novaData(ano, mes, 1);
  const colunaInicial = (primeiro.getDay() + 6) % 7;
  const totalDias = ultimoDiaDoMes(ano, mes);
  // A restrição de tipografia aqui é sempre a largura da célula, não a altura:
  // "SEG" precisa caber em 7 colunas, e sobra espaço vertical de resto.
  const tamanhoDia = Math.min(alturaCelula * 0.52, celula * 0.44);
  const tamanhoCabecalho = celula * 0.36;
  const tamanhoTitulo = Math.min(alturaCelula * 0.62, celula * 0.66);

  const dias = [];
  for (let dia = 1; dia <= totalDias; dia++) {
    const indice = colunaInicial + dia - 1;
    const coluna = indice % 7;
    const linha = Math.floor(indice / 7);
    const cx = x + coluna * celula;
    const cy = y + alturaTitulo + alturaCabecalho + linha * alturaCelula;
    const chave = iso(novaData(ano, mes, dia));
    const estado = estados.get(chave);
    const ehDomingo = coluna === 6;

    dias.push(
      <g key={dia}>
        {estado && (
          <rect
            x={cx + celula * 0.06}
            y={cy}
            width={celula * 0.88}
            height={alturaCelula}
            rx={celula * 0.18}
            fill={CORES[estado]}
          />
        )}
        {/* Centragem vertical na mão: `dominant-baseline` é irregular na
            conversão para PDF, então a linha de base vai calculada. */}
        <text
          x={cx + celula / 2}
          y={cy + alturaCelula / 2 + tamanhoDia * 0.35}
          style={ESTILO}
          fontSize={tamanhoDia}
          textAnchor="middle"
          fill={
            estado
              ? CONTRASTE[estado]
              : ehDomingo
                ? CORES.domingo
                : CORES.texto
          }
        >
          {dia}
        </text>
      </g>,
    );
  }

  return (
    <g>
      <text
        x={x + largura / 2}
        y={y + alturaTitulo * 0.62}
        style={ESTILO}
        fontSize={tamanhoTitulo}
        fontWeight="bold"
        letterSpacing={0.2}
        textAnchor="middle"
        fill={CORES.texto}
      >
        {MESES[mes - 1]}
        {mostrarAno ? ` ${ano}` : ""}
      </text>
      {COLUNAS_SEMANA.map((dia, coluna) => (
        <text
          key={dia}
          x={x + coluna * celula + celula / 2}
          y={y + alturaTitulo + alturaCabecalho * 0.6}
          style={ESTILO}
          fontSize={tamanhoCabecalho}
          fontWeight="bold"
          textAnchor="middle"
          fill={dia === 0 ? CORES.domingo : CORES.suave}
        >
          {DIAS_SEMANA_CURTO[dia]}
        </text>
      ))}
      {dias}
    </g>
  );
}

const LARGURA_LOGO = 32;
const ALTURA_LOGO = LARGURA_LOGO / 2.083; // proporção do arquivo original

function Marca({
  x,
  y,
  logoDataUrl,
}: {
  x: number;
  y: number;
  logoDataUrl: string | null;
}) {
  return (
    <g>
      {logoDataUrl && (
        <image
          href={logoDataUrl}
          x={x}
          y={y}
          width={LARGURA_LOGO}
          height={ALTURA_LOGO}
        />
      )}
      {/* O documento é gerado por quem já ensina, não por quem é credenciado
          pelo Amigo Violão — a linha deixa claro que a marca é da plataforma
          que gerou o papel, não um selo sobre o professor. */}
      <text
        x={x}
        y={y + ALTURA_LOGO + 4}
        style={ESTILO}
        fontSize={2.6}
        fill={CORES.suave}
      >
        Gerado na plataforma Amigo Violão
      </text>
    </g>
  );
}

function Legenda({
  x,
  y,
  mostrarReposicao,
}: {
  x: number;
  y: number;
  mostrarReposicao: boolean;
}) {
  const itens: Array<[TipoDia, string, string]> = [
    ["aula", "AULA", "dia de aula do contrato"],
    ...(mostrarReposicao
      ? ([["reposicao", "REPOSIÇÃO", "aula remarcada"]] as Array<
          [TipoDia, string, string]
        >)
      : []),
    ["feriado", "FERIADO", "não tem aula neste dia"],
    ["ferias", "FÉRIAS", "descanso remunerado"],
  ];
  const alturaItem = 10.5;

  return (
    <g>
      {itens.map(([estado, rotulo, descricao], i) => {
        const iy = y + i * alturaItem;
        return (
          <g key={estado}>
            <rect
              x={x}
              y={iy}
              width={5.6}
              height={5.6}
              rx={1.3}
              fill={CORES[estado]}
            />
            <text
              x={x + 8.4}
              y={iy + 2.5}
              style={ESTILO}
              fontSize={3.4}
              fontWeight="bold"
              fill={CORES.texto}
            >
              {rotulo}
            </text>
            <text
              x={x + 8.4}
              y={iy + 6.3}
              style={ESTILO}
              fontSize={2.8}
              fill={CORES.suave}
            >
              {descricao}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export function PaginaCalendario({
  contrato,
  resultado,
  logoDataUrl,
  contato,
}: PaginaProps) {
  const larguraLateral = 54;
  const xGrade = MARGEM + larguraLateral + 8;
  const larguraGrade = A4_LARGURA - MARGEM - xGrade;

  const colunas = contrato.meses <= 6 ? 2 : 3;
  const linhas = Math.ceil(resultado.meses.length / colunas);
  const espacoX = 4;
  const larguraBloco = (larguraGrade - (colunas - 1) * espacoX) / colunas;

  const yGrade = MARGEM + 16;
  const alturaDisponivel = A4_ALTURA - MARGEM - yGrade;
  // 6 linhas de dias + título (1,25) + cabeçalho (0,85) = 8,1 alturas de célula.
  const alturaMaxima = alturaDisponivel / linhas / 8.1;
  // Trava a célula pela largura: sem isso, uma janela de poucos meses estica a
  // altura e a tipografia sai desproporcional. O fator 1,3 deixa a célula um
  // pouco mais alta que larga — abaixo disso sobra um vão enorme entre as
  // fileiras de meses.
  const alturaCelula = Math.min(alturaMaxima, (larguraBloco / 7) * 1.3);
  const alturaBloco = alturaCelula * 8.1;
  // A sobra vertical vira respiro entre as fileiras, não altura de célula.
  const espacoY =
    linhas > 1 ? (alturaDisponivel - linhas * alturaBloco) / (linhas - 1) : 0;

  const anos = new Set(resultado.meses.map((m) => m.ano));
  const mostrarAno = anos.size > 1;
  const mostrarReposicao = resultado.balanco.reposicoesMarcadas > 0;

  const linhasDados = dadosDoContrato(contrato, resultado);
  const periodo = `${porExtensoCurto(resultado.primeiraAula)} a ${porExtensoCurto(
    resultado.fimDaJanela,
  )}`;

  const yLegenda = MARGEM + ALTURA_LOGO + 9;
  const alturaLegenda = (mostrarReposicao ? 4 : 3) * 10.5;
  const yDivisor = yLegenda + alturaLegenda + 1;

  const blocosLaterais = empilharLateral(
    linhasDados,
    larguraLateral,
    yDivisor + 7,
  );

  const linhasContato = [
    contato.redeSocial,
    contato.whatsapp,
    contato.email,
    contato.site,
  ]
    .map((c) => c.trim())
    .filter(Boolean);
  const yContato = A4_ALTURA - MARGEM - linhasContato.length * 4.6;

  return (
    <svg
      viewBox={`0 0 ${A4_LARGURA} ${A4_ALTURA}`}
      width={`${A4_LARGURA}mm`}
      height={`${A4_ALTURA}mm`}
      style={ESTILO}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width={A4_LARGURA} height={A4_ALTURA} fill="#FFFFFF" />

      <Marca x={MARGEM} y={MARGEM} logoDataUrl={logoDataUrl} />
      <Legenda
        x={MARGEM}
        y={yLegenda}
        mostrarReposicao={mostrarReposicao}
      />

      <line
        x1={MARGEM}
        y1={yDivisor}
        x2={MARGEM + larguraLateral}
        y2={yDivisor}
        stroke={CORES.linha}
        strokeWidth={0.4}
      />

      {blocosLaterais.map(({ rotulo, linhas: linhasValor, y }) => (
        <g key={rotulo}>
          <text
            x={MARGEM}
            y={y}
            style={ESTILO}
            fontSize={2.7}
            fontWeight="bold"
            fill={CORES.suave}
            letterSpacing={0.22}
          >
            {rotulo}
          </text>
          {linhasValor.map((linha, i) => (
            <text
              key={i}
              x={MARGEM}
              y={y + 4.8 + i * 4.2}
              style={ESTILO}
              fontSize={3.4}
              fill={CORES.texto}
            >
              {linha}
            </text>
          ))}
        </g>
      ))}

      {linhasContato.length > 0 && (
        <g>
          <line
            x1={MARGEM}
            y1={yContato - 6}
            x2={MARGEM + larguraLateral}
            y2={yContato - 6}
            stroke={CORES.linha}
            strokeWidth={0.4}
          />
          {linhasContato.map((linha, i) => (
            <text
              key={linha}
              x={MARGEM}
              y={yContato + i * 4.6}
              style={ESTILO}
              fontSize={3.1}
              fill={CORES.suave}
            >
              {linha}
            </text>
          ))}
        </g>
      )}

      <text
        x={xGrade}
        y={MARGEM + 6}
        style={ESTILO}
        fontSize={6.4}
        fontWeight="bold"
        letterSpacing={1}
        fill={CORES.texto}
      >
        CALENDÁRIO
      </text>
      <text
        x={xGrade}
        y={MARGEM + 12}
        style={ESTILO}
        fontSize={3.6}
        fill={CORES.suave}
      >
        {periodo}
      </text>

      {resultado.meses.map((m, i) => (
        <BlocoMes
          key={`${m.ano}-${m.mes}`}
          ano={m.ano}
          mes={m.mes}
          x={xGrade + (i % colunas) * (larguraBloco + espacoX)}
          y={yGrade + Math.floor(i / colunas) * (alturaBloco + espacoY)}
          largura={larguraBloco}
          alturaCelula={alturaCelula}
          estados={resultado.estados}
          mostrarAno={mostrarAno}
        />
      ))}
    </svg>
  );
}

/* ---------------------------------------------------------------- página 2 */

function renderBloco(
  bloco: Bloco,
  x: number,
  y: number,
  largura: number,
): { nodes: React.ReactNode[]; altura: number } {
  const nodes: React.ReactNode[] = [];
  let cursor = y;

  nodes.push(
    <text
      key={`${bloco.titulo}-t`}
      x={x}
      y={cursor}
      style={ESTILO}
      fontSize={5}
      fontWeight="bold"
      fill={CORES.texto}
    >
      {bloco.titulo}
    </text>,
  );
  cursor += 3;
  nodes.push(
    <line
      key={`${bloco.titulo}-l`}
      x1={x}
      y1={cursor}
      x2={x + largura}
      y2={cursor}
      stroke={CORES.linha}
      strokeWidth={0.4}
    />,
  );
  cursor += 7;

  bloco.itens.forEach((item, i) => {
    const recuo = item.tipo === "bullet" ? 5 : 0;
    const tamanho = item.tipo === "nota" ? 3.3 : 3.6;
    const linhas = quebrarTexto(item.texto, largura - recuo, tamanho);

    if (item.tipo === "nota") {
      nodes.push(
        <rect
          key={`${bloco.titulo}-n${i}`}
          x={x - 2}
          y={cursor - 4.4}
          width={largura + 4}
          height={linhas.length * 4.6 + 4}
          rx={1.6}
          fill="#F4F6FA"
        />,
      );
    }
    if (item.tipo === "bullet") {
      nodes.push(
        <circle
          key={`${bloco.titulo}-b${i}`}
          cx={x + 1.6}
          cy={cursor - 1.2}
          r={0.8}
          fill={CORES.ferias}
        />,
      );
    }

    linhas.forEach((linha, j) => {
      nodes.push(
        <text
          key={`${bloco.titulo}-${i}-${j}`}
          x={x + recuo}
          y={cursor + j * 4.6}
          style={ESTILO}
          fontSize={tamanho}
          fill={item.tipo === "nota" ? CORES.suave : CORES.texto}
        >
          {linha}
        </text>,
      );
    });

    cursor += linhas.length * 4.6 + (item.tipo === "paragrafo" ? 3.4 : 2.6);
  });

  return { nodes, altura: cursor - y };
}

export function PaginaInformacoes({
  contrato,
  resultado,
  logoDataUrl,
}: PaginaProps) {
  const largura = A4_LARGURA - MARGEM * 2;
  const blocos = [
    blocoReposicoes(contrato),
    blocoFerias(resultado),
    blocoObservacoes(contrato, resultado),
  ];

  const conteudo: React.ReactNode[] = [];
  let cursor = MARGEM + 44;
  for (const bloco of blocos) {
    const { nodes, altura } = renderBloco(bloco, MARGEM, cursor, largura);
    conteudo.push(...nodes);
    cursor += altura + 9;
  }

  const contratadas = AULAS_POR_PLANO[contrato.plano];

  return (
    <svg
      viewBox={`0 0 ${A4_LARGURA} ${A4_ALTURA}`}
      width={`${A4_LARGURA}mm`}
      height={`${A4_ALTURA}mm`}
      style={ESTILO}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width={A4_LARGURA} height={A4_ALTURA} fill="#FFFFFF" />

      <Marca x={MARGEM} y={MARGEM} logoDataUrl={logoDataUrl} />

      <text
        x={A4_LARGURA - MARGEM}
        y={MARGEM + 8}
        style={ESTILO}
        fontSize={6.4}
        fontWeight="bold"
        letterSpacing={0.9}
        textAnchor="end"
        fill={CORES.texto}
      >
        INFORMAÇÕES IMPORTANTES
      </text>
      <text
        x={A4_LARGURA - MARGEM}
        y={MARGEM + 14}
        style={ESTILO}
        fontSize={3.4}
        textAnchor="end"
        fill={CORES.suave}
      >
        {`Plano ${ROTULO_PLANO[contrato.plano].toLowerCase()} · ${contratadas} aulas contratadas`}
      </text>

      <line
        x1={MARGEM}
        y1={MARGEM + 26}
        x2={A4_LARGURA - MARGEM}
        y2={MARGEM + 26}
        stroke={CORES.linha}
        strokeWidth={0.4}
      />
      <text
        x={MARGEM}
        y={MARGEM + 33}
        style={ESTILO}
        fontSize={3.8}
        fill={CORES.texto}
      >
        {`Aluno(a): ${contrato.aluno.trim() || "—"}`}
      </text>
      <text
        x={A4_LARGURA - MARGEM}
        y={MARGEM + 33}
        style={ESTILO}
        fontSize={3.8}
        textAnchor="end"
        fill={CORES.texto}
      >
        {`Professor(a): ${contrato.professor.trim() || "—"}`}
      </text>

      {conteudo}

      <text
        x={MARGEM}
        y={A4_ALTURA - MARGEM}
        style={ESTILO}
        fontSize={2.9}
        fill={CORES.suave}
      >
        {`Gerado em ${porExtensoCurto(new Date())} na plataforma Amigo Violão`}
      </text>
    </svg>
  );
}
