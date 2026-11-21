import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import { strings } from '@/i18n';
import { EmptyState } from '@/ui/components/EmptyState';
import { Screen } from '@/ui/components/Screen';

export function ReviewScreen() {
  const router = useRouter();

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

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
  },
});
