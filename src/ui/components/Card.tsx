import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useThemeStyles } from '@/ui/ThemeProvider';
import type { AppTheme } from '@/ui/theme';

export type CardTone = 'surface' | 'accent' | 'warning';

type Props = {
  children: ReactNode;
  tone?: CardTone;
  style?: StyleProp<ViewStyle>;
};

export function Card({ children, tone = 'surface', style }: Props) {
  const { theme, styles } = useThemeStyles(createStyles);
  const tones: Record<CardTone, ViewStyle> = {
    surface: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
    },
    accent: {
      backgroundColor: theme.colors.accentSoft,
      borderColor: theme.colors.accentSoft,
    },
    warning: {
      backgroundColor: theme.colors.warningSoft,
      borderColor: theme.colors.warningSoft,
    },
  };

  return <View style={[styles.card, tones[tone], style]}>{children}</View>;
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    card: {
      borderWidth: StyleSheet.hairlineWidth,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.lg,
      gap: theme.spacing.md,
    },
  });
}
