import fs from 'node:fs';
import path from 'node:path';
import type { ZodError } from 'zod';
import {
  GrammarTopicSchema,
  LessonSchema,
  ManifestSchema,
  ReadingTextSchema,
  type CourseManifest,
  type CourseSection,
  type Exercise,
  type GrammarTopic,
  type Lesson,
  type ReadingText,
} from '../../src/core/content/schemas';

export type IssueSeverity = 'error' | 'warning';

export type ValidationIssue = {
  severity: IssueSeverity;
  file: string;
  path: string;
  message: string;
};

export type ValidationStats = {
  levels: number;
  sections: number;
  lessons: number;
  grammarTopics: number;
  texts: number;
};

export type ValidationResult = {
  ok: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  stats: ValidationStats;
};

export type ValidateOptions = {
  writeIndex?: boolean;
};

type LoadedContent = {
  manifest: CourseManifest;
  lessons: Map<string, Lesson>;
  grammar: Map<string, GrammarTopic>;
  texts: Map<string, ReadingText>;
};

const LESSONS_DIR = 'lessons';
const GRAMMAR_DIR = 'grammar';
const TEXTS_DIR = 'texts';

function addIssue(
  issues: ValidationIssue[],
  severity: IssueSeverity,
  file: string,
  issuePath: string,
  message: string,
): void {
  issues.push({ severity, file, path: issuePath, message });
}

function formatZodError(file: string, error: ZodError): ValidationIssue[] {
  return error.issues.map((issue) => ({
    severity: 'error' as const,
    file,
    path: issue.path.map(String).join('.'),
    message: issue.message,
  }));
}

function readJson(
  root: string,
  relativePath: string,
  issues: ValidationIssue[],
): unknown | undefined {
  const filePath = path.join(root, relativePath);

  if (!fs.existsSync(filePath)) {
    addIssue(issues, 'error', relativePath, '', 'Файл не найден');
    return undefined;
  }

  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as unknown;
  } catch (error) {
    addIssue(
      issues,
      'error',
      relativePath,
      '',
      `Не удалось прочитать JSON: ${error instanceof Error ? error.message : String(error)}`,
    );
    return undefined;
  }
}

function listJsonIds(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith('.json'))
    .map((name) => name.slice(0, -'.json'.length))
    .sort();
}

function validateExercise(exercise: Exercise, file: string, issues: ValidationIssue[]): void {
  switch (exercise.type) {
    case 'multiple_choice':
      if (exercise.correctIndex >= exercise.options.length) {
        addIssue(
          issues,
          'error',
          file,
          `exercises.${exercise.id}.correctIndex`,
          `correctIndex ${exercise.correctIndex} вне диапазона options (${exercise.options.length})`,
        );
      }
      break;

    case 'cloze': {
      const blanks = exercise.sentence.match(/\{\{blank\}\}/g)?.length ?? 0;
      if (blanks !== 1) {
        addIssue(
          issues,
          'error',
          file,
          `exercises.${exercise.id}.sentence`,
          `Ожидается ровно один {{blank}}, найдено ${blanks}`,
        );
      }
      break;
    }

    case 'ordering': {
      const expected = Array.from({ length: exercise.tokens.length }, (_, index) => index);
      const sorted = [...exercise.correctOrder].sort((a, b) => a - b);
      const valid =
        sorted.length === expected.length && sorted.every((value, index) => value === index);

      if (!valid) {
        addIssue(
          issues,
          'error',
          file,
          `exercises.${exercise.id}.correctOrder`,
          'correctOrder должен быть перестановкой индексов tokens',
        );
      }
      break;
    }
  }
}

function validateLesson(
  lesson: Lesson,
  levelCode: string,
  file: string,
  grammar: Map<string, GrammarTopic>,
  texts: Map<string, ReadingText>,
  issues: ValidationIssue[],
): void {
  if (lesson.level !== levelCode) {
    addIssue(
      issues,
      'error',
      file,
      'level',
      `Уровень урока ${lesson.level} не совпадает с уровнем раздела ${levelCode}`,
    );
  }

  const exerciseIds = new Set<string>();
  for (const exercise of lesson.exercises) {
    if (exerciseIds.has(exercise.id)) {
      addIssue(issues, 'error', file, `exercises.${exercise.id}`, 'Дубликат ID упражнения');
    }
    exerciseIds.add(exercise.id);
    validateExercise(exercise, file, issues);
  }

  for (const block of lesson.blocks) {
    if (block.type !== 'table') {
      continue;
    }

    block.rows.forEach((row, index) => {
      if (row.length !== block.headers.length) {
        addIssue(
          issues,
          'error',
          file,
          `blocks.table.rows.${index}`,
          `Колонок ${row.length}, ожидалось ${block.headers.length}`,
        );
      }
    });
  }

  if (lesson.type === 'grammar') {
    for (const grammarId of lesson.grammarPointIds) {
      if (!grammar.has(grammarId)) {
        addIssue(
          issues,
          'error',
          file,
          'grammarPointIds',
          `Грамматическая тема "${grammarId}" отсутствует в каталоге`,
        );
      }
    }
  }

  if (lesson.type === 'text' && !texts.has(lesson.textId)) {
    addIssue(
      issues,
      'error',
      file,
      'textId',
      `Текст "${lesson.textId}" отсутствует в каталоге`,
    );
  }
}

function checkDuplicates(
  values: string[],
  file: string,
  issuePath: string,
  label: string,
  issues: ValidationIssue[],
): void {
  const seen = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) {
      addIssue(issues, 'error', file, issuePath, `Дубликат ${label}: ${value}`);
    }
    seen.add(value);
  }
}

function writeContentIndex(
  contentDir: string,
  loaded: LoadedContent,
  issues: ValidationIssue[],
): void {
  const lessonEntries = [...loaded.lessons.entries()];
  const grammarEntries = [...loaded.grammar.entries()];
  const textEntries = [...loaded.texts.entries()];

  const imports = [
    `import manifestJson from './manifest.json';`,
    ...lessonEntries.map(
      ([id], index) => `import lesson${index} from './${LESSONS_DIR}/${id}.json';`,
    ),
    ...grammarEntries.map(
      ([id], index) => `import grammar${index} from './${GRAMMAR_DIR}/${id}.json';`,
    ),
    ...textEntries.map(
      ([id], index) => `import text${index} from './${TEXTS_DIR}/${id}.json';`,
    ),
  ].join('\n');

  const lessonMap = lessonEntries
    .map(
      ([id], index) =>
        `  ${JSON.stringify(id)}: lesson${index} as unknown as Lesson,`,
    )
    .join('\n');
  const grammarMap = grammarEntries
    .map(
      ([id], index) =>
        `  ${JSON.stringify(id)}: grammar${index} as unknown as GrammarTopic,`,
    )
    .join('\n');
  const textMap = textEntries
    .map(
      ([id], index) =>
        `  ${JSON.stringify(id)}: text${index} as unknown as ReadingText,`,
    )
    .join('\n');

  const source = `// AUTO-GENERATED by scripts/validate-content.ts. Do not edit by hand.
import type { CourseManifest, GrammarTopic, Lesson, ReadingText } from '@/core/content/schemas';
${imports}

export const manifest = manifestJson as unknown as CourseManifest;

export const lessons: Record<string, Lesson> = {
${lessonMap}
};

export const grammar: Record<string, GrammarTopic> = {
${grammarMap}
};

export const texts: Record<string, ReadingText> = {
${textMap}
};
`;

  const target = path.join(contentDir, 'index.ts');
  if (fs.existsSync(target) && fs.readFileSync(target, 'utf8') === source) {
    return;
  }

  try {
    fs.writeFileSync(target, source, 'utf8');
  } catch (error) {
    addIssue(
      issues,
      'error',
      'content/ja/index.ts',
      '',
      `Не удалось записать индекс: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export function validateContentProject(
  rootDir = process.cwd(),
  options: ValidateOptions = {},
): ValidationResult {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];
  const contentDir = path.join(rootDir, 'content', 'ja');
  const manifestFile = 'content/ja/manifest.json';
  const rawManifest = readJson(rootDir, manifestFile, errors);

  if (!rawManifest) {
    return {
      ok: false,
      errors,
      warnings,
      stats: { levels: 0, sections: 0, lessons: 0, grammarTopics: 0, texts: 0 },
    };
  }

  const manifestResult = ManifestSchema.safeParse(rawManifest);
  if (!manifestResult.success) {
    errors.push(...formatZodError(manifestFile, manifestResult.error));
    return {
      ok: false,
      errors,
      warnings,
      stats: { levels: 0, sections: 0, lessons: 0, grammarTopics: 0, texts: 0 },
    };
  }

  const manifest = manifestResult.data;
  const levelIds = manifest.levels.map((level) => level.id);
  const sectionIds = manifest.levels.flatMap((level) =>
    level.sections.map((section) => section.id),
  );

  checkDuplicates(levelIds, manifestFile, 'levels', 'уровня', errors);
  checkDuplicates(sectionIds, manifestFile, 'levels.sections', 'раздела', errors);
  checkDuplicates(manifest.grammar, manifestFile, 'grammar', 'грамматической темы', errors);
  checkDuplicates(manifest.texts, manifestFile, 'texts', 'текста', errors);

  const grammar = new Map<string, GrammarTopic>();
  for (const grammarId of manifest.grammar) {
    const relativePath = `content/ja/${GRAMMAR_DIR}/${grammarId}.json`;
    const raw = readJson(rootDir, relativePath, errors);
    if (!raw) {
      continue;
    }

    const result = GrammarTopicSchema.safeParse(raw);
    if (!result.success) {
      errors.push(...formatZodError(relativePath, result.error));
      continue;
    }

    if (result.data.id !== grammarId) {
      errors.push({
        severity: 'error',
        file: relativePath,
        path: 'id',
        message: `ID "${result.data.id}" не совпадает с манифестом "${grammarId}"`,
      });
    }
    if (result.data.language !== manifest.language) {
      errors.push({
        severity: 'error',
        file: relativePath,
        path: 'language',
        message: `Язык "${result.data.language}" не совпадает с манифестом "${manifest.language}"`,
      });
    }

    grammar.set(grammarId, result.data);
  }

  const texts = new Map<string, ReadingText>();
  for (const textId of manifest.texts) {
    const relativePath = `content/ja/${TEXTS_DIR}/${textId}.json`;
    const raw = readJson(rootDir, relativePath, errors);
    if (!raw) {
      continue;
    }

    const result = ReadingTextSchema.safeParse(raw);
    if (!result.success) {
      errors.push(...formatZodError(relativePath, result.error));
      continue;
    }

    if (result.data.id !== textId) {
      errors.push({
        severity: 'error',
        file: relativePath,
        path: 'id',
        message: `ID "${result.data.id}" не совпадает с манифестом "${textId}"`,
      });
    }
    if (result.data.language !== manifest.language) {
      errors.push({
        severity: 'error',
        file: relativePath,
        path: 'language',
        message: `Язык "${result.data.language}" не совпадает с манифестом "${manifest.language}"`,
      });
    }

    texts.set(textId, result.data);
  }

  const lessons = new Map<string, Lesson>();
  const referencedLessonIds: string[] = [];
  let sectionCount = 0;

  for (const level of manifest.levels) {
    if (level.sections.length === 0) {
      warnings.push({
        severity: 'warning',
        file: manifestFile,
        path: `levels.${level.id}`,
        message: `Уровень ${level.code} без разделов`,
      });
    }

    for (const section of level.sections) {
      sectionCount += 1;
      if (section.lessons.length === 0) {
        warnings.push({
          severity: 'warning',
          file: manifestFile,
          path: `levels.${level.id}.sections.${section.id}`,
          message: 'Раздел без уроков',
        });
      }

      const localLessonIds = new Set<string>();
      for (const lessonId of section.lessons) {
        if (localLessonIds.has(lessonId)) {
          errors.push({
            severity: 'error',
            file: manifestFile,
            path: `levels.${level.id}.sections.${section.id}.lessons`,
            message: `Дубликат урока в разделе: ${lessonId}`,
          });
        }
        localLessonIds.add(lessonId);

        if (referencedLessonIds.includes(lessonId)) {
          errors.push({
            severity: 'error',
            file: manifestFile,
            path: `levels.${level.id}.sections.${section.id}.lessons`,
            message: `Урок ${lessonId} уже привязан к другому разделу`,
          });
        }
        referencedLessonIds.push(lessonId);

        const relativePath = `content/ja/${LESSONS_DIR}/${lessonId}.json`;
        const raw = readJson(rootDir, relativePath, errors);
        if (!raw) {
          continue;
        }

        const result = LessonSchema.safeParse(raw);
        if (!result.success) {
          errors.push(...formatZodError(relativePath, result.error));
          continue;
        }

        if (result.data.id !== lessonId) {
          errors.push({
            severity: 'error',
            file: relativePath,
            path: 'id',
            message: `ID "${result.data.id}" не совпадает с манифестом "${lessonId}"`,
          });
        }
        if (result.data.language !== manifest.language) {
          errors.push({
            severity: 'error',
            file: relativePath,
            path: 'language',
            message: `Язык "${result.data.language}" не совпадает с манифестом "${manifest.language}"`,
          });
        }

        validateLesson(
          result.data,
          level.code,
          relativePath,
          grammar,
          texts,
          errors,
        );
        lessons.set(lessonId, result.data);
      }
    }
  }

  const knownLessons = new Set(referencedLessonIds);
  for (const fileId of listJsonIds(path.join(contentDir, LESSONS_DIR))) {
    if (!knownLessons.has(fileId)) {
      warnings.push({
        severity: 'warning',
        file: `content/ja/${LESSONS_DIR}/${fileId}.json`,
        path: '',
        message: 'Файл урока не привязан к манифесту',
      });
    }
  }

  const knownGrammar = new Set(manifest.grammar);
  for (const fileId of listJsonIds(path.join(contentDir, GRAMMAR_DIR))) {
    if (!knownGrammar.has(fileId)) {
      warnings.push({
        severity: 'warning',
        file: `content/ja/${GRAMMAR_DIR}/${fileId}.json`,
        path: '',
        message: 'Файл грамматики не привязан к манифесту',
      });
    }
  }

  const knownTexts = new Set(manifest.texts);
  for (const fileId of listJsonIds(path.join(contentDir, TEXTS_DIR))) {
    if (!knownTexts.has(fileId)) {
      warnings.push({
        severity: 'warning',
        file: `content/ja/${TEXTS_DIR}/${fileId}.json`,
        path: '',
        message: 'Файл текста не привязан к манифесту',
      });
    }
  }

  const result: ValidationResult = {
    ok: errors.length === 0,
    errors,
    warnings,
    stats: {
      levels: manifest.levels.length,
      sections: sectionCount,
      lessons: lessons.size,
      grammarTopics: grammar.size,
      texts: texts.size,
    },
  };

  if (result.ok && options.writeIndex !== false) {
    writeContentIndex(contentDir, { manifest, lessons, grammar, texts }, errors);
    result.ok = errors.length === 0;
  }

  return result;
}

export function printValidationResult(result: ValidationResult): void {
  for (const warning of result.warnings) {
    console.warn(
      `warn  ${warning.file}${warning.path ? `:${warning.path}` : ''} — ${warning.message}`,
    );
  }

  for (const error of result.errors) {
    console.error(
      `error ${error.file}${error.path ? `:${error.path}` : ''} — ${error.message}`,
    );
  }

  console.log(
    `\nУровней: ${result.stats.levels}, разделов: ${result.stats.sections}, ` +
      `уроков: ${result.stats.lessons}, грамматики: ${result.stats.grammarTopics}, ` +
      `текстов: ${result.stats.texts}`,
  );

  if (result.ok) {
    console.log(`Контент валиден${result.warnings.length ? ' (с предупреждениями)' : ''}.`);
  } else {
    console.error(`Найдено ошибок: ${result.errors.length}.`);
  }
}

export function sectionOptions(manifest: CourseManifest): Array<{
  levelId: string;
  levelCode: string;
  section: CourseSection;
}> {
  return manifest.levels.flatMap((level) =>
    level.sections.map((section) => ({
      levelId: level.id,
      levelCode: level.code,
      section,
    })),
  );
}
