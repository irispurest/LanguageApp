import { z } from 'zod';

/**
 * Строковые ID: латиница, цифры и дефисы. Стабильные, без пробелов.
 * Примеры: "ja-ru-n5-wa-ga", "ja-ru-grammar-wa-ga", "1000040".
 */
export const IdSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'ID должен состоять из a-z, 0-9 и дефисов');

export const LanguageCodeSchema = z
  .string()
  .regex(/^[a-z]{2,3}$/, 'Ожидается код языка из 2–3 строчных букв, например ja или ru');

export const LevelCodeSchema = z.enum(['N5', 'N4', 'N3']);
export type LevelCode = z.infer<typeof LevelCodeSchema>;

export const LessonTypeSchema = z.enum(['grammar', 'vocabulary', 'text']);
export type LessonType = z.infer<typeof LessonTypeSchema>;

export const ReviewPolicySchema = z.enum([
  'after_lesson',
  'interleaved',
  'section_end',
  'none',
]);
export type ReviewPolicy = z.infer<typeof ReviewPolicySchema>;

export const ReviewSettingsSchema = z.object({
  policy: ReviewPolicySchema.default('after_lesson'),
  maxWords: z.number().int().positive().max(50).default(10),
});
export type ReviewSettings = z.infer<typeof ReviewSettingsSchema>;

export const SectionSchema = z.object({
  id: IdSchema,
  title: z.string().min(1),
  lessons: z.array(IdSchema).default([]),
  review: ReviewSettingsSchema.default({ policy: 'after_lesson', maxWords: 10 }),
});
export type CourseSection = z.infer<typeof SectionSchema>;

export const LevelSchema = z.object({
  id: IdSchema,
  code: LevelCodeSchema,
  title: z.string().min(1),
  sections: z.array(SectionSchema).default([]),
});
export type CourseLevel = z.infer<typeof LevelSchema>;

export const ManifestSchema = z.object({
  schemaVersion: z.literal(1),
  courseId: IdSchema,
  packVersion: z.string().regex(/^\d+\.\d+\.\d+$/, 'Ожидается SemVer вида 1.2.3'),
  targetLanguage: LanguageCodeSchema,
  sourceLanguage: LanguageCodeSchema,
  title: z.string().min(1),
  description: z.string().optional(),
  license: z.string().min(1),
  attribution: z.array(z.string()).default([]),
  levels: z.array(LevelSchema).min(1),
  grammar: z.array(IdSchema).default([]),
  texts: z.array(IdSchema).default([]),
});
export type CourseManifest = z.infer<typeof ManifestSchema>;

export const ParagraphBlockSchema = z.object({
  type: z.literal('paragraph'),
  text: z.string().min(1),
});

export const ExampleBlockSchema = z.object({
  type: z.literal('example'),
  japanese: z.string().min(1),
  reading: z.string().min(1),
  translation: z.string().min(1),
});

export const NoteBlockSchema = z.object({
  type: z.literal('note'),
  text: z.string().min(1),
});

export const TableBlockSchema = z.object({
  type: z.literal('table'),
  headers: z.array(z.string().min(1)).min(1),
  rows: z.array(z.array(z.string())).min(1),
});

export const BlockSchema = z.discriminatedUnion('type', [
  ParagraphBlockSchema,
  ExampleBlockSchema,
  NoteBlockSchema,
  TableBlockSchema,
]);
export type LessonBlock = z.infer<typeof BlockSchema>;

const ExerciseBaseSchema = z.object({
  id: IdSchema,
  prompt: z.string().min(1),
  explanation: z.string().min(1),
});

export const MultipleChoiceExerciseSchema = ExerciseBaseSchema.extend({
  type: z.literal('multiple_choice'),
  question: z.string().min(1),
  options: z.array(z.string().min(1)).min(2),
  correctIndex: z.number().int().nonnegative(),
});

export const ClozeExerciseSchema = ExerciseBaseSchema.extend({
  type: z.literal('cloze'),
  sentence: z
    .string()
    .min(1)
    .refine((value) => value.includes('{{blank}}'), {
      message: 'В предложении должен быть маркер {{blank}}',
    }),
  bank: z.array(z.string().min(1)).min(1),
  correctAnswers: z.array(z.string().min(1)).min(1),
});

export const OrderingExerciseSchema = ExerciseBaseSchema.extend({
  type: z.literal('ordering'),
  tokens: z.array(z.string().min(1)).min(2),
  correctOrder: z.array(z.number().int().nonnegative()).min(2),
});

export const ExerciseSchema = z.discriminatedUnion('type', [
  MultipleChoiceExerciseSchema,
  ClozeExerciseSchema,
  OrderingExerciseSchema,
]);
export type Exercise = z.infer<typeof ExerciseSchema>;
export type MultipleChoiceExercise = z.infer<typeof MultipleChoiceExerciseSchema>;
export type ClozeExercise = z.infer<typeof ClozeExerciseSchema>;
export type OrderingExercise = z.infer<typeof OrderingExerciseSchema>;

const LessonBaseSchema = z.object({
  schemaVersion: z.literal(1),
  id: IdSchema,
  courseId: IdSchema,
  level: LevelCodeSchema,
  title: z.string().min(1),
  subtitle: z.string().optional(),
  objective: z.string().min(1),
  estimatedMinutes: z.number().int().positive().max(120).default(5),
  tags: z.array(z.string()).default([]),
  blocks: z.array(BlockSchema).min(1),
  exercises: z.array(ExerciseSchema).min(1),
});

export const GrammarLessonSchema = LessonBaseSchema.extend({
  type: z.literal('grammar'),
  grammarPointIds: z.array(IdSchema).min(1),
});

export const VocabularyLessonSchema = LessonBaseSchema.extend({
  type: z.literal('vocabulary'),
  wordIds: z.array(IdSchema).min(1),
});

export const TextLessonSchema = LessonBaseSchema.extend({
  type: z.literal('text'),
  textId: IdSchema,
});

export const LessonSchema = z.discriminatedUnion('type', [
  GrammarLessonSchema,
  VocabularyLessonSchema,
  TextLessonSchema,
]);
export type Lesson = z.infer<typeof LessonSchema>;
export type GrammarLesson = z.infer<typeof GrammarLessonSchema>;
export type VocabularyLesson = z.infer<typeof VocabularyLessonSchema>;
export type TextLesson = z.infer<typeof TextLessonSchema>;

export const GrammarTopicSchema = z.object({
  schemaVersion: z.literal(1),
  id: IdSchema,
  courseId: IdSchema,
  level: LevelCodeSchema,
  title: z.string().min(1),
  summary: z.string().min(1),
  blocks: z.array(BlockSchema).min(1),
});
export type GrammarTopic = z.infer<typeof GrammarTopicSchema>;

export const TextSourceSchema = z.object({
  type: z.enum(['original', 'tatoeba', 'other']),
  license: z.string().min(1),
  attribution: z.string().default(''),
});
export type TextSource = z.infer<typeof TextSourceSchema>;

export const TextTokenSchema = z
  .object({
    surface: z.string().min(1),
    lemma: z.string().min(1),
    reading: z.string().min(1),
    pos: z.string().min(1),
    start: z.number().int().nonnegative(),
    end: z.number().int().nonnegative(),
    entryIds: z.array(z.string().min(1)).default([]),
  })
  .refine((token) => token.end > token.start, {
    message: 'end должен быть больше start',
    path: ['end'],
  });
export type TextToken = z.infer<typeof TextTokenSchema>;

export const ReadingTextSchema = z
  .object({
    schemaVersion: z.literal(1),
    id: IdSchema,
    courseId: IdSchema,
    level: LevelCodeSchema,
    title: z.string().min(1),
    body: z.string().min(1),
    translation: z.string().min(1),
    tokens: z.array(TextTokenSchema).min(1),
    source: TextSourceSchema,
  })
  .superRefine((text, ctx) => {
    let cursor = 0;

    text.tokens.forEach((token, index) => {
      if (token.start !== cursor) {
        ctx.addIssue({
          code: 'custom',
          message: `Ожидался start=${cursor}, получен ${token.start}`,
          path: ['tokens', index, 'start'],
        });
      }

      const slice = text.body.slice(token.start, token.end);
      if (slice !== token.surface) {
        ctx.addIssue({
          code: 'custom',
          message: `Токен не совпадает с body: ожидалось "${slice}", получено "${token.surface}"`,
          path: ['tokens', index, 'surface'],
        });
      }

      cursor = token.end;
    });

    if (cursor !== text.body.length) {
      ctx.addIssue({
        code: 'custom',
        message: `Токены покрывают ${cursor} из ${text.body.length} символов`,
        path: ['tokens'],
      });
    }
  });
export type ReadingText = z.infer<typeof ReadingTextSchema>;
