"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const navLinks = [
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
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/90 transition-colors hoverable:text-primary"
            >
              {link.label}
            </Link>
          ))}
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
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2.5 text-sm font-medium text-white/90 transition-colors hoverable:bg-white/5 hoverable:text-primary"
              >
                {link.label}
              </Link>
            ))}
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
