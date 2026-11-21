import { StyleSheet, Text, View } from 'react-native';
import { useThemeStyles } from '@/ui/ThemeProvider';
import type { AppTheme } from '@/ui/theme';

type Props = {
  value: string;
  label: string;
};

export function StatTile({ value, label }: Props) {
  const { styles } = useThemeStyles(createStyles);

  return (
    <View style={styles.tile}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    tile: {
      flex: 1,
      alignItems: 'center',
      gap: theme.spacing.xs,
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.radius.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    value: {
      ...theme.typography.title,
      fontWeight: '700',
      color: theme.colors.text,
    },
    label: {
      ...theme.typography.caption,
      color: theme.colors.textMuted,
      textAlign: 'center',
    },
  });
}
