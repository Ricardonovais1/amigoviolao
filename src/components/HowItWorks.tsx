"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import Link from "next/link";
import Ambient from "./Ambient";
import Reveal from "./Reveal";

type TabItem = { title: string; text: string };

type Tab = {
  label: string;
  items: TabItem[];
  cta: { label: string; href: string };
};

const tabs: Tab[] = [
  {
    label: "Para Crianças",
    items: [
      {
        title: "Violão para crianças",
        text: "De cordas soltas a acordes. Ao concluir, o aluno avança para o curso de Iniciantes, já incluso no seu acesso.",
      },
      {
        title: "Jogos Musicais Interativos",
        text: "Quizzes dinâmicos para treinar a percepção musical de forma divertida.",
      },
      {
        title: "Violão Gospel Infantil",
        text: "Músicas simples e consagradas, seguindo a consagrada metodologia Amigo Violão.",
      },
    ],
    cta: { label: "Quero Inscrever Meu Filho", href: "/cursos/criancas" },
  },
  {
    label: "Para iniciantes",
    items: [
      {
        title: "Curso MOVI",
        text: "Toque desde músicas simples com apenas um dedo até canções completas com acordes.",
      },
      {
        title: "Repertório Progressivo",
        text: "De melodias simples a solos instrumentais completos e detalhados.",
      },
      {
        title: "Método Passo a Passo",
        text: "Evolução estruturada e descomplicada ao longo de 6 módulos práticos.",
      },
    ],
    cta: { label: "Quero Tocar Violão do Zero", href: "/cursos/iniciantes" },
  },
  {
    label: "Para avançar",
    items: [
      {
        title: "Violão Clássico",
        text: "Teoria, leitura musical e técnica refinada com uma abordagem leve e interativa.",
      },
      {
        title: "Violão Flamenco",
        text: "Técnicas e ritmos espanhóis para dominar o instrumento como poucos.",
      },
      {
        title: "Harmonia e Improvisação",
        text: "Domine harmonia funcional, escalas e arpejos para tocar com liberdade.",
      },
    ],
    cta: { label: "Dominar Minha Técnica de violão", href: "/cursos/classico" },
  },
  {
    label: "Para ensinar",
    items: [
      {
        title: "Metodologia Amigo Violão",
        text: "O passo a passo definitivo para professores que ensinam violão para crianças.",
      },
      {
        title: "Materiais Didáticos",
        text: "PDF de apoio prontos para baixar e usar em aula, além de cifras e bônus exclusivos.",
      },
      {
        title: "Comunidade de Professores",
        text: "Um espaço ativo para trocar experiências, tirar dúvidas e compartilhar ideias.",
      },
    ],
    cta: {
      label: "Quero Ser um Professor Amigo Violão",
      href: "/cursos/professores",
    },
  },
];

type Indicator = { left: number; top: number; width: number; height: number };

export default function HowItWorks() {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  // Enquanto a pílula não foi medida (SSR, antes da hidratação), o botão
  // ativo carrega o próprio fundo — assim nunca há um estado sem destaque.
  const [indicator, setIndicator] = useState<Indicator | null>(null);

  const measure = useCallback(() => {
    const button = buttonsRef.current[active];
    const list = listRef.current;
    if (!button || !list) return;
    setIndicator({
      left: button.offsetLeft,
      top: button.offsetTop,
      width: button.offsetWidth,
      height: button.offsetHeight,
    });
  }, [active]);

  // useEffect (e não useLayoutEffect) para não emitir o aviso de SSR do
  // React: o botão ativo já pinta o fundo branco no mesmo lugar antes da
  // medição, então a troca para a pílula não pisca.
  useEffect(measure, [measure]);

  // A faixa de abas quebra em várias linhas conforme a largura: qualquer
  // mudança de tamanho reposiciona a pílula.
  useEffect(() => {
    const list = listRef.current;
    if (!list || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, [measure]);

  // A troca da fonte de fallback pela Poppins muda a largura dos botões sem
  // necessariamente mudar a caixa da lista — o ResizeObserver não veria, e a
  // pílula ficaria desalinhada até o primeiro resize.
  useEffect(() => {
    document.fonts?.ready.then(measure);
  }, [measure]);

  // role="tab" cria a expectativa de navegação por setas (APG). Sem isto, o
  // teclado ficaria pior do que estava antes dos roles.
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = tabs.length - 1;
    const next = {
      ArrowRight: active === last ? 0 : active + 1,
      ArrowLeft: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    }[event.key];

    if (next === undefined) return;
    event.preventDefault();
    setActive(next);
    buttonsRef.current[next]?.focus();
  };

  return (
    <section
      id="como-funciona"
      className="seam-top grain relative isolate overflow-hidden bg-teal py-24"
      style={{ "--grain-opacity": "0.07" } as CSSProperties}
    >
      <Ambient preset="teal" />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-dark">
            Um acesso, quatro caminhos
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Como funciona?
          </h2>
          <p className="mt-3 text-lg font-medium text-white/90">
            Um único acesso que inclui tudo isso:
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div
            ref={listRef}
            role="tablist"
            aria-label="Públicos dos cursos"
            onKeyDown={handleKeyDown}
            className="relative mt-10 flex flex-wrap justify-center gap-2"
          >
            {indicator && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute rounded-full bg-white shadow-[0_8px_20px_-10px_rgba(0,0,0,0.45)] transition-[transform,width,height] duration-300 ease-snappy motion-reduce:transition-none"
                style={{
                  width: indicator.width,
                  height: indicator.height,
                  transform: `translate3d(${indicator.left}px, ${indicator.top}px, 0)`,
                  left: 0,
                  top: 0,
                }}
              />
            )}

            {tabs.map((tab, index) => {
              const isActive = active === index;
              return (
                <button
                  key={tab.label}
                  ref={(node) => {
                    buttonsRef.current[index] = node;
                  }}
                  type="button"
                  role="tab"
                  id={`como-funciona-aba-${index}`}
                  aria-selected={isActive}
                  tabIndex={isActive ? 0 : -1}
                  aria-controls="como-funciona-painel"
                  onClick={() => setActive(index)}
                  className={`relative rounded-full px-5 py-2 text-sm font-semibold transition-[background-color,color,transform] duration-300 ease-snappy active:scale-[0.97] ${
                    isActive
                      ? `text-teal-text ${indicator ? "" : "bg-white"}`
                      : "bg-white/10 text-white hoverable:bg-white/20"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={180}>
          <div
            id="como-funciona-painel"
            role="tabpanel"
            aria-labelledby={`como-funciona-aba-${active}`}
            key={active}
            className="grain relative mt-8 overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary-dark p-8 text-left shadow-panel [animation:tab-content-in_260ms_cubic-bezier(0.23,1,0.32,1)_both] motion-reduce:[animation:none]"
          >
            {/* Brilho no canto superior: dá volume ao cartão laranja. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.14),transparent_65%)]"
            />

            <ul className="relative space-y-4 text-white">
              {tabs[active].items.map((item, i) => (
                <li
                  key={i}
                  className="flex gap-4 [animation:tab-content-in_320ms_cubic-bezier(0.23,1,0.32,1)_both] motion-reduce:[animation:none]"
                  style={{ animationDelay: `${80 + i * 70}ms` }}
                >
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-primary-dark">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">
                    <strong className="font-bold">{item.title}:</strong>{" "}
                    <span>{item.text}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="relative mt-9 text-center">
              <Link
                href={tabs[active].cta.href}
                className="sheen group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-primary shadow-[0_10px_28px_-12px_rgba(0,0,0,0.5)] transition-[background-color,transform,box-shadow] duration-200 ease-snappy hoverable:-translate-y-0.5 hoverable:bg-cream active:scale-[0.97]"
                style={
                  { "--sheen-color": "rgba(239,84,0,0.18)" } as CSSProperties
                }
              >
                {tabs[active].cta.label}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                  className="transition-transform duration-300 ease-snappy [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-1"
                >
                  <path
                    d="M3 8h9m0 0L8.5 4.5M12 8l-3.5 3.5"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
