import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { strings } from '@/i18n';
import { Card } from '@/ui/components/Card';
import { ContentRow } from '@/ui/components/ContentRow';
import { EmptyState } from '@/ui/components/EmptyState';
import { FilterChips, type FilterOption } from '@/ui/components/FilterChips';
import { Screen } from '@/ui/components/Screen';
import { theme } from '@/ui/theme';

type Filter = 'all' | 'read';

const filterOptions: ReadonlyArray<FilterOption<Filter>> = [
  { value: 'all', label: strings.texts.filters.all },
  { value: 'read', label: strings.texts.filters.read },
];

export function TextsScreen() {
  const [filter, setFilter] = useState<Filter>('all');

  return (
    <Screen title={strings.texts.title} subtitle={strings.texts.subtitle}>
      <FilterChips options={filterOptions} value={filter} onChange={setFilter} />

      {filter === 'read' ? (
        <EmptyState
          icon="checkmark-done-outline"
          title={strings.texts.emptyTitle}
          description={strings.texts.emptyDescription}
        />
      ) : (
        <Card>
          <ContentRow
            icon="reader-outline"
            eyebrow={strings.texts.textLevel}
            title={strings.texts.textTitle}
            description={strings.texts.textDescription}
            badge={strings.common.inDevelopment}
          />
        </Card>
      )}

      <Text style={styles.draftNote}>{strings.texts.draftNote}</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  draftNote: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
});
