import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { strings } from '@/i18n';
import { Card } from '@/ui/components/Card';
import { ContentRow } from '@/ui/components/ContentRow';
import { EmptyState } from '@/ui/components/EmptyState';
import { FilterChips, type FilterOption } from '@/ui/components/FilterChips';
import { Screen } from '@/ui/components/Screen';
import { theme } from '@/ui/theme';

type Filter = 'all' | 'learned';

const filterOptions: ReadonlyArray<FilterOption<Filter>> = [
  { value: 'all', label: strings.grammar.filters.all },
  { value: 'learned', label: strings.grammar.filters.learned },
];

export function GrammarScreen() {
  const [filter, setFilter] = useState<Filter>('all');

  return (
    <Screen title={strings.grammar.title} subtitle={strings.grammar.subtitle}>
      <FilterChips options={filterOptions} value={filter} onChange={setFilter} />

      {filter === 'learned' ? (
        <EmptyState
          icon="checkmark-done-outline"
          title={strings.grammar.emptyTitle}
          description={strings.grammar.emptyDescription}
        />
      ) : (
        <Card>
          <ContentRow
            icon="language-outline"
            eyebrow={strings.grammar.topicLevel}
            title={strings.grammar.topicTitle}
            description={strings.grammar.topicDescription}
            badge={strings.common.inDevelopment}
          />
        </Card>
      )}

      <Text style={styles.draftNote}>{strings.grammar.draftNote}</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  draftNote: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
});
