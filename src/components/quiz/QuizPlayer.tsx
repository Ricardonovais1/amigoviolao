"use client";

import { useState, type ReactNode } from "react";

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

const pill =
  "rounded-full bg-primary px-5 py-2 text-sm font-bold text-white transition-colors hoverable:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40";
const pillGhost =
  "rounded-full border border-gray-300 bg-white px-5 py-2 text-sm font-bold text-charcoal transition-colors hoverable:border-gray-400 hoverable:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40";

/**
 * Moldura visual do quiz: cartão branco com cabeçalho da marca e barra de
 * progresso. O cartão cresce até a altura natural do conteúdo (sem rolagem
 * interna), então basta o iframe ter altura suficiente para mostrar todas as
 * opções de uma vez — como na visualização direta.
 */
function Frame({
  title,
  answered,
  total,
  children,
}: {
  title: string;
  answered: number;
  total: number;
  children: ReactNode;
}) {
  const pct = total ? Math.round((answered / total) * 100) : 0;
  return (
    <div className="flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5">
      <header className="bg-primary px-5 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-base font-extrabold leading-tight text-white sm:text-lg">
            {title}
          </h1>
          <span className="shrink-0 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white">
            {answered}/{total}
          </span>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/25">
          <div
            className="h-full rounded-full bg-white transition-[width] duration-300 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </header>
      <div className="flex flex-col px-5 py-4 sm:px-6">{children}</div>
    </div>
  );
}

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
      return "border-primary bg-primary text-white";
    if (s.verdict === "correct")
      return "border-green-500 bg-green-500 text-white";
    if (s.verdict === "incorrect") return "border-red-600 bg-red-600 text-white";
    if (s.review) return "border-amber-400 bg-amber-400 text-white";
    if (s.selected !== null) return "border-rose-400 bg-rose-400 text-white";
    return "border-gray-300 bg-white text-dark hoverable:border-gray-500";
  };

  const optionClass = (i: number): string => {
    const base =
      "flex w-full items-center gap-3 rounded-lg border px-4 py-2.5 text-left transition-colors";
    if (!verified) {
      return i === state.selected
        ? `${base} border-primary ring-1 ring-primary`
        : `${base} border-gray-200 hoverable:border-gray-400`;
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
      ? `${base} border-primary bg-primary`
      : `${base} border-gray-300 bg-white`;
  };

  const navGrid = (
    <>
      <div className="rounded-md border border-gray-200 bg-gray-50 p-1.5">
        <div className="flex flex-wrap gap-1">
          {questions.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Ir para a questão ${i + 1}`}
              className={`h-7 w-7 rounded border text-xs font-bold transition-colors ${navColor(i)}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-charcoal">
        {legend.map((item) => (
          <span key={item.label} className="inline-flex items-center gap-1">
            <span className={`inline-block h-3 w-3 rounded-sm ${item.className}`} />
            {item.label}
          </span>
        ))}
      </div>
    </>
  );

  if (showSummary) {
    return (
      <Frame title={title} answered={answered} total={total}>
        {navGrid}

        <h2 className="mt-4 text-lg font-bold text-dark">Resumo do quiz</h2>
        <p className="mt-1 text-charcoal">
          Você acertou <strong className="text-primary">{score}</strong> de{" "}
          <strong className="text-dark">{total}</strong> questões (
          {score} ponto(s)).
          {answered < total && (
            <> Ainda faltam {total - answered} questão(ões) para verificar.</>
          )}
        </p>

        <ul className="mt-3 space-y-2">
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
                className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 px-4 py-2"
              >
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  className="text-left text-charcoal hoverable:text-dark"
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

        <div className="mt-3 flex flex-wrap gap-3 pt-1">
          <button type="button" onClick={restart} className={pill}>
            Refazer quiz
          </button>
          {answered < total && (
            <button
              type="button"
              onClick={() => goTo(states.findIndex((s) => s.verdict === null))}
              className={pillGhost}
            >
              Continuar respondendo
            </button>
          )}
        </div>
      </Frame>
    );
  }

  return (
    <Frame title={title} answered={answered} total={total}>
      {navGrid}

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => patch(current, { review: !state.review })}
          disabled={verified}
          className={pillGhost}
        >
          Revisar questão
        </button>
        <button
          type="button"
          onClick={() => setShowSummary(true)}
          className={pillGhost}
        >
          Resumo do quiz
        </button>
      </div>

      <hr className="mt-3 border-gray-200" />

      <div className="mt-3 flex items-center justify-between">
        <h2 className="font-bold text-dark">
          Questão {current + 1} de {total}
        </h2>
        <span className="rounded-full bg-teal/10 px-2.5 py-0.5 text-xs font-bold text-teal">
          1 ponto
        </span>
      </div>

      <p className="mt-2 font-semibold text-dark">{question.prompt}</p>

      <div
        className="mt-3 space-y-2"
        role="radiogroup"
        aria-label={question.prompt}
      >
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

      <div className="mt-3 flex items-center justify-between gap-2 pt-1">
        {!verified ? (
          <>
            <button type="button" onClick={skip} className={pillGhost}>
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
    </Frame>
  );
}
