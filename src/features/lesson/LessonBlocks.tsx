import { StyleSheet, Text, View } from 'react-native';
import type { LessonBlock } from '@/core/content/schemas';
import { Card } from '@/ui/components/Card';
import { theme } from '@/ui/theme';

type Props = {
  blocks: LessonBlock[];
};

export function LessonBlocks({ blocks }: Props) {
  return (
    <View style={styles.container}>
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'paragraph':
            return (
              <Text key={`paragraph-${index}`} style={styles.paragraph}>
                {block.text}
              </Text>
            );

          case 'example':
            return (
              <Card key={`example-${index}`} tone="accent">
                <Text style={styles.exampleJapanese}>{block.japanese}</Text>
                <Text style={styles.exampleReading}>{block.reading}</Text>
                <Text style={styles.exampleTranslation}>{block.translation}</Text>
              </Card>
            );

          case 'note':
            return (
              <Card key={`note-${index}`} tone="warning">
                <Text style={styles.note}>{block.text}</Text>
              </Card>
            );

          case 'table':
            return (
              <Card key={`table-${index}`}>
                <View style={styles.tableRow}>
                  {block.headers.map((header) => (
                    <Text key={header} style={[styles.tableCell, styles.tableHeader]}>
                      {header}
                    </Text>
                  ))}
                </View>
                {block.rows.map((row, rowIndex) => (
                  <View key={`row-${rowIndex}`} style={styles.tableRow}>
                    {row.map((cell, cellIndex) => (
                      <Text key={`${rowIndex}-${cellIndex}`} style={styles.tableCell}>
                        {cell}
                      </Text>
                    ))}
                  </View>
                ))}
              </Card>
            );
        }
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.md,
  },
  paragraph: {
    ...theme.typography.bodyLarge,
    color: theme.colors.text,
  },
  exampleJapanese: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600',
    color: theme.colors.text,
  },
  exampleReading: {
    ...theme.typography.body,
    color: theme.colors.accentInk,
  },
  exampleTranslation: {
    ...theme.typography.body,
    color: theme.colors.textMuted,
  },
  note: {
    ...theme.typography.body,
    color: theme.colors.warning,
  },
  tableRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  tableCell: {
    ...theme.typography.caption,
    flex: 1,
    color: theme.colors.text,
  },
  tableHeader: {
    fontWeight: '700',
    color: theme.colors.textMuted,
  },
});
