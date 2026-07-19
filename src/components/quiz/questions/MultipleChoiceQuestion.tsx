"use client";

import type { MultipleChoiceQuestion } from "@/lib/quiz-types";
import { MediaContent, type QuestionModule } from "../shared";

const sameSet = (a: number[], b: number[]) =>
  a.length === b.length && [...a].sort().join() === [...b].sort().join();

function Body({
  question,
  answer,
  onChange,
  verified,
}: {
  question: MultipleChoiceQuestion;
  answer: number[] | null;
  onChange: (answer: number[]) => void;
  verified: boolean;
}) {
  const selected = answer ?? [];
  const toggle = (i: number) =>
    onChange(
      selected.includes(i)
        ? selected.filter((x) => x !== i)
        : [...selected, i],
    );

  const optionClass = (i: number): string => {
    const base =
      "flex w-full items-center gap-3 rounded-lg border px-4 py-2.5 text-left transition-colors";
    const isSel = selected.includes(i);
    const isCorrect = question.correct.includes(i);
    if (!verified) {
      return isSel
        ? `${base} border-primary ring-1 ring-primary`
        : `${base} border-gray-200 hoverable:border-gray-400`;
    }
    if (isCorrect)
      return `${base} border-green-500 bg-green-500 font-semibold text-white`;
    if (isSel)
      return `${base} border-red-600 bg-red-600 font-semibold text-white`;
    return `${base} border-gray-200 opacity-70`;
  };

  const boxClass = (i: number): string => {
    const base =
      "inline-block h-4 w-4 shrink-0 rounded border-2 transition-colors";
    const isSel = selected.includes(i);
    if (verified && (question.correct.includes(i) || isSel))
      return `${base} border-white ${isSel ? "bg-white" : "bg-transparent"}`;
    return isSel
      ? `${base} border-primary bg-primary`
      : `${base} border-gray-300 bg-white`;
  };

  return (
    <div className="mt-3 space-y-2" role="group" aria-label={question.prompt ?? "Alternativas"}>
      <p className="text-sm text-charcoal/70">Selecione todas as corretas:</p>
      {question.options.map((option, i) => (
        <button
          key={i}
          type="button"
          role="checkbox"
          aria-checked={selected.includes(i)}
          disabled={verified}
          onClick={() => toggle(i)}
          className={optionClass(i)}
        >
          <span className={boxClass(i)} />
          <MediaContent media={option} />
        </button>
      ))}
    </div>
  );
}

export const multipleChoiceModule: QuestionModule<
  MultipleChoiceQuestion,
  number[]
> = {
  initialAnswer: null,
  isComplete: (answer) => (answer?.length ?? 0) > 0,
  grade: (question, answer) =>
    sameSet(answer, question.correct) ? "correct" : "incorrect",
  Body,
};
