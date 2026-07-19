// Modelo extensível de quizzes. A união é discriminada por `type` e cobre os 8
// formatos do LearnDash. A opção/item é polimórfica (`Media`): texto, imagem ou
// áudio servem a qualquer tipo, no enunciado ou nas alternativas.
//
// Fase 1: apenas `single-choice` e `multiple-choice` têm renderer implementado
// (ver src/components/quiz/registry.ts). Os demais já existem no schema para o
// modelo nascer à prova dos tipos futuros:
//   - ordering / matching / fill-blank / free-text  -> renderer na Fase 2
//   - essay (correção manual) / survey (coleta)      -> dependem do backend (Fase 3)

export type Media =
  | { kind: "text"; label: string }
  | { kind: "image"; src: string; alt: string }
  | { kind: "audio"; src: string; label?: string };

/** Como a questão é pontuada: automática, manual (professor) ou nenhuma (pesquisa). */
export type Grading = "auto" | "manual" | "none";

type BaseQuestion = {
  prompt?: string;
  /** Mídia do enunciado (pentagrama, áudio para tocar de ouvido, etc.). */
  media?: Media[];
  explanation?: string;
};

export type SingleChoiceQuestion = BaseQuestion & {
  type: "single-choice";
  grading: "auto";
  options: Media[];
  correct: number;
};

export type MultipleChoiceQuestion = BaseQuestion & {
  type: "multiple-choice";
  grading: "auto";
  options: Media[];
  correct: number[];
};

// --- Tipos previstos no schema; renderers nas fases seguintes ---

export type OrderingQuestion = BaseQuestion & {
  type: "ordering";
  grading: "auto";
  items: Media[];
  correctOrder: number[];
};

export type MatchingQuestion = BaseQuestion & {
  type: "matching";
  grading: "auto";
  left: Media[];
  right: Media[];
  pairs: [number, number][];
};

export type FillBlankQuestion = BaseQuestion & {
  type: "fill-blank";
  grading: "auto";
  /** Texto quebrado em trechos; entre cada par de trechos vai uma lacuna. */
  segments: string[];
  blanks: { accepts: string[] }[];
};

export type FreeTextQuestion = BaseQuestion & {
  type: "free-text";
  grading: "auto";
  accepts: string[];
  matchMode: "exact" | "loose";
};

export type EssayQuestion = BaseQuestion & {
  type: "essay";
  grading: "manual";
};

export type SurveyQuestion = BaseQuestion & {
  type: "survey";
  grading: "none";
  scale: Media[];
};

export type Question =
  | SingleChoiceQuestion
  | MultipleChoiceQuestion
  | OrderingQuestion
  | MatchingQuestion
  | FillBlankQuestion
  | FreeTextQuestion
  | EssayQuestion
  | SurveyQuestion;

export type QuizMeta = {
  slug: string;
  title: string;
  description: string;
  category?: string;
  /** Altura sugerida do iframe de incorporação (px). */
  embedHeight?: number;
  questionCount: number;
};

export type Quiz = QuizMeta & { questions: Question[] };
