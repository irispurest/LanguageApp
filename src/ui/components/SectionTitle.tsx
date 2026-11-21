import { StyleSheet, Text, View } from 'react-native';
import { useThemeStyles } from '@/ui/ThemeProvider';
import type { AppTheme } from '@/ui/theme';

type Props = {
  title: string;
  subtitle?: string;
};

export function SectionTitle({ title, subtitle }: Props) {
  const { styles } = useThemeStyles(createStyles);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    container: {
      gap: theme.spacing.xs,
      marginTop: theme.spacing.xs,
    },
    title: {
      ...theme.typography.title,
      fontWeight: '700',
      color: theme.colors.text,
    },
    subtitle: {
      ...theme.typography.caption,
      color: theme.colors.textMuted,
    },
  });
}
