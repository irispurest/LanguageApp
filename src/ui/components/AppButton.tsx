import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { useThemeStyles } from '@/ui/ThemeProvider';
import type { AppTheme } from '@/ui/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

type IconName = ComponentProps<typeof Ionicons>['name'];

type Props = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: IconName;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
};

function getVariants(
  theme: AppTheme,
): Record<ButtonVariant, { container: ViewStyle; label: TextStyle; iconColor: string }> {
  return {
    primary: {
      container: { backgroundColor: theme.colors.accent },
      label: { color: theme.colors.onAccent },
      iconColor: theme.colors.onAccent,
    },
    secondary: {
      container: {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
        borderWidth: StyleSheet.hairlineWidth,
      },
      label: { color: theme.colors.text },
      iconColor: theme.colors.text,
    },
    ghost: {
      container: { backgroundColor: 'transparent' },
      label: { color: theme.colors.accentStrong },
      iconColor: theme.colors.accentStrong,
    },
  };
}

export function AppButton({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled = false,
  fullWidth = false,
  style,
}: Props) {
  const { theme, styles } = useThemeStyles(createStyles);
  const variants = getVariants(theme);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variants[variant].container,
        fullWidth && styles.fullWidth,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {icon ? <Ionicons name={icon} size={18} color={variants[variant].iconColor} /> : null}
      <Text style={[styles.label, variants[variant].label]}>{label}</Text>
    </Pressable>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    base: {
      minHeight: 44,
      borderRadius: theme.radius.pill,
      paddingHorizontal: theme.spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.sm,
      alignSelf: 'flex-start',
    },
    label: {
      ...theme.typography.body,
      fontWeight: '600',
    },
    fullWidth: {
      alignSelf: 'stretch',
    },
    pressed: {
      opacity: 0.82,
    },
    disabled: {
      opacity: 0.45,
    },
  });
}
