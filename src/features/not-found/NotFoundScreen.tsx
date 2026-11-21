import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import { strings } from '@/i18n';
import { EmptyState } from '@/ui/components/EmptyState';
import { Screen } from '@/ui/components/Screen';
import { useThemeStyles } from '@/ui/ThemeProvider';
import type { AppTheme } from '@/ui/theme';

export function NotFoundScreen() {
  const router = useRouter();
  const { styles } = useThemeStyles(createStyles);

  return (
    <Screen
      title={strings.notFound.title}
      showHeader={false}
      scroll={false}
      contentStyle={styles.content}
    >
      <EmptyState
        icon="compass-outline"
        title={strings.notFound.title}
        description={strings.notFound.description}
        actionLabel={strings.notFound.action}
        onAction={() => router.replace('/')}
      />
    </Screen>
  );
}

function createStyles(_theme: AppTheme) {
  return StyleSheet.create({
    content: {
      justifyContent: 'center',
    },
  });
}
