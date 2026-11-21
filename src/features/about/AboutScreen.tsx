import Constants from 'expo-constants';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { strings } from '@/i18n/ru';
import { Card } from '@/ui/components/Card';
import { theme } from '@/ui/theme';

export function AboutScreen() {
  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.tagline}>{strings.app.tagline}</Text>

      <Card>
        <Text style={styles.label}>{strings.about.versionTitle}</Text>
        <Text style={styles.value}>{version}</Text>
      </Card>

      <Card>
        <Text style={styles.label}>{strings.about.dataTitle}</Text>
        <Text style={styles.description}>{strings.about.dataDescription}</Text>
      </Card>

      <Card>
        <Text style={styles.label}>{strings.about.techTitle}</Text>
        <Text style={styles.description}>{strings.about.techDescription}</Text>
      </Card>

      <Card>
        <Text style={styles.label}>{strings.about.projectTitle}</Text>
        <Text style={styles.description}>{strings.about.projectDescription}</Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
    gap: theme.spacing.md,
  },
  tagline: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  label: {
    ...theme.typography.caption,
    fontWeight: '700',
    color: theme.colors.textMuted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  value: {
    ...theme.typography.title,
    fontWeight: '600',
    color: theme.colors.text,
  },
  description: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
});
