"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HOTMART_CLUB_LOGIN_URL } from "@/lib/links";

const courseLinks = [
  { label: "Curso para Crianças", href: "/cursos/criancas" },
  { label: "Curso para Iniciantes", href: "/cursos/iniciantes" },
  { label: "Curso de Clássico", href: "/cursos/classico" },
  { label: "Para Professores", href: "/cursos/professores" },
];

const ctaClasses =
  "sheen rounded-full bg-gradient-to-b from-primary to-primary-dark px-5 py-2.5 text-sm font-semibold text-white shadow-cta transition-[box-shadow,transform] duration-200 ease-snappy hoverable:-translate-y-0.5 hoverable:shadow-cta-strong active:scale-[0.97]";

const navLinkClasses =
  "underline-grow text-sm font-medium text-white/90 transition-colors hoverable:text-primary";

export default function Header() {
  const [open, setOpen] = useState(false);
  // Antes de rolar, o header é praticamente invisível sobre o herói escuro;
  // ao descer ele ganha corpo, sombra e um filete de marca.
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Histerese: entra em 24px, só sai em 8px. Com um limiar único o header
    // ficaria piscando entre os dois estados a cada micro-scroll em volta dele.
    const onScroll = () =>
      setScrolled((was) => (was ? window.scrollY > 8 : window.scrollY > 24));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ease-snappy ${
        scrolled
          ? "bg-dark/85 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.9)] backdrop-blur-md supports-[backdrop-filter]:bg-dark/70"
          : "bg-dark/95 supports-[backdrop-filter]:bg-dark/80 backdrop-blur"
      }`}
    >
      {/* Altura fixa de propósito: o header é sticky e ocupa espaço no fluxo,
          então encolher o padding empurraria toda a página 8px para cima no
          meio da leitura (CLS em todas as rotas). A sensação de compactar vem
          do logo, que só escala. */}
      <div className="mx-auto flex h-[73px] max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="shrink-0 transition-transform duration-300 ease-snappy hoverable:scale-[1.03]"
          onClick={() => setOpen(false)}
        >
          {/* scale em vez de width: animar largura reflui o header sticky a
              cada frame de scroll, enquanto transform é composto. */}
          <Image
            src="https://amigoviolao.com/wp-content/uploads/2021/05/cropped-cropped-Logo-Branca-site-Amigo-Violao-2.png.webp"
            alt="Amigo Violão"
            width={180}
            height={41}
            priority
            className={`no-zoom h-auto w-[180px] origin-left transition-transform duration-300 ease-snappy motion-reduce:transition-none ${
              scrolled ? "scale-[0.84]" : "scale-100"
            }`}
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/" className={navLinkClasses}>
            Home
          </Link>

          <div className="group relative">
            <button
              type="button"
              aria-haspopup="true"
              className="flex items-center gap-1 text-sm font-medium text-white/90 transition-colors group-hover:text-primary group-focus-within:text-primary"
            >
              Cursos
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
                className="transition-transform duration-300 ease-snappy group-hover:rotate-180 group-focus-within:rotate-180"
              >
                <path
                  d="M2.5 4.5L6 8l3.5-3.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className="invisible absolute left-1/2 top-full z-50 w-60 -translate-x-1/2 translate-y-1 pt-3 opacity-0 transition-[opacity,transform] duration-200 ease-snappy group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/95 py-2 shadow-panel backdrop-blur-md">
                {courseLinks.map((course) => (
                  <Link
                    key={course.href}
                    href={course.href}
                    className="group/item flex items-center justify-between px-4 py-2.5 text-sm font-medium text-charcoal transition-[background-color,color,padding] duration-200 ease-snappy hoverable:bg-primary-soft hoverable:pl-5 hoverable:text-primary"
                  >
                    {course.label}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                      className="-translate-x-1 opacity-0 transition-[opacity,transform] duration-200 ease-snappy group-hover/item:translate-x-0 group-hover/item:opacity-100"
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
                ))}
              </div>
            </div>
          </div>

          <Link href="/blog" className={navLinkClasses}>
            Blog
          </Link>
          <a
            href={HOTMART_CLUB_LOGIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={navLinkClasses}
          >
            Já sou aluno
          </a>
          <Link href="/#cursos" className={ctaClasses}>
            Seja aluno
          </Link>
        </nav>

        <button
          type="button"
          aria-label="Abrir menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-[background-color,transform] duration-200 ease-snappy hoverable:bg-white/10 active:scale-[0.9] md:hidden"
        >
          <span className="relative block h-4 w-6">
            <span
              className={`absolute left-0 top-0 block h-0.5 w-6 bg-current transition-transform duration-300 ease-snappy ${
                open ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[7px] block h-0.5 w-6 bg-current transition-opacity duration-300 ease-snappy ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[14px] block h-0.5 w-6 bg-current transition-transform duration-300 ease-snappy ${
                open ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {/* Filete de marca que só aparece depois que a página sai do topo. */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent transition-opacity duration-500 ease-snappy ${
          scrolled ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-snappy md:hidden ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <nav
            inert={!open}
            aria-hidden={!open}
            className={`flex flex-col gap-1 border-t border-white/10 px-6 py-4 transition-opacity duration-200 ease-snappy ${
              open ? "opacity-100 delay-100" : "opacity-0"
            }`}
          >
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-2.5 text-sm font-medium text-white/90 transition-colors hoverable:bg-white/5 hoverable:text-primary"
            >
              Home
            </Link>

            <p className="px-2 pt-2 text-xs font-semibold uppercase tracking-wide text-white/40">
              Cursos
            </p>
            {courseLinks.map((course) => (
              <Link
                key={course.href}
                href={course.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-white/90 transition-colors hoverable:bg-white/5 hoverable:text-primary"
              >
                {course.label}
              </Link>
            ))}

            <Link
              href="/blog"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-lg px-2 py-2.5 text-sm font-medium text-white/90 transition-colors hoverable:bg-white/5 hoverable:text-primary"
            >
              Blog
            </Link>
            <a
              href={HOTMART_CLUB_LOGIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-2.5 text-sm font-medium text-white/90 transition-colors hoverable:bg-white/5 hoverable:text-primary"
            >
              Já sou aluno
            </a>
            <Link
              href="/#cursos"
              onClick={() => setOpen(false)}
              className={`mt-2 text-center ${ctaClasses}`}
            >
              Seja aluno
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
