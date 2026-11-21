import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { LessonSchema, ReadingTextSchema } from '../src/core/content/schemas';
import { validateContentProject } from './lib/validate-content';

const baseLesson = {
  schemaVersion: 1,
  id: 'ja-ru-n5-test',
  type: 'grammar',
  courseId: 'ja-ru',
  level: 'N5',
  title: 'Тестовый урок',
  objective: 'Проверка схемы.',
  grammarPointIds: ['ja-ru-grammar-test'],
  blocks: [{ type: 'paragraph', text: 'Текст.' }],
  exercises: [
    {
      id: 'ja-ru-n5-test-ex-01',
      type: 'multiple_choice',
      prompt: 'Выбери вариант.',
      question: '私は学生___。',
      options: ['です', 'ます'],
      correctIndex: 0,
      explanation: 'Пояснение.',
    },
  ],
};

test('текущий контент проходит валидацию', () => {
  const result = validateContentProject(process.cwd(), { writeIndex: false });
  assert.equal(
    result.errors.length,
    0,
    result.errors.map((error) => `${error.file}:${error.path} ${error.message}`).join('\n'),
  );
  assert.equal(result.stats.lessons, 1);
});

test('multiple_choice требует минимум два варианта', () => {
  const lesson = {
    ...baseLesson,
    exercises: [
      {
        ...baseLesson.exercises[0],
        options: ['です'],
      },
    ],
  };

  const result = LessonSchema.safeParse(lesson);
  assert.equal(result.success, false);
});

test('текст проверяет совпадение токенов с body', () => {
  const file = path.join(
    process.cwd(),
    'content',
    'ja-ru',
    'texts',
    'ja-ru-n5-self-intro.json',
  );
  const text = JSON.parse(fs.readFileSync(file, 'utf8')) as {
    tokens: Array<{ surface: string }>;
  };

  text.tokens[0].surface = '間';

  const result = ReadingTextSchema.safeParse({
    ...JSON.parse(fs.readFileSync(file, 'utf8')),
    tokens: text.tokens,
  });

  assert.equal(result.success, false);
});
