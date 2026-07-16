import type { Metadata } from "next";
import QuizPlayer, { type QuizQuestion } from "@/components/quiz/QuizPlayer";

export const metadata: Metadata = {
  title: "Quiz – Automatismo – Grau Conjunto - Amigo Violão",
  description:
    "Quiz interativo de automatismo das notas musicais por grau conjunto, do curso Teoria Musical para Violonistas.",
  // Página feita para ser incorporada via iFrame no Hotmart — fora do índice de busca.
  robots: { index: false },
};

const questions: QuizQuestion[] = [
  {
    prompt: "Nota abaixo do Mi:",
    options: ["Sol", "Mi", "Ré", "Fá", "Si", "Dó", "Lá"],
    correct: 2,
  },
  {
    prompt: "Nota abaixo do Dó:",
    options: ["Mi", "Ré", "Fá", "Sol", "Lá", "Si", "Dó"],
    correct: 5,
  },
  {
    prompt: "Nota acima do Mi:",
    options: ["Ré", "Fá", "Mi", "Sol", "Lá", "Si", "Dó"],
    correct: 1,
  },
  {
    prompt: "Nota abaixo do Ré:",
    options: ["Mi", "Ré", "Sol", "Lá", "Fá", "Dó", "Si"],
    correct: 5,
  },
  {
    prompt: "Nota acima do Ré:",
    options: ["Mi", "Sol", "Lá", "Si", "Fá", "Dó", "Ré"],
    correct: 0,
  },
  {
    prompt: "Nota abaixo do Fá:",
    options: ["Sol", "Ré", "Lá", "Fá", "Si", "Mi", "Dó"],
    correct: 5,
  },
  {
    prompt: "Nota acima do Dó:",
    options: ["Fá", "Mi", "Ré", "Lá", "Sol", "Si", "Dó"],
    correct: 2,
  },
  {
    prompt: "Nota acima do Fá:",
    options: ["Ré", "Mi", "Fá", "Si", "Lá", "Sol", "Dó"],
    correct: 5,
  },
  {
    prompt: "Nota abaixo do Sol:",
    options: ["Lá", "Ré", "Mi", "Fá", "Dó", "Si", "Sol"],
    correct: 3,
  },
  {
    prompt: "Nota abaixo do Lá:",
    options: ["Mi", "Ré", "Fá", "Lá", "Si", "Sol", "Dó"],
    correct: 5,
  },
  {
    prompt: "Nota acima do Lá:",
    options: ["Mi", "Dó", "Sol", "Fá", "Ré", "Lá", "Si"],
    correct: 6,
  },
  {
    prompt: "Nota 1/2 tom acima do Fá:",
    options: ["Mi", "Lá#", "Mi#", "Fá#", "Sol"],
    correct: 3,
  },
  {
    prompt: "Nota acima do Sol:",
    options: ["Ré", "Mi", "Lá", "Fá", "Sol", "Dó", "Si"],
    correct: 2,
  },
  {
    prompt: "Nota meio tom abaixo do Dó:",
    options: ["Dó#", "Réb", "Lá#", "Si", "Si#"],
    correct: 3,
  },
  {
    prompt: "Nota 1 tom abaixo do Ré#:",
    options: ["Dó#", "Mi#", "Ré", "Mi", "Fá"],
    correct: 0,
  },
  {
    prompt: "Nota acima do Si:",
    options: ["Mi", "Ré", "Fá", "Sol", "Si", "Lá", "Dó"],
    correct: 6,
  },
  {
    prompt: "Nota 1 tom acima do Lá:",
    options: ["Si", "Sol#", "Sol", "Dó", "Lá#"],
    correct: 0,
  },
  {
    prompt: "Nota 1/2 tom acima do Si:",
    options: ["Sib", "Lá", "Lá#", "Dó#", "Dó"],
    correct: 4,
  },
];

export default function QuizAutomatismoGrauConjuntoPage() {
  return (
    <main className="min-h-screen bg-white">
      <QuizPlayer
        title="Quiz – Automatismo – Grau Conjunto"
        questions={questions}
      />
    </main>
  );
}
