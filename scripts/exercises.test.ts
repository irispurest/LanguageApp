import assert from 'node:assert/strict';
import test from 'node:test';
import type { ClozeExercise, MultipleChoiceExercise, OrderingExercise } from '../src/core/content/schemas';
import { checkExercise, isAnswerComplete, normalizeAnswer } from '../src/core/exercises/check';

const multipleChoice: MultipleChoiceExercise = {
  id: 'ex-mc',
  type: 'multiple_choice',
  prompt: 'Выбери вариант.',
  question: '私は学生___。',
  options: ['は', 'が'],
  correctIndex: 0,
  explanation: 'Тема.',
};

const cloze: ClozeExercise = {
  id: 'ex-cloze',
  type: 'cloze',
  prompt: 'Вставь частицу.',
  sentence: '私{{blank}}学生です。',
  bank: ['は', 'が'],
  correctAnswers: ['は'],
  explanation: 'Тема.',
};

const ordering: OrderingExercise = {
  id: 'ex-ordering',
  type: 'ordering',
  prompt: 'Собери предложение.',
  tokens: ['私', 'は', '学生', 'です'],
  correctOrder: [0, 1, 2, 3],
  explanation: 'Порядок.',
};

test('multiple_choice проверяет индекс', () => {
  assert.equal(checkExercise(multipleChoice, { type: 'multiple_choice', index: 0 }), true);
  assert.equal(checkExercise(multipleChoice, { type: 'multiple_choice', index: 1 }), false);
});

test('cloze нормализует ответ', () => {
  assert.equal(checkExercise(cloze, { type: 'cloze', value: ' は ' }), true);
  assert.equal(normalizeAnswer(' は '), 'は');
  assert.equal(checkExercise(cloze, { type: 'cloze', value: 'が' }), false);
});

test('ordering сравнивает последовательность', () => {
  assert.equal(checkExercise(ordering, { type: 'ordering', order: [0, 1, 2, 3] }), true);
  assert.equal(checkExercise(ordering, { type: 'ordering', order: [0, 2, 1, 3] }), false);
});

test('isAnswerComplete требует полный ответ', () => {
  assert.equal(isAnswerComplete(multipleChoice, null), false);
  assert.equal(isAnswerComplete(multipleChoice, { type: 'multiple_choice', index: 0 }), true);
  assert.equal(isAnswerComplete(ordering, { type: 'ordering', order: [0, 1] }), false);
  assert.equal(isAnswerComplete(ordering, { type: 'ordering', order: [0, 1, 2, 3] }), true);
});
