import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Shared shell for the static legal pages. Content is passed as children and
// styled by the `.legal-prose` rules in globals.css.
export default function LegalLayout({
  title,
  updatedAt,
  children,
}: {
  title: string;
  updatedAt: string;
  children: ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1">
        <header className="bg-dark text-white">
          <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-teal">
              Amigo Violão
            </p>
            <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
            <p className="mt-4 text-sm text-white/60">
              Última atualização: {updatedAt}
            </p>
          </div>
        </header>
        <div className="mx-auto max-w-3xl px-6 py-12 sm:py-16">
          <article className="legal-prose">{children}</article>
        </div>
      </main>
      <Footer />
    </>
  );
}
