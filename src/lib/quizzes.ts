import fs from "node:fs";
import path from "node:path";
import type {
  Media,
  Question,
  Quiz,
  QuizMeta,
  SingleChoiceQuestion,
  MultipleChoiceQuestion,
  MatchingQuestion,
} from "./quiz-types";

// Camada de dados dos quizzes, no mesmo padrão Jamstack do blog: os quizzes são
// arquivos JSON em content/quizzes/*.json, lidos e validados no build. Sem banco
// em tempo de execução. A validação falha o build (com mensagem clara) se um
// gabarito apontar para uma opção inexistente ou uma imagem sumir.

const QUIZ_DIR = path.join(process.cwd(), "content", "quizzes");
const PUBLIC_DIR = path.join(process.cwd(), "public");

type RawQuestion = {
  type?: "single-choice" | "multiple-choice" | "matching";
  prompt?: string;
  image?: string;
  audio?: string;
  options?: string[];
  /** Opções em forma de imagem (arquivos em public/images/quiz/<slug>/), no lugar de "options" textuais. */
  imageOptions?: string[];
  answer?: string;
  correct?: number;
  answers?: string[];
  corrects?: number[];
  /** Coluna A (matching): arquivos de imagem em public/images/quiz/<slug>/. */
  left?: string[];
  /** Coluna B (matching): arquivos de imagem em public/images/quiz/<slug>/. */
  right?: string[];
  /** Pares corretos [índice em left, índice em right]. Default: correspondência 1:1 por posição. */
  pairs?: [number, number][];
  explanation?: string;
};

type RawQuiz = {
  slug: string;
  title: string;
  description: string;
  category?: string;
  embedHeight?: number;
  order?: number;
  prompt?: string;
  imageAltPrefix?: string;
  optionPool?: string[];
  shuffleOptions?: boolean;
  shuffleQuestions?: boolean;
  pinLast?: string[];
  questions: RawQuestion[];
};

// PRNG determinístico (mulberry32) — idêntico ao usado antes na página de notas,
// para o embaralhamento sair igual ao que já está publicado.
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

const text = (label: string): Media => ({ kind: "text", label });

/** Resolve um único arquivo em public/images/quiz/<slug>/<filename>, validando que existe. */
function resolveImageFile(
  filename: string,
  quiz: RawQuiz,
  n: number,
  alt: string,
  context: string,
): Media {
  const src = `/images/quiz/${quiz.slug}/${filename}`;
  const abs = path.join(PUBLIC_DIR, src.replace(/^\//, ""));
  if (!fs.existsSync(abs)) {
    throw new Error(
      `Quiz "${quiz.slug}" questão ${n} (${context}): imagem não encontrada em public${src}`,
    );
  }
  return { kind: "image", src, alt };
}

function resolveImage(
  raw: RawQuestion,
  quiz: RawQuiz,
  n: number,
): Media[] | undefined {
  if (!raw.image) return undefined;
  const prefix = quiz.imageAltPrefix ?? "Ilustração";
  return [
    resolveImageFile(raw.image, quiz, n, `${prefix} – questão ${n}`, "enunciado"),
  ];
}

/** Monta as opções de uma questão como imagens (sem rótulo "Opção x" visível). */
function resolveImageOptions(
  raw: RawQuestion,
  quiz: RawQuiz,
  n: number,
): Media[] | undefined {
  if (!raw.imageOptions) return undefined;
  return raw.imageOptions.map((filename, i) =>
    resolveImageFile(
      filename,
      quiz,
      n,
      `Opção ${i + 1} – questão ${n}`,
      `opção ${i + 1}`,
    ),
  );
}

function resolveAudio(
  raw: RawQuestion,
  quiz: RawQuiz,
  n: number,
): Media[] | undefined {
  if (!raw.audio) return undefined;
  const src = `/audio/quiz/${quiz.slug}/${raw.audio}`;
  const abs = path.join(PUBLIC_DIR, src.replace(/^\//, ""));
  if (!fs.existsSync(abs)) {
    throw new Error(
      `Quiz "${quiz.slug}" questão ${n}: áudio não encontrado em public${src}`,
    );
  }
  return [{ kind: "audio", src, label: `Áudio – questão ${n}` }];
}

function resolveMedia(
  raw: RawQuestion,
  quiz: RawQuiz,
  n: number,
): Media[] | undefined {
  const media = [
    ...(resolveImage(raw, quiz, n) ?? []),
    ...(resolveAudio(raw, quiz, n) ?? []),
  ];
  return media.length > 0 ? media : undefined;
}

/** Monta a lista final de opções (string) de uma questão de escolha. */
function optionStrings(raw: RawQuestion, quiz: RawQuiz, n: number): string[] {
  if (raw.options) return raw.options;
  if (quiz.optionPool) {
    const pinned = quiz.pinLast ?? [];
    const base = quiz.shuffleOptions
      ? shuffle(quiz.optionPool, Math.imul(n, 2654435761))
      : quiz.optionPool;
    return [...base, ...pinned];
  }
  throw new Error(
    `Quiz "${quiz.slug}" questão ${n}: sem "options" nem "optionPool".`,
  );
}

function indexOfAnswer(
  options: string[],
  answer: string,
  quiz: RawQuiz,
  n: number,
): number {
  const i = options.indexOf(answer);
  if (i < 0) {
    throw new Error(
      `Quiz "${quiz.slug}" questão ${n}: resposta "${answer}" não está entre as opções.`,
    );
  }
  return i;
}

function resolveQuestion(raw: RawQuestion, quiz: RawQuiz, n: number): Question {
  const type = raw.type ?? "single-choice";
  const prompt = raw.prompt ?? quiz.prompt;
  const media = resolveMedia(raw, quiz, n);

  if (type === "matching") {
    if (!raw.left || !raw.right) {
      throw new Error(
        `Quiz "${quiz.slug}" questão ${n}: matching precisa de "left" e "right".`,
      );
    }
    const left = raw.left.map((f, i) =>
      resolveImageFile(f, quiz, n, `Item A${i + 1} – questão ${n}`, `left ${i + 1}`),
    );
    const right = raw.right.map((f, i) =>
      resolveImageFile(f, quiz, n, `Item B${i + 1} – questão ${n}`, `right ${i + 1}`),
    );
    const pairs = raw.pairs ?? left.map((_, i): [number, number] => [i, i]);
    const q: MatchingQuestion = {
      type: "matching",
      grading: "auto",
      prompt,
      media,
      explanation: raw.explanation,
      left,
      right,
      pairs,
    };
    return q;
  }

  const imageOptions = resolveImageOptions(raw, quiz, n);
  const strings = imageOptions ? undefined : optionStrings(raw, quiz, n);
  const options = imageOptions ?? strings!.map(text);

  if (type === "multiple-choice") {
    const corrects =
      raw.corrects ??
      (raw.answers ?? []).map((a) => indexOfAnswer(strings!, a, quiz, n));
    if (corrects.length === 0) {
      throw new Error(
        `Quiz "${quiz.slug}" questão ${n}: múltipla escolha sem resposta correta.`,
      );
    }
    const q: MultipleChoiceQuestion = {
      type: "multiple-choice",
      grading: "auto",
      prompt,
      media,
      explanation: raw.explanation,
      options,
      correct: corrects,
    };
    return q;
  }

  const correct =
    raw.correct ??
    (raw.answer !== undefined
      ? indexOfAnswer(strings!, raw.answer, quiz, n)
      : -1);
  if (correct < 0 || correct >= options.length) {
    throw new Error(
      `Quiz "${quiz.slug}" questão ${n}: índice de resposta inválido (${correct}).`,
    );
  }
  const q: SingleChoiceQuestion = {
    type: "single-choice",
    grading: "auto",
    prompt,
    media,
    explanation: raw.explanation,
    options,
    correct,
  };
  return q;
}

function readQuizFile(fileName: string): Quiz {
  const raw = JSON.parse(
    fs.readFileSync(path.join(QUIZ_DIR, fileName), "utf8"),
  ) as RawQuiz;

  if (!raw.slug || !raw.title || !Array.isArray(raw.questions)) {
    throw new Error(`Quiz "${fileName}": faltam slug, title ou questions.`);
  }

  const questions = raw.questions.map((rq, i) =>
    resolveQuestion(rq, raw, i + 1),
  );

  return {
    slug: raw.slug,
    title: raw.title,
    description: raw.description ?? "",
    category: raw.category,
    embedHeight: raw.embedHeight,
    questionCount: questions.length,
    shuffleQuestions: raw.shuffleQuestions ?? false,
    questions,
  };
}

let cache: Quiz[] | null = null;

export function getAllQuizzes(): Quiz[] {
  if (cache) return cache;
  if (!fs.existsSync(QUIZ_DIR)) return [];
  cache = fs
    .readdirSync(QUIZ_DIR)
    .filter((f) => f.endsWith(".json"))
    .map(readQuizFile)
    .sort(
      (a, b) =>
        (a.category ?? "").localeCompare(b.category ?? "") ||
        a.title.localeCompare(b.title),
    );
  return cache;
}

export function getQuiz(slug: string): Quiz | undefined {
  return getAllQuizzes().find((q) => q.slug === slug);
}

const toMeta = (q: Quiz): QuizMeta => ({
  slug: q.slug,
  title: q.title,
  description: q.description,
  category: q.category,
  embedHeight: q.embedHeight,
  questionCount: q.questionCount,
  shuffleQuestions: q.shuffleQuestions,
});

/** Projeção leve para a biblioteca (sem as questões no bundle do cliente). */
export function getAllQuizCards(): QuizMeta[] {
  return getAllQuizzes().map(toMeta);
}
