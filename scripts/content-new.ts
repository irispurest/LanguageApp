import fs from 'node:fs';
import path from 'node:path';
import {
  IdSchema,
  ManifestSchema,
  type GrammarTopic,
  type Lesson,
} from '../src/core/content/schemas';
import { printValidationResult, validateContentProject } from './lib/validate-content';

function fail(message: string): never {
  console.error(`Ошибка: ${message}`);
  process.exit(1);
}

function parseArgs(argv: string[]): Record<string, string> {
  const args: Record<string, string> = {};

  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];
    if (!item.startsWith('--')) {
      continue;
    }

    const key = item.slice(2);
    const next = argv[index + 1];
    if (next && !next.startsWith('--')) {
      args[key] = next;
      index += 1;
    } else {
      args[key] = 'true';
    }
  }

  return args;
}

function slugify(value: string): string {
  return value
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function bumpPatch(version: string): string {
  const [major, minor, patch] = version.split('.').map(Number);
  return `${major}.${minor}.${patch + 1}`;
}

function writeJson(filePath: string, value: unknown): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

const args = parseArgs(process.argv.slice(2));
const title = args.title?.trim();
const type = args.type ?? 'grammar';
const levelArg = (args.level ?? 'n5').toLowerCase();
const dryRun = args['dry-run'] === 'true';
const courseId = args.course?.trim() || 'ja-ru';
const contentDir = path.join(process.cwd(), 'content', courseId);
const manifestPath = path.join(contentDir, 'manifest.json');

if (!title) {
  fail('нужен --title "Название урока"');
}

if (type !== 'grammar') {
  fail(
    'CLI пока создаёт только grammar-уроки. Схемы vocabulary/text уже есть, ' +
      'их шаблоны добавим после словаря и текстов.',
  );
}

const rawManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as unknown;
const manifestResult = ManifestSchema.safeParse(rawManifest);

if (!manifestResult.success) {
  fail(
    `манифест невалиден:\n${manifestResult.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join('\n')}`,
  );
}

const manifest = manifestResult.data;

if (manifest.courseId !== courseId) {
  fail(`courseId в манифесте "${manifest.courseId}" не совпадает с --course "${courseId}"`);
}

const level = manifest.levels.find(
  (item) => item.id === levelArg || item.code.toLowerCase() === levelArg,
);

if (!level) {
  fail(
    `уровень "${levelArg}" не найден. Доступны: ${manifest.levels
      .map((item) => `${item.code} (${item.id})`)
      .join(', ')}`,
  );
}

const section = args.section
  ? level.sections.find((item) => item.id === args.section)
  : level.sections.length === 1
    ? level.sections[0]
    : undefined;

if (!section) {
  fail(
    `раздел не найден. Укажи --section. В уровне ${level.code}: ${
      level.sections.map((item) => item.id).join(', ') || 'разделов нет'
    }`,
  );
}

const slug = slugify(title);
const explicitId = args.id?.trim();
const baseId =
  explicitId ??
  (slug.length >= 3 ? `${manifest.courseId}-${level.code.toLowerCase()}-${slug}` : undefined);

if (!baseId) {
  fail('не удалось построить ID из названия. Укажи --id в латинице, например ja-n5-wa-ga');
}

const idResult = IdSchema.safeParse(baseId);
if (!idResult.success) {
  fail(`некорректный --id: ${idResult.error.issues[0]?.message ?? 'неизвестная ошибка'}`);
}

if (
  section.lessons.includes(baseId) ||
  fs.existsSync(path.join(contentDir, 'lessons', `${baseId}.json`))
) {
  fail(`урок "${baseId}" уже существует`);
}

const grammarId = args['grammar-id']?.trim() || `${baseId}-grammar`;
const grammarIdResult = IdSchema.safeParse(grammarId);
if (!grammarIdResult.success) {
  fail(
    `некорректный --grammar-id: ${
      grammarIdResult.error.issues[0]?.message ?? 'неизвестная ошибка'
    }`,
  );
}

if (
  manifest.grammar.includes(grammarId) ||
  fs.existsSync(path.join(contentDir, 'grammar', `${grammarId}.json`))
) {
  fail(`грамматическая тема "${grammarId}" уже существует`);
}

const grammarTopic: GrammarTopic = {
  schemaVersion: 1,
  id: grammarId,
  courseId: manifest.courseId,
  level: level.code,
  title,
  summary: 'Черновая тема: заполнить краткое объяснение.',
  blocks: [
    {
      type: 'paragraph',
      text: 'TODO: объяснение грамматической темы.',
    },
    {
      type: 'example',
      japanese: '私は学生です。',
      reading: 'わたしはがくせいです。',
      translation: 'Я студент.',
    },
  ],
};

const lesson: Lesson = {
  schemaVersion: 1,
  id: baseId,
  type: 'grammar',
  courseId: manifest.courseId,
  level: level.code,
  title,
  subtitle: 'Черновой урок',
  objective: 'TODO: цель урока.',
  grammarPointIds: [grammarId],
  estimatedMinutes: 5,
  tags: ['draft'],
  blocks: [
    {
      type: 'paragraph',
      text: 'TODO: объяснение урока.',
    },
    {
      type: 'example',
      japanese: '私は学生です。',
      reading: 'わたしはがくせいです。',
      translation: 'Я студент.',
    },
  ],
  exercises: [
    {
      id: `${baseId}-ex-01`,
      type: 'multiple_choice',
      prompt: 'Выбери правильный вариант.',
      question: '私は学生___。',
      options: ['です', 'ます', 'だ'],
      correctIndex: 0,
      explanation: 'TODO: объяснение ответа.',
    },
  ],
};

manifest.grammar.push(grammarId);
section.lessons.push(baseId);
manifest.packVersion = bumpPatch(manifest.packVersion);

if (dryRun) {
  console.log(`[dry-run] Будет создан урок: ${baseId}`);
  console.log(`[dry-run] Грамматика: ${grammarId}`);
  console.log(`[dry-run] Раздел: ${level.code} / ${section.id}`);
  console.log(`[dry-run] packVersion: ${manifest.packVersion}`);
  process.exit(0);
}

writeJson(path.join(contentDir, 'grammar', `${grammarId}.json`), grammarTopic);
writeJson(path.join(contentDir, 'lessons', `${baseId}.json`), lesson);
writeJson(manifestPath, manifest);

console.log(`Создан урок: ${baseId}`);
console.log(`Создана грамматическая тема: ${grammarId}`);
console.log(`Добавлено в раздел: ${level.code} / ${section.id}`);
console.log(`packVersion: ${manifest.packVersion}`);

const result = validateContentProject(process.cwd(), { courseId });
printValidationResult(result);
process.exit(result.ok ? 0 : 1);
