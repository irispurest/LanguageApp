import type { Exercise } from '@/core/content/schemas';
import type { ExerciseAnswer } from '@/core/exercises/check';
import { ClozeView } from '@/features/lesson/exercises/ClozeView';
import { MultipleChoiceView } from '@/features/lesson/exercises/MultipleChoiceView';
import { OrderingView } from '@/features/lesson/exercises/OrderingView';

type Props = {
  exercise: Exercise;
  answer: ExerciseAnswer | null;
  submitted: boolean;
  isCorrect: boolean | null;
  onAnswer: (answer: ExerciseAnswer) => void;
};

export function ExerciseView({ exercise, answer, submitted, isCorrect, onAnswer }: Props) {
  switch (exercise.type) {
    case 'multiple_choice':
      return (
        <MultipleChoiceView
          exercise={exercise}
          selectedIndex={answer?.type === 'multiple_choice' ? answer.index : null}
          submitted={submitted}
          onSelect={(index) => onAnswer({ type: 'multiple_choice', index })}
        />
      );

    case 'cloze':
      return (
        <ClozeView
          exercise={exercise}
          selectedValue={answer?.type === 'cloze' ? answer.value : null}
          submitted={submitted}
          isCorrect={isCorrect}
          onSelect={(value) => onAnswer({ type: 'cloze', value })}
        />
      );

    case 'ordering':
      return (
        <OrderingView
          exercise={exercise}
          order={answer?.type === 'ordering' ? answer.order : []}
          submitted={submitted}
          isCorrect={isCorrect}
          onChange={(order) => onAnswer({ type: 'ordering', order })}
        />
      );
  }
}
