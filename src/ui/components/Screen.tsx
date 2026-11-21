import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@/ui/theme';

type Props = {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  showHeader?: boolean;
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  children: ReactNode;
};

export function Screen({
  title,
  subtitle,
  right,
  showHeader = true,
  scroll = true,
  contentStyle,
  children,
}: Props) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {showHeader ? (
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
          {right ? <View style={styles.right}>{right}</View> : null}
        </View>
      ) : null}

      {scroll ? (
        <ScrollView
          contentContainerStyle={[styles.content, contentStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.content, styles.flex, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xs,
  },
  headerText: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  title: {
    ...theme.typography.display,
    fontWeight: '700',
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  right: {
    paddingTop: theme.spacing.xs,
  },
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
    gap: theme.spacing.md,
  },
  flex: {
    flex: 1,
  },
});
