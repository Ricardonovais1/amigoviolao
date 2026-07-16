"use client";

import { useState } from "react";

export type QuizQuestion = {
  prompt: string;
  options: string[];
  /** Índice da alternativa correta em `options`. */
  correct: number;
};

type Verdict = "correct" | "incorrect";

type QuestionState = {
  selected: number | null;
  verdict: Verdict | null;
  review: boolean;
};

const freshStates = (count: number): QuestionState[] =>
  Array.from({ length: count }, () => ({
    selected: null,
    verdict: null,
    review: false,
  }));

const legend = [
  { className: "border border-gray-400 bg-white", label: "Atual" },
  { className: "bg-amber-400", label: "Revisar / Pulada" },
  { className: "bg-rose-400", label: "Respondida" },
  { className: "bg-green-500", label: "Correto" },
  { className: "bg-red-600", label: "Incorreto" },
];

export default function QuizPlayer({
  title,
  questions,
}: {
  title: string;
  questions: QuizQuestion[];
}) {
  const [states, setStates] = useState<QuestionState[]>(() =>
    freshStates(questions.length),
  );
  const [current, setCurrent] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  const total = questions.length;
  const question = questions[current];
  const state = states[current];
  const verified = state.verdict !== null;
  const isLast = current === total - 1;
  const score = states.filter((s) => s.verdict === "correct").length;
  const answered = states.filter((s) => s.verdict !== null).length;

  const patch = (index: number, partial: Partial<QuestionState>) =>
    setStates((prev) =>
      prev.map((s, i) => (i === index ? { ...s, ...partial } : s)),
    );

  const goTo = (index: number) => {
    setCurrent(index);
    setShowSummary(false);
  };

  const verify = () => {
    if (state.selected === null || verified) return;
    patch(current, {
      verdict: state.selected === question.correct ? "correct" : "incorrect",
      review: false,
    });
  };

  const next = () => {
    if (isLast) setShowSummary(true);
    else goTo(current + 1);
  };

  const skip = () => {
    if (!verified) patch(current, { review: true });
    next();
  };

  const restart = () => {
    setStates(freshStates(total));
    setCurrent(0);
    setShowSummary(false);
  };

  const navColor = (i: number): string => {
    const s = states[i];
    if (i === current && !showSummary)
      return "border-blue-600 bg-blue-600 text-white";
    if (s.verdict === "correct")
      return "border-green-500 bg-green-500 text-white";
    if (s.verdict === "incorrect") return "border-red-600 bg-red-600 text-white";
    if (s.review) return "border-amber-400 bg-amber-400 text-white";
    if (s.selected !== null) return "border-rose-400 bg-rose-400 text-white";
    return "border-gray-300 bg-white text-dark hover:border-gray-500";
  };

  const optionClass = (i: number): string => {
    const base =
      "flex w-full items-center gap-4 rounded-lg border px-5 py-4 text-left transition-colors";
    if (!verified) {
      return i === state.selected
        ? `${base} border-blue-600 ring-1 ring-blue-600`
        : `${base} border-gray-200 hover:border-gray-400`;
    }
    if (i === question.correct)
      return `${base} border-green-500 bg-green-500 font-semibold text-white`;
    if (i === state.selected)
      return `${base} border-red-600 bg-red-600 font-semibold text-white`;
    return `${base} border-gray-200 opacity-70`;
  };

  const radioClass = (i: number): string => {
    const base =
      "inline-block h-4 w-4 shrink-0 rounded-full border-2 transition-colors";
    if (verified && (i === question.correct || i === state.selected))
      return `${base} border-white ${i === state.selected ? "bg-white" : "bg-transparent"}`;
    return i === state.selected
      ? `${base} border-blue-600 bg-blue-600`
      : `${base} border-gray-300 bg-white`;
  };

  const pill =
    "rounded-full bg-blue-600 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40";

  const navGrid = (
    <>
      <div className="mt-6 rounded-md border border-gray-200 bg-gray-50 p-2">
        <div className="flex flex-wrap gap-1.5">
          {questions.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Ir para a questão ${i + 1}`}
              className={`h-8 w-8 rounded border text-sm font-bold transition-colors ${navColor(i)}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-charcoal">
        {legend.map((item) => (
          <span key={item.label} className="inline-flex items-center gap-1.5">
            <span className={`inline-block h-3.5 w-3.5 ${item.className}`} />
            {item.label}
          </span>
        ))}
      </div>
    </>
  );

  if (showSummary) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-3xl font-extrabold text-dark">{title}</h1>
        {navGrid}

        <h2 className="mt-8 text-xl font-bold text-dark">Resumo do quiz</h2>
        <p className="mt-2 text-charcoal">
          Você acertou <strong className="text-dark">{score}</strong> de{" "}
          <strong className="text-dark">{total}</strong> questões (
          {score} ponto(s)).
          {answered < total && (
            <> Ainda faltam {total - answered} questão(ões) para verificar.</>
          )}
        </p>

        <ul className="mt-6 space-y-2">
          {questions.map((q, i) => {
            const s = states[i];
            const label =
              s.verdict === "correct"
                ? "Correto"
                : s.verdict === "incorrect"
                  ? "Incorreto"
                  : s.review
                    ? "Pulada"
                    : "Sem resposta";
            const labelColor =
              s.verdict === "correct"
                ? "text-green-600"
                : s.verdict === "incorrect"
                  ? "text-red-600"
                  : "text-amber-500";
            return (
              <li
                key={i}
                className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 px-4 py-3"
              >
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  className="text-left text-charcoal hover:text-dark"
                >
                  <strong className="text-dark">{i + 1}.</strong> {q.prompt}
                </button>
                <span className={`shrink-0 text-sm font-bold ${labelColor}`}>
                  {label}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" onClick={restart} className={pill}>
            Refazer quiz
          </button>
          {answered < total && (
            <button
              type="button"
              onClick={() => goTo(states.findIndex((s) => s.verdict === null))}
              className={pill}
            >
              Continuar respondendo
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-extrabold text-dark">{title}</h1>
      {navGrid}

      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => patch(current, { review: !state.review })}
          disabled={verified}
          className={pill}
        >
          Revisar questão
        </button>
        <button
          type="button"
          onClick={() => setShowSummary(true)}
          className={pill}
        >
          Resumo do quiz
        </button>
      </div>

      <hr className="mt-6 border-gray-200" />

      <p className="mt-6 text-charcoal">
        Questão <strong className="text-dark">{current + 1}</strong> de{" "}
        <strong className="text-dark">{total}</strong>
      </p>

      <div className="mt-4 flex items-center justify-between">
        <h2 className="font-bold text-dark">{current + 1}. Questão</h2>
        <span className="text-sm font-bold text-dark">1 ponto(s)</span>
      </div>

      <p className="mt-4 text-charcoal">{question.prompt}</p>

      <div className="mt-4 space-y-3" role="radiogroup" aria-label={question.prompt}>
        {question.options.map((option, i) => (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={state.selected === i}
            disabled={verified}
            onClick={() => patch(current, { selected: i })}
            className={optionClass(i)}
          >
            <span className={radioClass(i)} />
            {option}
          </button>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        {!verified ? (
          <>
            <button type="button" onClick={skip} className={pill}>
              Pular questão
            </button>
            <button
              type="button"
              onClick={verify}
              disabled={state.selected === null}
              className={pill}
            >
              Verificar
            </button>
          </>
        ) : (
          <>
            <span />
            <button type="button" onClick={next} className={pill}>
              {isLast ? "Resumo do quiz" : "Próximo"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
