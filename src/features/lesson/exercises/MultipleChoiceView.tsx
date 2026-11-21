import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { MultipleChoiceExercise } from '@/core/content/schemas';
import { useThemeStyles } from '@/ui/ThemeProvider';
import type { AppTheme } from '@/ui/theme';

type Props = {
  exercise: MultipleChoiceExercise;
  selectedIndex: number | null;
  submitted: boolean;
  onSelect: (index: number) => void;
};

export function MultipleChoiceView({ exercise, selectedIndex, submitted, onSelect }: Props) {
  const { theme, styles } = useThemeStyles(createStyles);

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{exercise.question}</Text>
      <View style={styles.options}>
        {exercise.options.map((option, index) => {
          const selected = selectedIndex === index;
          const correct = submitted && index === exercise.correctIndex;
          const wrong = submitted && selected && index !== exercise.correctIndex;

          return (
            <Pressable
              key={`${option}-${index}`}
              accessibilityRole="button"
              accessibilityState={{ selected, disabled: submitted }}
              disabled={submitted}
              onPress={() => onSelect(index)}
              style={({ pressed }) => [
                styles.option,
                selected && !submitted && styles.optionSelected,
                correct && styles.optionCorrect,
                wrong && styles.optionWrong,
                pressed && !submitted && styles.optionPressed,
              ]}
            >
              <Text
                style={[
                  styles.optionText,
                  selected && !submitted && styles.optionTextSelected,
                  correct && styles.optionTextCorrect,
                  wrong && styles.optionTextWrong,
                ]}
              >
                {option}
              </Text>
              {correct ? (
                <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
              ) : null}
              {wrong ? (
                <Ionicons name="close-circle" size={20} color={theme.colors.danger} />
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: {
      gap: theme.spacing.md,
    },
    question: {
      ...theme.typography.bodyLarge,
      color: theme.colors.text,
    },
    options: {
      gap: theme.spacing.sm,
    },
    option: {
      minHeight: 48,
      borderRadius: theme.radius.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing.sm,
    },
    optionSelected: {
      backgroundColor: theme.colors.accentSoft,
      borderColor: theme.colors.accent,
    },
    optionCorrect: {
      backgroundColor: theme.colors.successSoft,
      borderColor: theme.colors.success,
    },
    optionWrong: {
      backgroundColor: theme.colors.dangerSoft,
      borderColor: theme.colors.danger,
    },
    optionPressed: {
      opacity: 0.8,
    },
    optionText: {
      ...theme.typography.bodyLarge,
      color: theme.colors.text,
      flex: 1,
    },
    optionTextSelected: {
      color: theme.colors.accentInk,
      fontWeight: '600',
    },
    optionTextCorrect: {
      color: theme.colors.success,
      fontWeight: '600',
    },
    optionTextWrong: {
      color: theme.colors.danger,
      fontWeight: '600',
    },
  });
}
