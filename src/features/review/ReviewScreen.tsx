import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import { strings } from '@/i18n';
import { EmptyState } from '@/ui/components/EmptyState';
import { Screen } from '@/ui/components/Screen';
import { useThemeStyles } from '@/ui/ThemeProvider';
import type { AppTheme } from '@/ui/theme';

export function ReviewScreen() {
  const router = useRouter();
  const { styles } = useThemeStyles(createStyles);

  return (
    <Screen
      title={strings.review.title}
      showHeader={false}
      scroll={false}
      contentStyle={styles.content}
    >
      <EmptyState
        icon="repeat-outline"
        title={strings.review.emptyTitle}
        description={strings.review.emptyDescription}
        actionLabel={strings.review.action}
        onAction={() => router.navigate('/course')}
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
