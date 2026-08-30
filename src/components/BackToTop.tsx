"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// r=21 num viewBox de 48: sobra 3px para a espessura do traço não vazar.
const RADIUS = 21;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function BackToTop() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  // O anel ao redor do botão mostra quanto da página já foi percorrido — o
  // botão deixa de ser só um atalho e vira indicador de posição.
  //
  // O progresso é escrito direto no atributo do <circle>, fora do React: era
  // um setState por frame de scroll, ou seja, um render da árvore inteira do
  // componente a cada quadro, em todas as páginas. `visible` continua em
  // estado porque muda no máximo duas vezes por sessão de rolagem.
  const progressRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;

      setVisible(window.scrollY > 400);
      progressRef.current?.setAttribute(
        "stroke-dashoffset",
        String(CIRCUMFERENCE * (1 - progress))
      );
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Paginas de quiz sao incorporadas via iframe — sem chrome do site.
  if (pathname?.startsWith("/quiz")) return null;

  // Nas paginas de venda o StickyMobileCTA ocupa o rodape no mobile; sem isto
  // o botao pousa em cima da barra de compra. Mesmo ajuste do WhatsAppFloat.
  const temBarraDeCompra = /^\/cursos\/[^/]+/.test(pathname ?? "");

  return (
    <button
      type="button"
      aria-label="Voltar ao topo"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`group fixed right-6 z-50 ${
        temBarraDeCompra ? "bottom-24 md:bottom-6" : "bottom-6"
      } flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-b from-primary to-primary-dark text-white shadow-cta transition-[opacity,transform,box-shadow] duration-300 ease-snappy motion-reduce:transition-none hoverable:shadow-cta-strong active:scale-90 ${
        visible
          ? "translate-y-0 scale-100 opacity-100"
          : "pointer-events-none translate-y-3 scale-90 opacity-0"
      }`}
    >
      <svg
        className="absolute inset-0 -rotate-90"
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="24"
          cy="24"
          r={RADIUS}
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="2.5"
        />
        <circle
          ref={progressRef}
          cx="24"
          cy="24"
          r={RADIUS}
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
        />
      </svg>

      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
        className="relative transition-transform duration-300 ease-spring [@media(hover:hover)_and_(pointer:fine)]:group-hover:-translate-y-0.5"
      >
        <path
          d="M10 15V5M10 5l-5 5M10 5l5 5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
