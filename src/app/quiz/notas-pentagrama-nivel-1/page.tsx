import type { Metadata } from "next";
import QuizPlayer, { type QuizQuestion } from "@/components/quiz/QuizPlayer";

export const metadata: Metadata = {
  title: "Quiz – Notas no pentagrama nível 1 - Amigo Violão",
  description:
    "Quiz interativo de leitura de notas no pentagrama (nível 1), do curso Teoria Musical para Violonistas.",
  // Página feita para ser incorporada via iFrame no Hotmart — fora do índice de busca.
  robots: { index: false },
};

const NOTES = ["Dó", "Ré", "Mi", "Fá", "Sol", "Lá", "Si"];

// Gabarito por questão (a nota correta). "Não sei" nunca é resposta — é só a
// alternativa de escape, fixada no fim de cada questão.
const ANSWERS = [
  "Ré", "Si", "Fá", "Dó", "Si", "Sol", "Mi", "Fá", "Sol", "Lá",
  "Sol", "Fá", "Fá", "Mi", "Dó", "Fá", "Mi", "Lá", "Ré", "Dó",
  "Fá", "Ré", "Mi", "Lá", "Mi", "Ré", "Mi",
];

// PRNG determinístico (mulberry32): embaralha as notas de forma estável por
// questão, então a posição da resposta varia mas o build é reprodutível.
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  const rand = mulberry32(seed);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const questions: QuizQuestion[] = ANSWERS.map((answer, i) => {
  const n = i + 1;
  const options = [...shuffle(NOTES, Math.imul(n, 2654435761)), "Não sei"];
  return {
    prompt: "Qual é o nome desta nota?",
    image: {
      src: `/images/quiz/notas-pentagrama-nivel-1/q${String(n).padStart(2, "0")}.png`,
      alt: `Nota no pentagrama – questão ${n}`,
    },
    options,
    correct: options.indexOf(answer),
  };
});

export default function QuizNotasPentagramaNivel1Page() {
  return (
    <main className="flex min-h-dvh items-start justify-center bg-cream/40 p-3 sm:p-4">
      <QuizPlayer
        title="Quiz – Notas no pentagrama nível 1"
        questions={questions}
      />
    </main>
  );
}
