import type { ComponentType } from "react";
import type { Media, Question } from "@/lib/quiz-types";

/** Verdito de uma questão. Fase 1 usa só correct/incorrect (tipos `auto`). */
export type Verdict = "correct" | "incorrect" | "pending" | "recorded";

/**
 * Contrato de um tipo de questão. A casca (QuizPlayer) é agnóstica ao tipo e
 * despacha para o módulo certo via registro. Adicionar um tipo = novo módulo.
 */
export type QuestionModule<Q extends Question = Question, A = unknown> = {
  /** Estado inicial da resposta para uma questão nova. */
  initialAnswer: A | null;
  /** A resposta está completa a ponto de habilitar "Verificar"? */
  isComplete: (answer: A | null) => boolean;
  /** Correção automática. Ausente em tipos `manual`/`none`. */
  grade?: (question: Q, answer: A) => Verdict;
  /** Corpo interativo da questão (as alternativas, os itens, etc.). */
  Body: ComponentType<{
    question: Q;
    answer: A | null;
    onChange: (answer: A) => void;
    verified: boolean;
  }>;
};

/** Renderiza o conteúdo de uma opção/mídia (texto, imagem ou áudio). */
export function MediaContent({ media }: { media: Media }) {
  if (media.kind === "image") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={media.src}
        alt={media.alt}
        className="max-h-24 w-auto rounded-md bg-white object-contain"
      />
    );
  }
  if (media.kind === "audio") {
    return (
      <span className="inline-flex items-center gap-2">
        <audio controls preload="none" src={media.src} className="h-8" />
        {media.label && <span>{media.label}</span>}
      </span>
    );
  }
  return <>{media.label}</>;
}

/** Mídia do enunciado (imagens/áudios acima das alternativas). */
export function PromptMedia({ media }: { media?: Media[] }) {
  if (!media || media.length === 0) return null;
  return (
    <div className="mt-3 flex flex-col items-center gap-3">
      {media.map((m, i) =>
        m.kind === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={m.src}
            alt={m.alt}
            className="max-h-44 w-auto rounded-lg border border-gray-200 bg-white p-3"
          />
        ) : m.kind === "audio" ? (
          <audio key={i} controls preload="none" src={m.src} className="w-full max-w-sm" />
        ) : (
          <p key={i} className="text-charcoal">
            {m.label}
          </p>
        ),
      )}
    </div>
  );
}
