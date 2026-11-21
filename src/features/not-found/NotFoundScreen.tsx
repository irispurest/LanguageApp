import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';
import { strings } from '@/i18n/ru';
import { EmptyState } from '@/ui/components/EmptyState';
import { Screen } from '@/ui/components/Screen';

export function NotFoundScreen() {
  const router = useRouter();

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

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
  },
});
