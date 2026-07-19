import type { Metadata } from "next";
import { notFound } from "next/navigation";
import QuizPlayer from "@/components/quiz/QuizPlayer";
import { getAllQuizzes, getQuiz } from "@/lib/quizzes";

// Gera estaticamente cada quiz no build (Jamstack, como o blog).
export function generateStaticParams() {
  return getAllQuizzes().map((quiz) => ({ slug: quiz.slug }));
}

// Slugs desconhecidos dão 404 em vez de renderizar sob demanda.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const quiz = getQuiz(slug);
  if (!quiz) return {};
  return {
    title: `${quiz.title} - Amigo Violão`,
    description: quiz.description,
    // Páginas de quiz existem para incorporação no Hotmart — fora do índice.
    robots: { index: false },
  };
}

export default async function QuizPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const quiz = getQuiz(slug);
  if (!quiz) notFound();

  return (
    <main className="flex min-h-dvh items-start justify-center bg-cream/40 p-3 sm:p-4">
      <QuizPlayer title={quiz.title} questions={quiz.questions} />
    </main>
  );
}
