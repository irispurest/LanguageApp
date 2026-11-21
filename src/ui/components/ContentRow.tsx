import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Badge, type BadgeTone } from '@/ui/components/Badge';
import { theme } from '@/ui/theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

type Props = {
  icon: IconName;
  eyebrow: string;
  title: string;
  description: string;
  badge?: string;
  badgeTone?: BadgeTone;
};

export function ContentRow({
  icon,
  eyebrow,
  title,
  description,
  badge,
  badgeTone = 'warning',
}: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={20} color={theme.colors.accent} />
      </View>
      <View style={styles.body}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        {badge ? <Badge label={badge} tone={badgeTone} /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.md,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceMuted,
  },
  body: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  eyebrow: {
    ...theme.typography.caption,
    fontWeight: '700',
    color: theme.colors.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: {
    ...theme.typography.bodyLarge,
    fontWeight: '600',
    color: theme.colors.text,
  },
  description: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
});
