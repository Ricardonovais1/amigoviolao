import type { Question } from "@/lib/quiz-types";
import type { QuestionModule } from "./shared";
import { singleChoiceModule } from "./questions/SingleChoiceQuestion";
import { multipleChoiceModule } from "./questions/MultipleChoiceQuestion";

// Registro tipo -> módulo. Os casts são seguros porque a casca (QuizPlayer)
// só entrega a um módulo questões do próprio `type`. Tipos ainda sem renderer
// (ordering, matching, fill-blank, free-text, essay, survey) simplesmente não
// aparecem aqui; o QuizPlayer trata a ausência com um aviso amigável.
export const registry: Partial<Record<Question["type"], QuestionModule>> = {
  "single-choice": singleChoiceModule as QuestionModule,
  "multiple-choice": multipleChoiceModule as QuestionModule,
};

export function getModule(type: Question["type"]): QuestionModule | undefined {
  return registry[type];
}
