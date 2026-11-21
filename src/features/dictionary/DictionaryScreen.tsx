import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { strings } from '@/i18n/ru';
import { EmptyState } from '@/ui/components/EmptyState';
import { FilterChips, type FilterOption } from '@/ui/components/FilterChips';
import { Screen } from '@/ui/components/Screen';
import { SectionTitle } from '@/ui/components/SectionTitle';
import { theme } from '@/ui/theme';

type Sort = 'added' | 'progress' | 'alpha';

const sortOptions: ReadonlyArray<FilterOption<Sort>> = [
  { value: 'added', label: strings.dictionary.sort.added },
  { value: 'progress', label: strings.dictionary.sort.progress },
  { value: 'alpha', label: strings.dictionary.sort.alpha },
];

export function DictionaryScreen() {
  const [sort, setSort] = useState<Sort>('added');

  return (
    <Screen title={strings.dictionary.title} subtitle={strings.dictionary.subtitle}>
      <View style={styles.search}>
        <Ionicons name="search-outline" size={18} color={theme.colors.textMuted} />
        <Text style={styles.searchText}>{strings.dictionary.searchPlaceholder}</Text>
      </View>

      <SectionTitle title={strings.dictionary.personalTitle} />
      <FilterChips
        label={strings.dictionary.sortLabel}
        options={sortOptions}
        value={sort}
        onChange={setSort}
      />

      <EmptyState
        icon="book-outline"
        title={strings.dictionary.emptyTitle}
        description={strings.dictionary.emptyDescription}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    minHeight: 48,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  searchText: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
    flex: 1,
  },
});
