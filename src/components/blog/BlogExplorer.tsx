"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { PostCardData } from "@/lib/blog";
import { FEATURED_CATEGORY_GROUPS, categoryLabel } from "@/lib/categories";
import PostCard from "./PostCard";

// Client-side blog explorer: minimalist dropdown filter + search, replacing
// the old pile of gray category chips. Purely local state — URLs never change,
// so the statically generated /blog and /blog/categoria/* pages keep their SEO.

// Strips combining diacritical marks (U+0300..U+036F) after NFD decomposition
// so search matches regardless of accents ("violao" finds "violão").
const COMBINING_MARKS = new RegExp(
  `[${String.fromCharCode(0x300)}-${String.fromCharCode(0x36f)}]`,
  "g",
);

const normalize = (s: string) =>
  s.normalize("NFD").replace(COMBINING_MARKS, "").toLowerCase();

export default function BlogExplorer({ posts }: { posts: PostCardData[] }) {
  const [open, setOpen] = useState(false);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close the popover on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    return posts.filter(
      (p) =>
        (!activeSlug || p.categories.includes(activeSlug)) &&
        (!q ||
          normalize(p.title).includes(q) ||
          normalize(p.description).includes(q)),
    );
  }, [posts, activeSlug, query]);

  return (
    <div>
      {/* Filter row: dropdown + active badge (left) / search (right) */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              aria-expanded={open}
              aria-haspopup="true"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center gap-2 rounded-lg border border-black/10 bg-[#f5f5f5] px-4 py-2.5 text-sm font-semibold text-dark transition-colors duration-200 ease-snappy hoverable:border-black/20 hoverable:bg-white active:scale-[0.97]"
            >
              Explorar Assuntos
              <svg
                viewBox="0 0 12 12"
                aria-hidden="true"
                className={`h-3 w-3 text-charcoal/60 transition-transform duration-200 ease-snappy ${open ? "rotate-180" : ""}`}
              >
                <path
                  d="M2 4.5 6 8.5 10 4.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {open ? (
              <div className="absolute left-0 top-full z-40 mt-2 w-[min(88vw,42rem)] rounded-xl border border-black/10 bg-white p-5 shadow-xl [animation:tab-content-in_200ms_var(--ease-snappy)] motion-reduce:[animation:none]">
                <div className="grid gap-6 sm:grid-cols-3">
                  {FEATURED_CATEGORY_GROUPS.map((group) => (
                    <div key={group.title}>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-charcoal/50">
                        {group.title}
                      </p>
                      <ul className="space-y-0.5">
                        {group.categories.map((cat) => (
                          <li key={cat.slug}>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveSlug(cat.slug);
                                setOpen(false);
                              }}
                              className={`block w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors hoverable:bg-cream/60 hoverable:text-dark ${
                                activeSlug === cat.slug
                                  ? "font-semibold text-primary"
                                  : "text-charcoal"
                              }`}
                            >
                              {cat.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {activeSlug ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 py-1.5 pl-3 pr-1.5 text-sm font-semibold text-primary">
              {categoryLabel(activeSlug)}
              <button
                type="button"
                aria-label="Remover filtro de categoria"
                onClick={() => setActiveSlug(null)}
                className="rounded-full p-1 transition-colors hoverable:bg-primary/15 active:scale-[0.97]"
              >
                <svg viewBox="0 0 12 12" aria-hidden="true" className="h-3 w-3">
                  <path
                    d="M2.5 2.5 9.5 9.5 M9.5 2.5 2.5 9.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </span>
          ) : null}
        </div>

        <label className="relative block sm:w-64">
          <span className="sr-only">Buscar no blog</span>
          <svg
            viewBox="0 0 20 20"
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40"
          >
            <circle
              cx="9"
              cy="9"
              r="5.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <path
              d="m13.2 13.2 3.6 3.6"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar no blog..."
            className="w-full rounded-lg border border-black/10 bg-white py-2.5 pl-10 pr-4 text-sm text-dark transition-colors placeholder:text-charcoal/40 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/15"
          />
        </label>
      </div>

      {/* Post grid */}
      {filtered.length === 0 ? (
        <p className="mt-12 text-center text-charcoal/70">
          Nenhum artigo encontrado
          {query.trim() ? ` para “${query.trim()}”` : ""}. Tente outra busca ou
          remova o filtro de categoria.
        </p>
      ) : (
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
