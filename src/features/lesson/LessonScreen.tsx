import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Exercise, Lesson } from '@/core/content/schemas';
import {
  checkExercise,
  isAnswerComplete,
  type ExerciseAnswer,
} from '@/core/exercises/check';
import { ExerciseView } from '@/features/lesson/ExerciseView';
import { LessonBlocks } from '@/features/lesson/LessonBlocks';
import { strings } from '@/i18n';
import { AppButton } from '@/ui/components/AppButton';
import { Card } from '@/ui/components/Card';
import { EmptyState } from '@/ui/components/EmptyState';
import { useThemeStyles } from '@/ui/ThemeProvider';
import type { AppTheme } from '@/ui/theme';
import { lessons } from '../../../content/ja-ru';

type Step = 'intro' | 'content' | 'exercise' | 'summary';

function exerciseLabel(exercise: Exercise): string {
  switch (exercise.type) {
    case 'multiple_choice':
      return exercise.question;

    case 'cloze':
      return exercise.sentence.replace('{{blank}}', '____');

    case 'ordering':
      return exercise.tokens.join(' ');
  }
}

export function LessonScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lessonId?: string }>();
  const lessonId = Array.isArray(params.lessonId) ? params.lessonId[0] : params.lessonId;
  const lesson = lessonId ? lessons[lessonId] : undefined;

  if (!lesson) {
    return (
      <LessonNotFound
        onBack={() => {
          router.back();
        }}
      />
    );
  }

  return (
    <LessonContent
      lesson={lesson}
      onExit={() => {
        router.back();
      }}
    />
  );
}

function LessonNotFound({ onBack }: { onBack: () => void }) {
  const { styles } = useThemeStyles(createStyles);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.notFound}>
        <EmptyState
          icon="help-circle-outline"
          title={strings.lesson.notFoundTitle}
          description={strings.lesson.notFoundDescription}
          actionLabel={strings.lesson.backToCourse}
          onAction={onBack}
        />
      </View>
    </SafeAreaView>
  );
}

function LessonContent({ lesson, onExit }: { lesson: Lesson; onExit: () => void }) {
  const { theme, styles } = useThemeStyles(createStyles);
  const [step, setStep] = useState<Step>('intro');
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [answer, setAnswer] = useState<ExerciseAnswer | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Record<string, boolean>>({});

  const total = lesson.exercises.length;
  const currentExercise = lesson.exercises[exerciseIndex];
  const currentCorrect = currentExercise ? results[currentExercise.id] === true : false;
  const score = Object.values(results).filter(Boolean).length;

  const progress =
    step === 'intro'
      ? 0
      : step === 'content'
        ? 15
        : step === 'summary'
          ? 100
          : 20 + ((exerciseIndex + (submitted ? 1 : 0)) / total) * 75;

  function handleCheck() {
    if (!currentExercise || !answer || !isAnswerComplete(currentExercise, answer)) {
      return;
    }

    const correct = checkExercise(currentExercise, answer);
    setResults((previous) => ({ ...previous, [currentExercise.id]: correct }));
    setSubmitted(true);
  }

  function handleNext() {
    if (exerciseIndex + 1 < total) {
      setExerciseIndex((previous) => previous + 1);
      setAnswer(null);
      setSubmitted(false);
      return;
    }

    setAnswer(null);
    setSubmitted(false);
    setStep('summary');
  }

  function handleRestart() {
    setStep('intro');
    setExerciseIndex(0);
    setAnswer(null);
    setSubmitted(false);
    setResults({});
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={strings.lesson.back}
          hitSlop={12}
          onPress={onExit}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        >
          <Ionicons name="arrow-back" size={22} color={theme.colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>{strings.lesson.header}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%` as `${number}%` }]} />
      </View>

      <ScrollView
        key={`${step}-${exerciseIndex}`}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {step === 'intro' ? (
          <IntroStep lesson={lesson} onStart={() => setStep('content')} />
        ) : null}

        {step === 'content' ? (
          <ContentStep lesson={lesson} onNext={() => setStep('exercise')} />
        ) : null}

        {step === 'exercise' && currentExercise ? (
          <ExerciseStep
            exercise={currentExercise}
            index={exerciseIndex}
            total={total}
            answer={answer}
            submitted={submitted}
            isCorrect={submitted ? currentCorrect : null}
            onAnswer={setAnswer}
            onCheck={handleCheck}
            onNext={handleNext}
          />
        ) : null}

        {step === 'summary' ? (
          <SummaryStep
            lesson={lesson}
            results={results}
            score={score}
            onRestart={handleRestart}
            onExit={onExit}
          />
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function IntroStep({ lesson, onStart }: { lesson: Lesson; onStart: () => void }) {
  const { styles } = useThemeStyles(createStyles);

  return (
    <View style={styles.stack}>
      <View style={styles.titleBlock}>
        <Text style={styles.lessonTitle}>{lesson.title}</Text>
        {lesson.subtitle ? <Text style={styles.lessonSubtitle}>{lesson.subtitle}</Text> : null}
        <Text style={styles.lessonMeta}>
          {lesson.estimatedMinutes} {strings.lesson.minutes}
        </Text>
      </View>

      <Card tone="accent">
        <Text style={styles.label}>{strings.lesson.objective}</Text>
        <Text style={styles.objective}>{lesson.objective}</Text>
      </Card>

      <AppButton
        label={strings.lesson.start}
        icon="play"
        fullWidth
        onPress={onStart}
      />
    </View>
  );
}

function ContentStep({ lesson, onNext }: { lesson: Lesson; onNext: () => void }) {
  const { styles } = useThemeStyles(createStyles);

  return (
    <View style={styles.stack}>
      <Text style={styles.sectionTitle}>{strings.lesson.contentTitle}</Text>
      <LessonBlocks blocks={lesson.blocks} />
      <AppButton
        label={strings.lesson.toExercises}
        icon="arrow-forward"
        fullWidth
        onPress={onNext}
      />
    </View>
  );
}

type ExerciseStepProps = {
  exercise: Exercise;
  index: number;
  total: number;
  answer: ExerciseAnswer | null;
  submitted: boolean;
  isCorrect: boolean | null;
  onAnswer: (answer: ExerciseAnswer) => void;
  onCheck: () => void;
  onNext: () => void;
};

function ExerciseStep({
  exercise,
  index,
  total,
  answer,
  submitted,
  isCorrect,
  onAnswer,
  onCheck,
  onNext,
}: ExerciseStepProps) {
  const { styles } = useThemeStyles(createStyles);
  const canCheck = isAnswerComplete(exercise, answer);

  return (
    <View style={styles.stack}>
      <Text style={styles.progressLabel}>
        {strings.lesson.exerciseLabel} {index + 1} / {total}
      </Text>
      <Text style={styles.exercisePrompt}>{exercise.prompt}</Text>

      <ExerciseView
        key={exercise.id}
        exercise={exercise}
        answer={answer}
        submitted={submitted}
        isCorrect={isCorrect}
        onAnswer={onAnswer}
      />

      {submitted ? (
        <View
          style={[
            styles.feedback,
            isCorrect ? styles.feedbackCorrect : styles.feedbackWrong,
          ]}
        >
          <Text
            style={[
              styles.feedbackTitle,
              isCorrect ? styles.feedbackTitleCorrect : styles.feedbackTitleWrong,
            ]}
          >
            {isCorrect ? strings.lesson.correct : strings.lesson.incorrect}
          </Text>
          <Text style={styles.feedbackText}>{exercise.explanation}</Text>
        </View>
      ) : null}

      {submitted ? (
        <AppButton
          label={index + 1 === total ? strings.lesson.finish : strings.lesson.next}
          icon="arrow-forward"
          fullWidth
          onPress={onNext}
        />
      ) : (
        <AppButton
          label={strings.lesson.check}
          icon="checkmark"
          fullWidth
          disabled={!canCheck}
          onPress={onCheck}
        />
      )}
    </View>
  );
}

type SummaryStepProps = {
  lesson: Lesson;
  results: Record<string, boolean>;
  score: number;
  onRestart: () => void;
  onExit: () => void;
};

function SummaryStep({ lesson, results, score, onRestart, onExit }: SummaryStepProps) {
  const { theme, styles } = useThemeStyles(createStyles);

  return (
    <View style={styles.stack}>
      <Text style={styles.summaryTitle}>{strings.lesson.summaryTitle}</Text>

      <Card tone="accent">
        <Text style={styles.label}>{strings.lesson.summaryScore}</Text>
        <Text style={styles.scoreValue}>
          {score} / {lesson.exercises.length}
        </Text>
      </Card>

      <Card>
        {lesson.exercises.map((exercise) => {
          const correct = results[exercise.id] === true;

          return (
            <View key={exercise.id} style={styles.resultRow}>
              <Ionicons
                name={correct ? 'checkmark-circle' : 'close-circle'}
                size={20}
                color={correct ? theme.colors.success : theme.colors.danger}
              />
              <Text style={styles.resultText}>{exerciseLabel(exercise)}</Text>
            </View>
          );
        })}
      </Card>

      <Text style={styles.summaryNote}>{strings.lesson.summaryNote}</Text>

      <AppButton
        label={strings.lesson.repeat}
        variant="secondary"
        fullWidth
        onPress={onRestart}
      />
      <AppButton label={strings.lesson.backToCourse} fullWidth onPress={onExit} />
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xs,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
  },
  headerTitle: {
    ...theme.typography.bodyLarge,
    fontWeight: '600',
    color: theme.colors.text,
  },
  headerSpacer: {
    width: 44,
  },
  progressTrack: {
    height: 4,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surfaceMuted,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.accentStrong,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  stack: {
    gap: theme.spacing.lg,
  },
  titleBlock: {
    gap: theme.spacing.xs,
  },
  lessonTitle: {
    ...theme.typography.display,
    fontWeight: '700',
    color: theme.colors.text,
  },
  lessonSubtitle: {
    ...theme.typography.bodyLarge,
    color: theme.colors.textMuted,
  },
  lessonMeta: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  label: {
    ...theme.typography.caption,
    fontWeight: '700',
    color: theme.colors.textMuted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  objective: {
    ...theme.typography.bodyLarge,
    color: theme.colors.text,
  },
  sectionTitle: {
    ...theme.typography.title,
    fontWeight: '700',
    color: theme.colors.text,
  },
  progressLabel: {
    ...theme.typography.caption,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  exercisePrompt: {
    ...theme.typography.bodyLarge,
    fontWeight: '600',
    color: theme.colors.text,
  },
  feedback: {
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  feedbackCorrect: {
    backgroundColor: theme.colors.successSoft,
  },
  feedbackWrong: {
    backgroundColor: theme.colors.dangerSoft,
  },
  feedbackTitle: {
    ...theme.typography.bodyLarge,
    fontWeight: '700',
  },
  feedbackTitleCorrect: {
    color: theme.colors.success,
  },
  feedbackTitleWrong: {
    color: theme.colors.danger,
  },
  feedbackText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  summaryTitle: {
    ...theme.typography.title,
    fontWeight: '700',
    color: theme.colors.text,
  },
  scoreValue: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '700',
    color: theme.colors.text,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
  },
  resultText: {
    ...theme.typography.body,
    color: theme.colors.text,
    flex: 1,
  },
  summaryNote: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.75,
  },
  });
}
