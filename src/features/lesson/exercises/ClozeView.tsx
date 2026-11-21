import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ClozeExercise } from '@/core/content/schemas';
import { useThemeStyles } from '@/ui/ThemeProvider';
import type { AppTheme } from '@/ui/theme';

type Props = {
  exercise: ClozeExercise;
  selectedValue: string | null;
  submitted: boolean;
  isCorrect: boolean | null;
  onSelect: (value: string) => void;
};

export function ClozeView({
  exercise,
  selectedValue,
  submitted,
  isCorrect,
  onSelect,
}: Props) {
  const { styles } = useThemeStyles(createStyles);
  const [before, after] = exercise.sentence.split('{{blank}}');

  return (
    <View style={styles.container}>
      <Text style={styles.sentence}>
        {before}
        <Text
          style={[
            styles.blank,
            submitted && isCorrect === true && styles.blankCorrect,
            submitted && isCorrect === false && styles.blankWrong,
          ]}
        >
          {selectedValue ?? '________'}
        </Text>
        {after}
      </Text>

      <View style={styles.bank}>
        {exercise.bank.map((value) => {
          const selected = value === selectedValue;

          return (
            <Pressable
              key={value}
              accessibilityRole="button"
              accessibilityState={{ selected, disabled: submitted }}
              disabled={submitted}
              onPress={() => onSelect(value)}
              style={({ pressed }) => [
                styles.chip,
                selected && styles.chipSelected,
                pressed && !submitted && styles.chipPressed,
              ]}
            >
              <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                {value}
              </Text>
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
      gap: theme.spacing.lg,
    },
    sentence: {
      ...theme.typography.bodyLarge,
      fontSize: 20,
      lineHeight: 30,
      color: theme.colors.text,
    },
    blank: {
      color: theme.colors.accentInk,
      backgroundColor: theme.colors.accentSoft,
      fontWeight: '700',
    },
    blankCorrect: {
      color: theme.colors.success,
      backgroundColor: theme.colors.successSoft,
    },
    blankWrong: {
      color: theme.colors.danger,
      backgroundColor: theme.colors.dangerSoft,
    },
    bank: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    chip: {
      minHeight: 42,
      borderRadius: theme.radius.pill,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    chipSelected: {
      backgroundColor: theme.colors.accent,
      borderColor: theme.colors.accent,
    },
    chipPressed: {
      opacity: 0.8,
    },
    chipText: {
      ...theme.typography.body,
      fontWeight: '600',
      color: theme.colors.text,
    },
    chipTextSelected: {
      color: theme.colors.onAccent,
    },
  });
}
