"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const courseLinks = [
  { label: "Curso para Crianças", href: "/cursos/criancas" },
  { label: "Curso para Iniciantes", href: "/cursos/iniciantes" },
  { label: "Curso de Clássico", href: "/cursos/classico" },
  { label: "Para Professores", href: "/cursos/professores" },
];

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Já sou aluno", href: "/login" },
];

const ctaClasses =
  "rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-[background-color,transform] duration-150 ease-snappy hoverable:bg-primary-dark active:scale-[0.97]";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-dark/95 backdrop-blur supports-[backdrop-filter]:bg-dark/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="shrink-0" onClick={() => setOpen(false)}>
          <Image
            src="https://amigoviolao.com/wp-content/uploads/2021/05/cropped-cropped-Logo-Branca-site-Amigo-Violao-2.png.webp"
            alt="Amigo Violão"
            width={180}
            height={41}
            priority
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-white/90 transition-colors hoverable:text-primary"
          >
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
                className="transition-transform duration-200 ease-snappy group-hover:rotate-180 group-focus-within:rotate-180"
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
            <div className="invisible absolute left-1/2 top-full z-50 w-56 -translate-x-1/2 translate-y-1 pt-3 opacity-0 transition-[opacity,transform] duration-200 ease-snappy group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
              <div className="overflow-hidden rounded-xl border border-black/5 bg-white py-2 shadow-lg">
                {courseLinks.map((course) => (
                  <Link
                    key={course.href}
                    href={course.href}
                    className="block px-4 py-2.5 text-sm font-medium text-charcoal transition-colors hoverable:bg-cream hoverable:text-primary"
                  >
                    {course.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link
            href="/blog"
            className="text-sm font-medium text-white/90 transition-colors hoverable:text-primary"
          >
            Blog
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-white/90 transition-colors hoverable:text-primary"
          >
            Já sou aluno
          </Link>
          <Link href="/seja-aluno" className={ctaClasses}>
            Seja aluno
          </Link>
        </nav>

        <button
          type="button"
          aria-label="Abrir menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-transform duration-150 ease-snappy active:scale-[0.9] md:hidden"
        >
          <span className="relative block h-4 w-6">
            <span
              className={`absolute left-0 top-0 block h-0.5 w-6 bg-current transition-transform duration-200 ease-snappy ${
                open ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[7px] block h-0.5 w-6 bg-current transition-opacity duration-150 ease-snappy ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[14px] block h-0.5 w-6 bg-current transition-transform duration-200 ease-snappy ${
                open ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

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
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-2.5 text-sm font-medium text-white/90 transition-colors hoverable:bg-white/5 hoverable:text-primary"
            >
              Já sou aluno
            </Link>
            <Link
              href="/seja-aluno"
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
