import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { strings } from '@/i18n';
import { AppButton } from '@/ui/components/AppButton';
import { Badge } from '@/ui/components/Badge';
import { Card } from '@/ui/components/Card';
import { Screen } from '@/ui/components/Screen';
import { SectionTitle } from '@/ui/components/SectionTitle';
import { StatTile } from '@/ui/components/StatTile';
import { theme } from '@/ui/theme';

export function HomeScreen() {
  const router = useRouter();

  return (
    <Screen
      title={strings.home.title}
      subtitle={strings.home.subtitle}
      right={
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={strings.home.settingsAction}
          hitSlop={12}
          onPress={() => router.push('/about')}
          style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}
        >
          <Ionicons name="settings-outline" size={22} color={theme.colors.text} />
        </Pressable>
      }
    >
      <Card tone="accent">
        <Text style={styles.eyebrow}>{strings.home.continueEyebrow}</Text>
        <Text style={styles.heroTitle}>{strings.home.continueTitle}</Text>
        <Text style={styles.heroDescription}>{strings.home.continueDescription}</Text>
        <AppButton
          label={strings.home.continueAction}
          icon="arrow-forward"
          onPress={() => router.navigate('/course')}
        />
      </Card>

      <Card>
        <View style={styles.rowBetween}>
          <Text style={styles.cardTitle}>{strings.home.reviewTitle}</Text>
          <Badge label={strings.home.reviewBadge} />
        </View>
        <Text style={styles.cardDescription}>{strings.home.reviewDescription}</Text>
        <AppButton
          label={strings.home.reviewAction}
          variant="secondary"
          onPress={() => router.push('/review')}
        />
      </Card>

      <SectionTitle title={strings.home.statsTitle} />
      <View style={styles.statsRow}>
        <StatTile value="0" label={strings.home.stats.lessons} />
        <StatTile value="0" label={strings.home.stats.words} />
        <StatTile value="0" label={strings.home.stats.due} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
  },
  iconButtonPressed: {
    opacity: 0.75,
  },
  eyebrow: {
    ...theme.typography.caption,
    fontWeight: '700',
    color: theme.colors.accentInk,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
    color: theme.colors.text,
  },
  heroDescription: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  cardTitle: {
    ...theme.typography.bodyLarge,
    fontWeight: '600',
    color: theme.colors.text,
    flex: 1,
  },
  cardDescription: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
});
