import type { Exercise } from '@/core/content/schemas';

export type ExerciseAnswer =
  | { type: 'multiple_choice'; index: number }
  | { type: 'cloze'; value: string }
  | { type: 'ordering'; order: number[] };

export function normalizeAnswer(value: string): string {
  return value.normalize('NFKC').trim().replace(/\s+/g, ' ');
}

export function checkExercise(exercise: Exercise, answer: ExerciseAnswer): boolean {
  switch (exercise.type) {
    case 'multiple_choice':
      return answer.type === 'multiple_choice' && answer.index === exercise.correctIndex;

    case 'cloze':
      return (
        answer.type === 'cloze' &&
        exercise.correctAnswers.some(
          (expected) => normalizeAnswer(expected) === normalizeAnswer(answer.value),
        )
      );

    case 'ordering':
      return (
        answer.type === 'ordering' &&
        answer.order.length === exercise.correctOrder.length &&
        exercise.correctOrder.every((value, index) => value === answer.order[index])
      );
  }
}

export function isAnswerComplete(exercise: Exercise, answer: ExerciseAnswer | null): boolean {
  if (!answer || answer.type !== exercise.type) {
    return false;
  }

  switch (exercise.type) {
    case 'multiple_choice':
      return answer.type === 'multiple_choice' && answer.index >= 0;

    case 'cloze':
      return answer.type === 'cloze' && answer.value.trim().length > 0;

    case 'ordering':
      return answer.type === 'ordering' && answer.order.length === exercise.tokens.length;
  }
}
