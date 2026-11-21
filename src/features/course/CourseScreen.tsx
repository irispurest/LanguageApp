import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { strings } from '@/i18n';
import { Card } from '@/ui/components/Card';
import { ContentRow } from '@/ui/components/ContentRow';
import { EmptyState } from '@/ui/components/EmptyState';
import { FilterChips, type FilterOption } from '@/ui/components/FilterChips';
import { Screen } from '@/ui/components/Screen';
import { SectionTitle } from '@/ui/components/SectionTitle';
import { theme } from '@/ui/theme';

type Level = 'n5' | 'n4' | 'n3';

const levelOptions: ReadonlyArray<FilterOption<Level>> = [
  { value: 'n5', label: strings.course.levels.n5 },
  { value: 'n4', label: strings.course.levels.n4 },
  { value: 'n3', label: strings.course.levels.n3 },
];

export function CourseScreen() {
  const [level, setLevel] = useState<Level>('n5');

  return (
    <Screen title={strings.course.title} subtitle={strings.course.subtitle}>
      <FilterChips
        label={strings.course.levelLabel}
        options={levelOptions}
        value={level}
        onChange={setLevel}
      />

      {level !== 'n5' ? (
        <EmptyState
          icon="hourglass-outline"
          title={strings.course.levelSoonTitle}
          description={strings.course.levelSoonDescription}
          actionLabel={strings.course.levelSoonAction}
          onAction={() => setLevel('n5')}
        />
      ) : (
        <>
          <SectionTitle
            title={strings.course.sectionTitle}
            subtitle={strings.course.sectionSubtitle}
          />

          <Card>
            <ContentRow
              icon="language-outline"
              eyebrow={strings.course.grammarType}
              title={strings.course.grammarTitle}
              description={strings.course.grammarDescription}
              badge={strings.common.inDevelopment}
            />
            <ContentRow
              icon="text-outline"
              eyebrow={strings.course.vocabularyType}
              title={strings.course.vocabularyTitle}
              description={strings.course.vocabularyDescription}
              badge={strings.common.inDevelopment}
            />
            <ContentRow
              icon="reader-outline"
              eyebrow={strings.course.textType}
              title={strings.course.textTitle}
              description={strings.course.textDescription}
              badge={strings.common.inDevelopment}
            />
          </Card>

          <Text style={styles.note}>{strings.course.reviewNote}</Text>
          <Text style={styles.draftNote}>{strings.course.draftNote}</Text>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  note: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  draftNote: {
    ...theme.typography.caption,
    color: theme.colors.textMuted,
  },
});
