import { StyleSheet, Text, View, type TextStyle, type ViewStyle } from 'react-native';
import { theme } from '@/ui/theme';

export type BadgeTone = 'neutral' | 'accent' | 'warning';

type Props = {
  label: string;
  tone?: BadgeTone;
};

const tones: Record<BadgeTone, { container: ViewStyle; label: TextStyle }> = {
  neutral: {
    container: { backgroundColor: theme.colors.surfaceMuted },
    label: { color: theme.colors.textMuted },
  },
  accent: {
    container: { backgroundColor: theme.colors.accentSoft },
    label: { color: theme.colors.accentInk },
  },
  warning: {
    container: { backgroundColor: theme.colors.warningSoft },
    label: { color: theme.colors.warning },
  },
};

export function Badge({ label, tone = 'neutral' }: Props) {
  return (
    <View style={[styles.container, tones[tone].container]}>
      <Text style={[styles.label, tones[tone].label]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.sm + 2,
    paddingVertical: theme.spacing.xs,
  },
  label: {
    ...theme.typography.caption,
    fontWeight: '600',
  },
});
