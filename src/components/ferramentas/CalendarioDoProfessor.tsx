"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AULAS_POR_PLANO,
  DURACOES,
  ROTULO_PLANO,
  calcular,
  feriasPadrao,
  type Contrato,
  type PeriodoFerias,
  type Plano,
} from "@/lib/calendario/calculo";
import { DIAS_SEMANA_PLURAL, deIso, iso, porExtensoCurto } from "@/lib/calendario/datas";
import {
  feriadosNacionaisNoIntervalo,
  type Feriado,
} from "@/lib/calendario/feriados";
import {
  A4_ALTURA,
  A4_LARGURA,
  PaginaCalendario,
  PaginaInformacoes,
} from "./CalendarioDocumento";

const PLANOS: Plano[] = ["mensal", "trimestral", "semestral", "anual"];

function Campo({
  label,
  dica,
  children,
}: {
  label: string;
  dica?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-wide text-white/45">
        {label}
      </span>
      {children}
      {dica && <span className="mt-1 block text-xs text-white/35">{dica}</span>}
    </label>
  );
}

// `color-scheme: dark` faz o seletor nativo de data abrir escuro também — sem
// isso o input fica escuro e o calendinho do navegador abre branco.
const inputCls =
  "mt-1 w-full rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm text-white outline-none [color-scheme:dark] placeholder:text-white/30 focus:border-teal";

const cardCls = "space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5";

export default function CalendarioDoProfessor() {
  const [aluno, setAluno] = useState("");
  const [professor, setProfessor] = useState("Ricardo Novais");
  const [plano, setPlano] = useState<Plano>("anual");
  // Só é seguro ler "hoje" na inicialização porque o componente é carregado com
  // `ssr: false` (ver CalendarioClient) — não há render de servidor para
  // divergir.
  const [inicio, setInicio] = useState(() => iso(new Date()));
  const [meses, setMeses] = useState(12);
  const [horario, setHorario] = useState("19:00");
  const [duracao, setDuracao] = useState<number>(45);
  const [valor, setValor] = useState("R$ 320,00");
  const [vencimento, setVencimento] = useState("10");
  const [redeSocial, setRedeSocial] = useState("@ricardonovais_amigoviolao");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [site, setSite] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [desmarcados, setDesmarcados] = useState<string[]>([]);
  const [locais, setLocais] = useState<Feriado[]>([]);
  const [novoLocalData, setNovoLocalData] = useState("");
  const [novoLocalNome, setNovoLocalNome] = useState("");
  const [ferias, setFerias] = useState<PeriodoFerias[]>(() =>
    feriasPadrao(deIso(iso(new Date())), 12),
  );
  const [reposicoes, setReposicoes] = useState<string[]>([]);
  const [combinarDepois, setCombinarDepois] = useState(false);
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [gerando, setGerando] = useState(false);
  const [erroPdf, setErroPdf] = useState<string | null>(null);

  const refPagina1 = useRef<HTMLDivElement>(null);
  const refPagina2 = useRef<HTMLDivElement>(null);

  // O logo vai embutido como data URI para o PDF não depender da rede — mas
  // reduzido antes: o jsPDF grava PNG como bitmap cru, a 4 bytes por pixel.
  // 320 px sobre os 32 mm em que ele é impresso ainda dá ~254 DPI, e o fundo
  // branco evita o canal alfa, que o PDF guardaria como uma segunda imagem.
  useEffect(() => {
    let cancelado = false;
    const LARGURA = 320;
    const img = new Image();
    img.onload = () => {
      const altura = Math.round((LARGURA * img.height) / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = LARGURA;
      canvas.height = altura;
      const ctx = canvas.getContext("2d");
      if (!ctx || cancelado) return;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, LARGURA, altura);
      ctx.drawImage(img, 0, 0, LARGURA, altura);
      setLogoDataUrl(canvas.toDataURL("image/png"));
    };
    img.src = "/images/logo-amigo-violao-completo.png";
    return () => {
      cancelado = true;
    };
  }, []);

  // Mudou a janela, os períodos sugeridos mudam junto. Isto é estado derivado
  // que o professor pode editar depois, então não dá para ser um `useMemo`;
  // o ajuste durante o render é o padrão do React para "resetar ao mudar a
  // origem" e evita o render em cascata de um efeito.
  const origemFerias = `${inicio}|${meses}`;
  const [origemAnterior, setOrigemAnterior] = useState(origemFerias);
  if (origemFerias !== origemAnterior) {
    setOrigemAnterior(origemFerias);
    setFerias(feriasPadrao(deIso(inicio), meses));
    setReposicoes([]);
    setCombinarDepois(false);
  }

  const diaSemana = deIso(inicio).getDay();

  const feriadosNacionais = useMemo(() => {
    const primeiro = deIso(inicio).getFullYear();
    const ultimo = new Date(
      deIso(inicio).getFullYear(),
      deIso(inicio).getMonth() + meses,
      0,
    ).getFullYear();
    return feriadosNacionaisNoIntervalo(primeiro, ultimo);
  }, [inicio, meses]);

  const contato = useMemo(
    () => ({ redeSocial, whatsapp, email, site }),
    [redeSocial, whatsapp, email, site],
  );

  const contrato: Contrato = useMemo(() => {
    return {
      aluno,
      professor,
      plano,
      inicio,
      meses,
      diaSemana,
      horario,
      duracao,
      valor,
      vencimento,
      feriados: [
        ...feriadosNacionais.filter((f) => !desmarcados.includes(f.data)),
        ...locais,
      ],
      ferias,
      reposicoes,
      combinarDepois,
      observacoes,
    };
  }, [
    aluno,
    professor,
    plano,
    inicio,
    meses,
    diaSemana,
    horario,
    duracao,
    valor,
    vencimento,
    feriadosNacionais,
    desmarcados,
    locais,
    ferias,
    reposicoes,
    combinarDepois,
    observacoes,
  ]);

  const resultado = useMemo(() => calcular(contrato), [contrato]);
  const b = resultado.balanco;

  // O documento não sai enquanto o plano não fechar: ou o professor marca as
  // reposições, ou assume por escrito que vai combinar depois.
  const bloqueado = b.pendencia > 0 && !combinarDepois;

  async function baixarPdf() {
    const svg1 = refPagina1.current?.querySelector("svg");
    const svg2 = refPagina2.current?.querySelector("svg");
    if (!svg1 || !svg2 || bloqueado) return;

    setGerando(true);
    setErroPdf(null);
    try {
      const [{ jsPDF }, { svg2pdf }, poppins] = await Promise.all([
        import("jspdf"),
        import("svg2pdf.js"),
        import("@/lib/calendario/poppins"),
      ]);
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // As fontes internas do PDF são só Helvetica/Times/Courier. Registrar a
      // Poppins com o nome "Poppins" é o que faz o svg2pdf casar com o
      // font-family declarado no SVG.
      doc.addFileToVFS("Poppins-Regular.ttf", poppins.POPPINS_REGULAR_BASE64);
      doc.addFont("Poppins-Regular.ttf", "Poppins", "normal");
      doc.addFileToVFS("Poppins-SemiBold.ttf", poppins.POPPINS_SEMIBOLD_BASE64);
      doc.addFont("Poppins-SemiBold.ttf", "Poppins", "bold");

      const opcoes = { x: 0, y: 0, width: A4_LARGURA, height: A4_ALTURA };
      await svg2pdf(svg1, doc, opcoes);
      doc.addPage();
      await svg2pdf(svg2, doc, opcoes);

      const nome = (aluno.trim() || "aluno")
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-zA-Z0-9]+/g, "-");
      doc.save(`Calendario-${nome}.pdf`);
    } catch (e) {
      setErroPdf(
        e instanceof Error ? e.message : "Não foi possível gerar o PDF.",
      );
    } finally {
      setGerando(false);
    }
  }

  const saldoCor =
    b.pendencia > 0
      ? "text-primary"
      : b.saldo === 0
        ? "text-green-400"
        : "text-teal";

  return (
    <div className="mx-auto grid max-w-[1600px] gap-8 px-6 py-10 lg:grid-cols-[380px_1fr]">
      {/* ------------------------------------------------------ formulário */}
      <div className="space-y-6">
        <section className={cardCls}>
          <h2 className="font-extrabold text-white">Contrato</h2>

          <Campo label="Aluno(a)">
            <input
              className={inputCls}
              value={aluno}
              onChange={(e) => setAluno(e.target.value)}
              placeholder="Nome do aluno"
            />
          </Campo>

          <Campo label="Professor(a)">
            <input
              className={inputCls}
              value={professor}
              onChange={(e) => setProfessor(e.target.value)}
              placeholder="Ricardo Novais"
            />
          </Campo>

          <Campo label="Plano">
            <select
              className={inputCls}
              value={plano}
              onChange={(e) => setPlano(e.target.value as Plano)}
            >
              {PLANOS.map((p) => (
                <option key={p} value={p} className="text-charcoal">
                  {ROTULO_PLANO[p]} — {AULAS_POR_PLANO[p]} aulas
                </option>
              ))}
            </select>
          </Campo>

          <div className="grid grid-cols-2 gap-3">
            <Campo label="Primeira aula" dica={DIAS_SEMANA_PLURAL[diaSemana]}>
              <input
                type="date"
                className={inputCls}
                value={inicio}
                onChange={(e) => e.target.value && setInicio(e.target.value)}
              />
            </Campo>
            <Campo label="Janela" dica="meses exibidos">
              <select
                className={inputCls}
                value={meses}
                onChange={(e) => setMeses(Number(e.target.value))}
              >
                {[6, 7, 8, 9, 10, 11, 12].map((m) => (
                  <option key={m} value={m} className="text-charcoal">
                    {m} meses
                  </option>
                ))}
              </select>
            </Campo>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Campo label="Horário">
              <input
                className={inputCls}
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
              />
            </Campo>
            <Campo label="Duração da aula">
              <select
                className={inputCls}
                value={duracao}
                onChange={(e) => setDuracao(Number(e.target.value))}
              >
                {DURACOES.map((d) => (
                  <option key={d} value={d} className="text-charcoal">
                    {d} minutos
                  </option>
                ))}
              </select>
            </Campo>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Campo label="Mensalidade">
              <input
                className={inputCls}
                value={valor}
                onChange={(e) => setValor(e.target.value)}
              />
            </Campo>
            <Campo label="Vencimento" dica="dia do mês">
              <input
                className={inputCls}
                value={vencimento}
                onChange={(e) => setVencimento(e.target.value)}
              />
            </Campo>
          </div>
        </section>

        {/* -------------------------------------------------------- férias */}
        <section className={cardCls}>
          <div className="flex items-baseline justify-between">
            <h2 className="font-extrabold text-white">Semanas de descanso</h2>
            <button
              type="button"
              onClick={() => setFerias(feriasPadrao(deIso(inicio), meses))}
              className="text-xs font-semibold text-primary hoverable:underline"
            >
              restaurar padrão
            </button>
          </div>
          <p className="text-xs text-white/40">
            O padrão é a 2ª quinzena de julho e a 1ª de janeiro. As datas são
            livres — o que o contrato fixa é a quantidade.
          </p>

          {ferias.map((p, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="date"
                className={`${inputCls} mt-0`}
                value={p.inicio}
                onChange={(e) =>
                  setFerias(
                    ferias.map((x, j) =>
                      j === i ? { ...x, inicio: e.target.value } : x,
                    ),
                  )
                }
              />
              <input
                type="date"
                className={`${inputCls} mt-0`}
                value={p.fim}
                onChange={(e) =>
                  setFerias(
                    ferias.map((x, j) =>
                      j === i ? { ...x, fim: e.target.value } : x,
                    ),
                  )
                }
              />
              <button
                type="button"
                aria-label="Remover período"
                onClick={() => setFerias(ferias.filter((_, j) => j !== i))}
                className="shrink-0 rounded-lg px-2 py-2 text-white/30 hoverable:text-primary"
              >
                ✕
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => setFerias([...ferias, { inicio, fim: inicio }])}
            className="w-full rounded-lg border border-dashed border-teal/50 py-2 text-sm font-semibold text-teal"
          >
            + adicionar período
          </button>
        </section>

        {/* ---------------------------------------------------- reposições */}
        {(b.pendencia > 0 || reposicoes.length > 0) && (
          <section
            className={`${cardCls} ${bloqueado ? "border-primary/60 bg-primary/10" : ""}`}
          >
            <h2 className="font-extrabold text-white">Aulas de reposição</h2>
            <p className="text-xs text-white/60">
              {b.pendencia > 0
                ? `${DIAS_SEMANA_PLURAL[diaSemana]} não comportam as ${b.aulasEsperadas} aulas do período. ` +
                  `${b.pendencia === 1 ? "Falta 1 aula" : `Faltam ${b.pendencia} aulas`} — escolha as datas de reposição ou assuma que serão combinadas depois.`
                : "As reposições marcadas fecham o número de aulas do período."}
            </p>

            {reposicoes.map((data, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="date"
                  className={`${inputCls} mt-0`}
                  value={data}
                  onChange={(e) =>
                    setReposicoes(
                      reposicoes.map((x, j) => (j === i ? e.target.value : x)),
                    )
                  }
                />
                <button
                  type="button"
                  aria-label="Remover reposição"
                  onClick={() =>
                    setReposicoes(reposicoes.filter((_, j) => j !== i))
                  }
                  className="shrink-0 rounded-lg px-2 py-2 text-white/30 hoverable:text-primary"
                >
                  ✕
                </button>
              </div>
            ))}

            <button
              type="button"
              // Nasce vazia de propósito: preenchida com a data de início, ela
              // cairia num dia que já é aula e não somaria nada ao balanço.
              onClick={() => setReposicoes([...reposicoes, ""])}
              className="w-full rounded-lg border border-dashed border-teal/50 py-2 text-sm font-semibold text-teal"
            >
              + adicionar data de reposição
            </button>

            <label className="flex items-start gap-2 text-sm text-white/70">
              <input
                type="checkbox"
                className="mt-1"
                checked={combinarDepois}
                onChange={(e) => setCombinarDepois(e.target.checked)}
              />
              <span>Combinarei depois com o responsável</span>
            </label>
          </section>
        )}

        {/* ------------------------------------------------------ feriados */}
        <section className={cardCls}>
          <h2 className="font-extrabold text-white">Feriados</h2>
          <p className="text-xs text-white/40">
            Os nacionais já vêm marcados. Estaduais e municipais precisam ser
            adicionados por você — nenhum sistema adivinha o feriado da sua
            cidade.
          </p>

          <div className="max-h-56 space-y-1 overflow-y-auto pr-1">
            {feriadosNacionais.map((f) => (
              <label
                key={f.data}
                className="flex items-center gap-2 text-xs text-white/70"
              >
                <input
                  type="checkbox"
                  checked={!desmarcados.includes(f.data)}
                  onChange={(e) =>
                    setDesmarcados(
                      e.target.checked
                        ? desmarcados.filter((d) => d !== f.data)
                        : [...desmarcados, f.data],
                    )
                  }
                />
                <span className="tabular-nums text-white/35">
                  {porExtensoCurto(deIso(f.data))}
                </span>
                <span>{f.nome}</span>
                {f.facultativo && (
                  <span className="rounded bg-white/10 px-1 text-[10px] text-white/40">
                    facultativo
                  </span>
                )}
              </label>
            ))}
          </div>

          {locais.length > 0 && (
            <div className="space-y-1 border-t border-white/10 pt-2">
              {locais.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-xs text-white/70"
                >
                  <span className="tabular-nums text-white/35">
                    {porExtensoCurto(deIso(f.data))}
                  </span>
                  <span>{f.nome}</span>
                  <button
                    type="button"
                    aria-label="Remover feriado"
                    onClick={() => setLocais(locais.filter((_, j) => j !== i))}
                    className="ml-auto text-white/30 hoverable:text-primary"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2 border-t border-white/10 pt-3">
            <input
              type="date"
              className={`${inputCls} mt-0`}
              value={novoLocalData}
              onChange={(e) => setNovoLocalData(e.target.value)}
            />
            <input
              className={`${inputCls} mt-0`}
              placeholder="Nome do feriado"
              value={novoLocalNome}
              onChange={(e) => setNovoLocalNome(e.target.value)}
            />
            <button
              type="button"
              disabled={!novoLocalData || !novoLocalNome.trim()}
              onClick={() => {
                setLocais([
                  ...locais,
                  {
                    data: novoLocalData,
                    nome: novoLocalNome.trim(),
                    local: true,
                  },
                ]);
                setNovoLocalData("");
                setNovoLocalNome("");
              }}
              className="shrink-0 rounded-lg bg-teal px-3 text-sm font-bold text-dark disabled:opacity-40"
            >
              +
            </button>
          </div>
        </section>

        <section className={cardCls}>
          <h2 className="font-extrabold text-white">Observações</h2>
          <p className="text-xs text-white/40">
            Uma por linha. As observações sobre feriados, reposições e descanso
            são geradas automaticamente e não precisam ser escritas aqui.
          </p>
          <textarea
            className={`${inputCls} h-24 resize-y`}
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            placeholder="As aulas começaram na última semana de junho, período que não consta neste calendário."
          />
        </section>

        <section className={cardCls}>
          <h2 className="font-extrabold text-white">Contato no rodapé</h2>
          <Campo label="Rede social">
            <input
              className={inputCls}
              value={redeSocial}
              onChange={(e) => setRedeSocial(e.target.value)}
              placeholder="@ricardonovais_amigoviolao"
            />
          </Campo>
          <Campo label="WhatsApp">
            <input
              className={inputCls}
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="(99) 99999-9999"
            />
          </Campo>
          <Campo label="E-mail">
            <input
              type="email"
              className={inputCls}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="professor@exemplo.com"
            />
          </Campo>
          <Campo label="Site">
            <input
              className={inputCls}
              value={site}
              onChange={(e) => setSite(e.target.value)}
              placeholder="www.exemplo.com.br"
            />
          </Campo>
        </section>
      </div>

      {/* --------------------------------------------- saldo + pré-visualização */}
      <div className="space-y-6">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-extrabold text-white">
              Conferência do contrato
            </h2>
            <button
              type="button"
              onClick={baixarPdf}
              disabled={gerando || bloqueado}
              className="rounded-full bg-green-600 px-6 py-3 text-sm font-bold text-white transition-colors hoverable:bg-green-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {gerando ? "Gerando…" : "Baixar PDF"}
            </button>
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              ["Aulas possíveis", b.ocorrencias, "ocorrências no período"],
              ["Aulas do plano", b.aulasEsperadas, `4 × ${meses} meses`],
              [
                "Descanso que cabe",
                b.folgaDisponivel,
                b.folgaDisponivel === 1 ? "semana" : "semanas",
              ],
              [
                "Descanso marcado",
                b.semanasMarcadas,
                b.semanasMarcadas === 1 ? "semana" : "semanas",
              ],
            ].map(([rotulo, numero, nota]) => (
              <div key={rotulo as string}>
                <dt className="text-xs font-bold uppercase tracking-wide text-white/40">
                  {rotulo}
                </dt>
                <dd className="text-2xl font-extrabold text-white">{numero}</dd>
                <dd className="text-xs text-white/35">{nota}</dd>
              </div>
            ))}
          </dl>

          <p className={`mt-4 text-sm font-semibold ${saldoCor}`}>
            {b.pendencia > 0
              ? `${b.pendencia === 1 ? "Falta 1 aula" : `Faltam ${b.pendencia} aulas`} para fechar as ${b.aulasEsperadas} do período.`
              : b.saldo === 0
                ? `Fecha certo: ${b.entregues} aulas entregues para ${b.aulasEsperadas} contratadas.`
                : `Sobram ${b.saldo} ${b.saldo === 1 ? "semana" : "semanas"} de descanso que ainda podem ser marcadas.`}
          </p>

          {b.feriadosNoDia.length > 0 && (
            <p className="mt-2 text-sm text-white/60">
              {b.feriadosNoDia.length}{" "}
              {b.feriadosNoDia.length === 1 ? "feriado cai" : "feriados caem"} em{" "}
              {DIAS_SEMANA_PLURAL[diaSemana]} — {b.abonados} abonado(s),{" "}
              {b.aRepor} a repor.
            </p>
          )}

          {bloqueado && (
            <p className="mt-3 rounded-lg bg-primary/15 p-3 text-sm text-primary">
              O PDF fica bloqueado enquanto o número de aulas não fecha. Marque
              as datas de reposição ou assinale “Combinarei depois com o
              responsável”.
            </p>
          )}

          {erroPdf && (
            <p className="mt-3 rounded-lg bg-primary/15 p-3 text-sm text-primary">
              {erroPdf}
            </p>
          )}
        </section>

        <div
          ref={refPagina1}
          className="[&>svg]:h-auto [&>svg]:w-full [&>svg]:rounded-xl [&>svg]:shadow-2xl"
        >
          <PaginaCalendario
            contrato={contrato}
            resultado={resultado}
            logoDataUrl={logoDataUrl}
            contato={contato}
          />
        </div>

        <div
          ref={refPagina2}
          className="[&>svg]:h-auto [&>svg]:w-full [&>svg]:rounded-xl [&>svg]:shadow-2xl"
        >
          <PaginaInformacoes
            contrato={contrato}
            resultado={resultado}
            logoDataUrl={logoDataUrl}
            contato={contato}
          />
        </div>
      </div>
    </div>
  );
}
