import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllQuizCards } from "@/lib/quizzes";

export const metadata: Metadata = {
  title: "Quizzes – Amigo Violão",
  description:
    "Biblioteca de quizzes interativos de teoria musical do Amigo Violão.",
  // Em teste — fora do índice, como o restante do site por enquanto.
  robots: { index: false },
};

const EMBED_BASE = "https://amigoviolao.vercel.app";

const categoryLabel = (slug?: string) =>
  slug
    ? slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    : null;

export default function QuizzesPage() {
  const quizzes = getAllQuizCards();

  return (
    <>
      <Header />
      <main className="flex-1 bg-cream/30">
        <section className="mx-auto max-w-5xl px-6 py-14">
          <h1 className="text-3xl font-extrabold text-charcoal sm:text-4xl">
            Quizzes
          </h1>
          <p className="mt-3 max-w-2xl text-foreground/70">
            Treinos interativos de teoria musical. Cada quiz pode ser feito aqui
            ou incorporado numa aula.
          </p>

          {quizzes.length === 0 ? (
            <p className="mt-10 text-foreground/60">
              Nenhum quiz publicado ainda.
            </p>
          ) : (
            <ul className="mt-10 grid gap-5 sm:grid-cols-2">
              {quizzes.map((quiz) => {
                const height = quiz.embedHeight ?? 800;
                const embed = `<div style="max-width:704px;margin:0 auto;">
  <iframe
    src="${EMBED_BASE}/quiz/${quiz.slug}"
    title="${quiz.title}"
    loading="lazy"
    style="width:100%;height:${height}px;border:0;"
    allow="fullscreen"
  ></iframe>
</div>`;
                return (
                  <li
                    key={quiz.slug}
                    className="flex flex-col rounded-2xl border border-black/10 bg-white p-6 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-lg font-bold text-charcoal">
                        {quiz.title}
                      </h2>
                      <span className="shrink-0 rounded-full bg-teal/10 px-3 py-1 text-xs font-bold text-teal-text">
                        {quiz.questionCount} questões
                      </span>
                    </div>
                    {categoryLabel(quiz.category) && (
                      <span className="mt-2 w-fit rounded-full bg-cream px-2.5 py-0.5 text-xs font-semibold text-charcoal">
                        {categoryLabel(quiz.category)}
                      </span>
                    )}
                    <p className="mt-3 flex-1 text-sm text-foreground/70">
                      {quiz.description}
                    </p>

                    <div className="mt-5 flex items-center gap-3">
                      <Link
                        href={`/quiz/${quiz.slug}`}
                        className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-white transition-colors hoverable:bg-primary-dark"
                      >
                        Abrir quiz
                      </Link>
                    </div>

                    <details className="mt-4 text-sm">
                      <summary className="cursor-pointer font-semibold text-charcoal">
                        Incorporar (iframe)
                      </summary>
                      <pre className="mt-2 overflow-x-auto rounded-lg bg-dark/95 p-3 text-xs text-white/90">
                        <code>{embed}</code>
                      </pre>
                    </details>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
