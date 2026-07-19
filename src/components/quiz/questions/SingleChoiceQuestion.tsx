"use client";

import type { SingleChoiceQuestion } from "@/lib/quiz-types";
import { MediaContent, type QuestionModule } from "../shared";

function Body({
  question,
  answer,
  onChange,
  verified,
}: {
  question: SingleChoiceQuestion;
  answer: number | null;
  onChange: (answer: number) => void;
  verified: boolean;
}) {
  const optionClass = (i: number): string => {
    const base =
      "flex w-full items-center gap-3 rounded-lg border px-4 py-2.5 text-left transition-colors";
    if (!verified) {
      return i === answer
        ? `${base} border-primary ring-1 ring-primary`
        : `${base} border-gray-200 hoverable:border-gray-400`;
    }
    if (i === question.correct)
      return `${base} border-green-500 bg-green-500 font-semibold text-white`;
    if (i === answer)
      return `${base} border-red-600 bg-red-600 font-semibold text-white`;
    return `${base} border-gray-200 opacity-70`;
  };

  const radioClass = (i: number): string => {
    const base =
      "inline-block h-4 w-4 shrink-0 rounded-full border-2 transition-colors";
    if (verified && (i === question.correct || i === answer))
      return `${base} border-white ${i === answer ? "bg-white" : "bg-transparent"}`;
    return i === answer
      ? `${base} border-primary bg-primary`
      : `${base} border-gray-300 bg-white`;
  };

  return (
    <div
      className="mt-3 space-y-2"
      role="radiogroup"
      aria-label={question.prompt ?? "Alternativas"}
    >
      {question.options.map((option, i) => (
        <button
          key={i}
          type="button"
          role="radio"
          aria-checked={answer === i}
          disabled={verified}
          onClick={() => onChange(i)}
          className={optionClass(i)}
        >
          <span className={radioClass(i)} />
          <MediaContent media={option} />
        </button>
      ))}
    </div>
  );
}

export const singleChoiceModule: QuestionModule<SingleChoiceQuestion, number> = {
  initialAnswer: null,
  isComplete: (answer) => answer !== null,
  grade: (question, answer) =>
    answer === question.correct ? "correct" : "incorrect",
  Body,
};
