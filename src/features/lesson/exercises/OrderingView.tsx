import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { OrderingExercise } from '@/core/content/schemas';
import { strings } from '@/i18n';
import { useThemeStyles } from '@/ui/ThemeProvider';
import type { AppTheme } from '@/ui/theme';

type Props = {
  exercise: OrderingExercise;
  order: number[];
  submitted: boolean;
  isCorrect: boolean | null;
  onChange: (order: number[]) => void;
};

function shuffleIndices(length: number): number[] {
  const indices = Array.from({ length }, (_, index) => index);

  for (let index = length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [indices[index], indices[swapIndex]] = [indices[swapIndex], indices[index]];
  }

  if (length > 1 && indices.every((value, index) => value === index)) {
    const first = indices.shift();
    if (first !== undefined) {
      indices.push(first);
    }
  }

  return indices;
}

export function OrderingView({
  exercise,
  order,
  submitted,
  isCorrect,
  onChange,
}: Props) {
  const { styles } = useThemeStyles(createStyles);
  const [shuffled] = useState(() => shuffleIndices(exercise.tokens.length));
  const selected = new Set(order);
  const available = shuffled.filter((index) => !selected.has(index));

  return (
    <View style={styles.container}>
      <Text style={styles.hint}>{strings.lesson.orderingHint}</Text>

      <View
        style={[
          styles.answerArea,
          submitted && isCorrect === true && styles.answerAreaCorrect,
          submitted && isCorrect === false && styles.answerAreaWrong,
        ]}
      >
        {order.length === 0 ? (
          <Text style={styles.placeholder}>—</Text>
        ) : (
          order.map((tokenIndex, position) => (
            <Pressable
              key={`${tokenIndex}-${position}`}
              accessibilityRole="button"
              accessibilityState={{ disabled: submitted }}
              disabled={submitted}
              onPress={() => onChange(order.filter((_, index) => index !== position))}
              style={({ pressed }) => [
                styles.token,
                styles.tokenSelected,
                pressed && !submitted && styles.tokenPressed,
              ]}
            >
              <Text style={styles.tokenTextSelected}>{exercise.tokens[tokenIndex]}</Text>
            </Pressable>
          ))
        )}
      </View>

      <View style={styles.bank}>
        {available.map((tokenIndex) => (
          <Pressable
            key={tokenIndex}
            accessibilityRole="button"
            accessibilityState={{ disabled: submitted }}
            disabled={submitted}
            onPress={() => onChange([...order, tokenIndex])}
            style={({ pressed }) => [
              styles.token,
              pressed && !submitted && styles.tokenPressed,
            ]}
          >
            <Text style={styles.tokenText}>{exercise.tokens[tokenIndex]}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: {
      gap: theme.spacing.md,
    },
    hint: {
      ...theme.typography.caption,
      color: theme.colors.textMuted,
    },
    answerArea: {
      minHeight: 64,
      borderRadius: theme.radius.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      padding: theme.spacing.sm,
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    answerAreaCorrect: {
      backgroundColor: theme.colors.successSoft,
      borderColor: theme.colors.success,
    },
    answerAreaWrong: {
      backgroundColor: theme.colors.dangerSoft,
      borderColor: theme.colors.danger,
    },
    placeholder: {
      ...theme.typography.body,
      color: theme.colors.textMuted,
      paddingHorizontal: theme.spacing.sm,
    },
    bank: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    token: {
      minHeight: 42,
      borderRadius: theme.radius.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tokenSelected: {
      backgroundColor: theme.colors.accentSoft,
      borderColor: theme.colors.accent,
    },
    tokenPressed: {
      opacity: 0.8,
    },
    tokenText: {
      ...theme.typography.body,
      color: theme.colors.text,
    },
    tokenTextSelected: {
      ...theme.typography.body,
      fontWeight: '600',
      color: theme.colors.accentInk,
    },
  });
}
