import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
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
  onPress?: () => void;
};

export function ContentRow({
  icon,
  eyebrow,
  title,
  description,
  badge,
  badgeTone = 'warning',
  onPress,
}: Props) {
  const content = (
    <>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={20} color={theme.colors.accent} />
      </View>
      <View style={styles.body}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        {badge ? <Badge label={badge} tone={badgeTone} /> : null}
      </View>
      {onPress ? (
        <Ionicons name="chevron-forward" size={18} color={theme.colors.textMuted} />
      ) : null}
    </>
  );

  if (!onPress) {
    return <View style={styles.row}>{content}</View>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      {content}
    </Pressable>
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
  pressed: {
    opacity: 0.8,
  },
});
