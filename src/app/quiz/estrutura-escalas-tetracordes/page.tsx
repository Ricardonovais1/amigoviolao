import type { Metadata } from "next";
import QuizPlayer, { type QuizQuestion } from "@/components/quiz/QuizPlayer";

export const metadata: Metadata = {
  title: "Quiz – Estrutura de escalas de 4 notas (tetracordes) - Amigo Violão",
  description:
    "Quiz interativo sobre a estrutura de intervalos de escalas de 4 notas (tetracordes), do curso Teoria Musical para Violonistas.",
  // Página feita para ser incorporada via iFrame no Hotmart — fora do índice de busca.
  robots: { index: false },
};

const PROMPT =
  "Aponte a opção que mostra a ordem correta de intervalos conjuntos na escala de 4 notas abaixo:";

// Opções transcritas na ordem exata de cada questão (não embaralhamos: a ordem
// vem das imagens originais, e "Nenhuma das demais opções." é alternativa real).
// `correct` = índice (0-based) da resposta segundo o gabarito.
const data: { options: string[]; correct: number }[] = [
  {
    options: [
      "Tom, tom, tom.",
      "Semitom, semitom, semitom.",
      "Tom, semitom, semitom.",
      "Tom, tom, semitom.",
      "Semitom, tom, tom.",
      "Semitom, semitom, tom.",
      "Nenhuma das demais opções.",
    ],
    correct: 3,
  },
  {
    options: [
      "Tom, semitom, semitom.",
      "Tom, tom, tom.",
      "Semitom, semitom, semitom.",
      "Nenhuma das demais opções.",
      "Tom, tom, semitom.",
      "Semitom, semitom, tom.",
      "Semitom, tom, tom.",
    ],
    correct: 2,
  },
  {
    options: [
      "Tom, semitom, semitom.",
      "Tom, tom, semitom.",
      "Tom, tom, tom.",
      "Semitom, semitom, semitom.",
      "Semitom, semitom, tom.",
      "Semitom, tom, tom.",
      "Nenhuma das demais opções.",
    ],
    correct: 1,
  },
  {
    options: [
      "Tom, semitom, semitom.",
      "Semitom, semitom, tom.",
      "Tom, tom, tom.",
      "Semitom, semitom, semitom.",
      "Tom, tom, semitom.",
      "Semitom, tom, tom.",
      "Nenhuma das demais opções.",
    ],
    correct: 2,
  },
  {
    options: [
      "Tom, tom, tom.",
      "Semitom, semitom, tom.",
      "Semitom, semitom, semitom.",
      "Nenhuma das demais opções.",
      "Tom, tom, semitom.",
      "Semitom, tom, tom.",
    ],
    correct: 3,
  },
  {
    options: [
      "Tom, semitom, semitom.",
      "Semitom, semitom, semitom.",
      "Semitom, semitom, tom.",
      "Tom, semitom, tom.",
      "Tom, tom, semitom.",
      "Semitom, tom, tom.",
      "Nenhuma das demais opções.",
    ],
    correct: 3,
  },
  {
    options: [
      "Semitom, semitom, semitom.",
      "Tom, tom, tom.",
      "Semitom, tom, tom.",
      "Tom, semitom, semitom.",
      "Nenhuma das demais opções.",
      "Tom, semitom, tom.",
      "Semitom, semitom, tom.",
    ],
    correct: 5,
  },
  {
    options: [
      "Semitom, tom, tom.",
      "Semitom, semitom, semitom.",
      "Tom, tom, tom.",
      "Tom, tom, semitom.",
      "Tom, semitom, semitom.",
      "Nenhuma das demais opções.",
      "Tom, semitom, tom.",
    ],
    correct: 6,
  },
  {
    options: [
      "Semitom, semitom, tom.",
      "Tom, tom, tom.",
      "Semitom, semitom, semitom.",
      "Nenhuma das demais opções.",
      "Tom, semitom, semitom.",
      "Tom, tom, semitom.",
      "Semitom, tom, tom.",
    ],
    correct: 6,
  },
  {
    options: [
      "Semitom, semitom, semitom.",
      "Tom, tom, tom.",
      "Tom, semitom, semitom.",
      "Tom, tom, semitom.",
      "Semitom, tom, tom.",
      "Semitom, semitom, tom.",
      "Nenhuma das demais opções.",
    ],
    correct: 4,
  },
];

const questions: QuizQuestion[] = data.map((q, i) => {
  const n = i + 1;
  return {
    prompt: PROMPT,
    image: {
      src: `/images/quiz/estrutura-escalas-tetracordes/q${String(n).padStart(2, "0")}.png`,
      alt: `Escala de 4 notas no pentagrama – questão ${n}`,
    },
    options: q.options,
    correct: q.correct,
  };
});

export default function QuizEstruturaEscalasTetracordesPage() {
  return (
    <main className="flex min-h-dvh items-start justify-center bg-cream/40 p-3 sm:p-4">
      <QuizPlayer
        title="Quiz – Estrutura de escalas de 4 notas (tetracordes)"
        questions={questions}
      />
    </main>
  );
}
