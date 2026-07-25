"use client";

import { useMemo, useState } from "react";
import type { MatchingQuestion } from "@/lib/quiz-types";
import { MediaContent, type QuestionModule } from "../shared";

type Pair = [number, number]; // [leftIndex, rightIndex]

function shuffledIndices(n: number): number[] {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const sameSet = (a: Pair[], b: Pair[]): boolean => {
  if (a.length !== b.length) return false;
  const key = (p: Pair) => `${p[0]}-${p[1]}`;
  const as = new Set(a.map(key));
  return b.every((p) => as.has(key(p)));
};

function Body({
  question,
  answer,
  onChange,
  verified,
}: {
  question: MatchingQuestion;
  answer: Pair[] | null;
  onChange: (answer: Pair[]) => void;
  verified: boolean;
}) {
  const pairs = answer ?? [];
  const [activeLeft, setActiveLeft] = useState<number | null>(null);

  // Embaralha a posição visual de cada coluna uma vez por questão (não a
  // cada clique) — o pareamento em si trabalha sempre com os índices reais.
  const leftOrder = useMemo(
    () => shuffledIndices(question.left.length),
    [question],
  );
  const rightOrder = useMemo(
    () => shuffledIndices(question.right.length),
    [question],
  );

  const rightOf = (l: number) => pairs.find((p) => p[0] === l)?.[1] ?? null;
  const leftOf = (r: number) => pairs.find((p) => p[1] === r)?.[0] ?? null;
  const correctRightOf = (l: number) =>
    question.pairs.find((p) => p[0] === l)?.[1] ?? null;

  const clickLeft = (l: number) => {
    if (verified) return;
    if (rightOf(l) !== null) {
      onChange(pairs.filter((p) => p[0] !== l));
      setActiveLeft(null);
      return;
    }
    setActiveLeft((cur) => (cur === l ? null : l));
  };

  const clickRight = (r: number) => {
    if (verified) return;
    const pairedLeft = leftOf(r);
    if (pairedLeft !== null) {
      onChange(pairs.filter((p) => p[1] !== r));
      setActiveLeft(null);
      return;
    }
    if (activeLeft === null) return;
    onChange([...pairs.filter((p) => p[0] !== activeLeft), [activeLeft, r]]);
    setActiveLeft(null);
  };

  const tileClass = (opts: {
    active: boolean;
    assigned: boolean;
    correct: boolean;
  }): string => {
    const base =
      "flex w-full items-center justify-center rounded-lg border-2 p-2 transition-colors";
    if (verified) {
      if (!opts.assigned) return `${base} border-gray-200 opacity-60`;
      return opts.correct
        ? `${base} border-green-500 bg-green-50`
        : `${base} border-red-600 bg-red-50`;
    }
    if (opts.active) return `${base} border-primary ring-2 ring-primary/30`;
    if (opts.assigned) return `${base} border-teal bg-teal/10`;
    return `${base} border-gray-200 hoverable:border-gray-400`;
  };

  return (
    <div className="mt-3">
      <p className="text-sm text-charcoal/70">
        Toque num item de cada coluna para ligar o par correspondente.
      </p>
      <div className="mt-2 grid grid-cols-2 gap-3">
        <div className="space-y-2">
          {leftOrder.map((l) => {
            const assigned = rightOf(l) !== null;
            return (
              <button
                key={l}
                type="button"
                disabled={verified}
                onClick={() => clickLeft(l)}
                aria-pressed={activeLeft === l}
                className={tileClass({
                  active: activeLeft === l,
                  assigned,
                  correct: rightOf(l) === correctRightOf(l),
                })}
              >
                <MediaContent media={question.left[l]} />
              </button>
            );
          })}
        </div>
        <div className="space-y-2">
          {rightOrder.map((r) => {
            const pairedLeft = leftOf(r);
            const assigned = pairedLeft !== null;
            return (
              <button
                key={r}
                type="button"
                disabled={verified}
                onClick={() => clickRight(r)}
                className={tileClass({
                  active: false,
                  assigned,
                  correct: pairedLeft !== null && correctRightOf(pairedLeft) === r,
                })}
              >
                <MediaContent media={question.right[r]} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export const matchingModule: QuestionModule<MatchingQuestion, Pair[]> = {
  initialAnswer: [],
  isComplete: (answer, question) =>
    question.left.length > 0 && (answer?.length ?? 0) === question.left.length,
  grade: (question, answer) =>
    sameSet(answer ?? [], question.pairs) ? "correct" : "incorrect",
  Body,
};
