# 04. Модель данных

## Обзор

Данные делятся на три группы:
1. **Контент** — JSON course packs, не хранится в БД (только ссылки по ID).
2. **Пользовательские данные** — `user.db`, read/write: прогресс, карточки, журнал.
3. **Словарь** — `dictionary-ja-ru.db`, read-only asset: статьи и поисковый индекс.

## Идентификаторы и время

- ID контента — стабильные строки с префиксом курса: `ja-ru-n5-desu-masu`, `ja-ru-grammar-...`, `ja-ru-n5-self-intro`.
- ID словарной статьи — `jmdict_id` из JMdict (строка, например `1000040`), плюс внутренний `rowid` для FTS.
- ID карточек/колод — строки (UUID или стабильные составные ключи).
- Время — epoch milliseconds UTC (`INTEGER`). Локальное время — только для отображения и границы дня.
- `created_at`, `updated_at`, `reviewed_at` — обязательные поля для истории.

## `user.db`

### `lesson_progress`

| Поле | Тип | Описание |
|---|---|---|
| `course_id` | TEXT PK | ID курса (`ja-ru`) |
| `lesson_id` | TEXT PK | ID урока из course pack |
| `status` | TEXT | `not_started`, `in_progress`, `completed` |
| `score` | INTEGER | Правильных ответов |
| `total` | INTEGER | Всего упражнений |
| `attempts` | INTEGER | Количество проходов |
| `last_exercise_id` | TEXT | Для «продолжить» |
| `completed_at` | INTEGER | Время завершения |
| `updated_at` | INTEGER | Последнее изменение |

### `lesson_sessions`

| Поле | Тип | Описание |
|---|---|---|
| `id` | INTEGER PK | Автоинкремент |
| `course_id` | TEXT | Курс (`ja-ru`) |
| `lesson_id` | TEXT | Урок |
| `started_at` | INTEGER | Начало |
| `finished_at` | INTEGER | Конец, nullable |
| `score` | INTEGER | Итог |
| `total` | INTEGER | Всего |

### `exercise_attempts`

| Поле | Тип | Описание |
|---|---|---|
| `id` | INTEGER PK | Автоинкремент |
| `session_id` | INTEGER | Ссылка на сессию |
| `lesson_id` | TEXT | Урок |
| `exercise_id` | TEXT | Упражнение |
| `answer_json` | TEXT | Ответ пользователя |
| `is_correct` | INTEGER | 0/1 |
| `duration_ms` | INTEGER | Время ответа |
| `created_at` | INTEGER | Время |

### `decks`

| Поле | Тип | Описание |
|---|---|---|
| `id` | TEXT PK | ID колоды |
| `name` | TEXT | Название |
| `kind` | TEXT | `default`, `from_text`, `custom` |
| `created_at` | INTEGER | Создана |
| `updated_at` | INTEGER | Обновлена |

В MVP достаточно одной дефолтной колоды, но схема поддерживает несколько.

### `cards`

| Поле | Тип | Описание |
|---|---|---|
| `id` | TEXT PK | ID карточки |
| `course_id` | TEXT | Курс-источник (`ja-ru`) |
| `deck_id` | TEXT FK | Колода |
| `kind` | TEXT | `vocab`, `grammar` |
| `dictionary_entry_id` | TEXT | `jmdict_id`, nullable для грамматики |
| `grammar_point_id` | TEXT | ID грамматической точки, nullable |
| `prompt_type` | TEXT | `jp_to_ru`, `ru_to_jp`, `reading`, `grammar` |
| `front` | TEXT | Снимок лицевой стороны |
| `back` | TEXT | Снимок обратной стороны |
| `reading` | TEXT | Снимок чтения |
| `source` | TEXT | `dictionary`, `text`, `lesson`, `manual` |
| `source_lesson_id` | TEXT | Урок-источник, nullable |
| `level` | TEXT | N5/N4/N3/`null` для ручных слов |
| `context_text_id` | TEXT | Текст-источник |
| `context_token_index` | INTEGER | Позиция токена |
| `context_sentence` | TEXT | Предложение-контекст |
| `suspended` | INTEGER | 0/1 |
| `created_at` | INTEGER | Создана |
| `updated_at` | INTEGER | Обновлена |

Уникальность:
- для `vocab`: `(dictionary_entry_id, prompt_type)`;
- для `grammar`: `(grammar_point_id, prompt_type)`.

Снимки `front/back/reading` нужны, чтобы карточка не ломалась при обновлении словаря. Обновление снимка — отдельное действие.

Личный словарь — это `cards` с `kind = 'vocab'`, сгруппированные по `dictionary_entry_id`. Прогресс слова вычисляется из `card_srs`, а не хранится отдельно.

### `card_srs`

| Поле | Тип | Описание |
|---|---|---|
| `card_id` | TEXT PK FK | Карточка |
| `state` | INTEGER | Состояние FSRS |
| `due` | INTEGER | Следующий показ |
| `stability` | REAL | Стабильность |
| `difficulty` | REAL | Сложность |
| `elapsed_days` | INTEGER | Прошло дней |
| `scheduled_days` | INTEGER | Запланировано дней |
| `reps` | INTEGER | Повторений |
| `lapses` | INTEGER | Провалов |
| `last_review` | INTEGER | Последний ответ |
| `learning_steps` | INTEGER | Шаг обучения, если используется |

Точный набор полей синхронизируется с версией `ts-fsrs`. Версия библиотеки фиксируется в `package.json`.

### `review_logs`

| Поле | Тип | Описание |
|---|---|---|
| `id` | INTEGER PK | Автоинкремент |
| `card_id` | TEXT | Карточка |
| `rating` | INTEGER | Again/Hard/Good/Easy |
| `state_before` | INTEGER | Состояние до |
| `state_after` | INTEGER | Состояние после |
| `due_before` | INTEGER | Срок до |
| `due_after` | INTEGER | Срок после |
| `stability_before` | REAL | Стабильность до |
| `stability_after` | REAL | После |
| `difficulty_before` | REAL | Сложность до |
| `difficulty_after` | REAL | После |
| `elapsed_days` | INTEGER | Прошло |
| `scheduled_days` | INTEGER | Запланировано |
| `duration_ms` | INTEGER | Время ответа |
| `reviewed_at` | INTEGER | Время |

Журнал не редактируется. Он нужен для статистики и будущей оптимизации параметров FSRS.

### `grammar_progress`

| Поле | Тип | Описание |
|---|---|---|
| `course_id` | TEXT PK | ID курса (`ja-ru`) |
| `grammar_point_id` | TEXT PK | ID грамматической темы |
| `status` | TEXT | `learned` / `not_started` |
| `source` | TEXT | `lesson` / `manual` |
| `last_lesson_id` | TEXT | Урок, который отметил тему |
| `updated_at` | INTEGER | Обновлено |

### `text_progress`

| Поле | Тип | Описание |
|---|---|---|
| `course_id` | TEXT PK | ID курса (`ja-ru`) |
| `text_id` | TEXT PK | ID текста |
| `last_token_index` | INTEGER | Позиция чтения |
| `completed` | INTEGER | 0/1 |
| `updated_at` | INTEGER | Обновлено |

### `settings`

| Поле | Тип | Описание |
|---|---|---|
| `key` | TEXT PK | Настройка |
| `value` | TEXT | JSON/строка |

Примеры: `furigana_enabled`, `theme`, `active_course_id` (`ja-ru`), `last_active_lesson_id`.

### Служебные таблицы

- `app_meta(key, value)` — версия контента, версия словаря, флаги.
- `PRAGMA user_version` — версия схемы `user.db`.

## `dictionary-ja-ru.db`

### `metadata`

| Поле | Тип | Описание |
|---|---|---|
| `key` | TEXT PK | `source`, `source_version`, `dict_date`, `license`, `built_at`, `entry_count` |
| `value` | TEXT | Значение |

### `entries`

| Поле | Тип | Описание |
|---|---|---|
| `rowid` | INTEGER PK | Внутренний ID для FTS |
| `jmdict_id` | TEXT UNIQUE | Стабильный ID JMdict |
| `is_common` | INTEGER | Есть common-пометка |

### `entry_kanji`

| Поле | Тип | Описание |
|---|---|---|
| `entry_rowid` | INTEGER FK | Статья |
| `idx` | INTEGER | Порядок |
| `text` | TEXT | Написание |
| `common` | INTEGER | 0/1 |
| `tags_json` | TEXT | Теги |

PK: `(entry_rowid, idx)`.

### `entry_kana`

| Поле | Тип | Описание |
|---|---|---|
| `entry_rowid` | INTEGER FK | Статья |
| `idx` | INTEGER | Порядок |
| `text` | TEXT | Чтение |
| `common` | INTEGER | 0/1 |
| `tags_json` | TEXT | Теги |
| `applies_to_kanji_json` | TEXT | К каким написаниям относится |

PK: `(entry_rowid, idx)`.

### `entry_senses`

| Поле | Тип | Описание |
|---|---|---|
| `entry_rowid` | INTEGER FK | Статья |
| `idx` | INTEGER | Номер значения |
| `pos_json` | TEXT | Части речи |
| `misc_json` | TEXT | Пометки |
| `field_json` | TEXT | Область |
| `dialect_json` | TEXT | Диалект |
| `info_json` | TEXT | Доп. информация |

PK: `(entry_rowid, idx)`.

### `entry_glosses`

| Поле | Тип | Описание |
|---|---|---|
| `entry_rowid` | INTEGER FK | Статья |
| `sense_idx` | INTEGER | Значение |
| `gloss_idx` | INTEGER | Порядок |
| `lang` | TEXT | `rus` |
| `text` | TEXT | Перевод |
| `type` | TEXT | Тип глоссы, nullable |
| `gender` | TEXT | Род, nullable |

PK: `(entry_rowid, sense_idx, gloss_idx)`.

### `entry_fts`

FTS5-таблица для поиска:
- колонки: `kanji`, `kana`, `glosses`;
- `rowid` = `entries.rowid`;
- токенизатор: `trigram`;
- contentless (словарь read-only, обновляется только пересборкой).

Поиск:
1. Точное совпадение по `entry_kanji.text` / `entry_kana.text`.
2. Префикс по кане/кандзи.
3. FTS5 по смешанному тексту.
4. Для запросов короче 3 символов — fallback на `LIKE` (trigram не индексирует короткие подстроки).
5. Сортировка: точное совпадение → common → rank.

### Индексы

- `entry_kanji(text)`, `entry_kana(text)`;
- `entry_glosses(text)` для fallback;
- `entries(is_common)`;
- FTS5 `entry_fts`.

## Инварианты

1. `dictionary-ja-ru.db` никогда не пишется из приложения.
2. `user.db` не содержит копию всего словаря, только снимки карточек.
3. Прогресс ссылается на стабильные ID контента; переименование ID — запрещено.
4. Review log неизменяем.
5. Все записи, меняющие несколько таблиц, — в транзакции.
6. `PRAGMA foreign_keys = ON`; `PRAGMA journal_mode = WAL`.
7. Миграции — только вперёд; старые миграции не редактируются.
8. Контент, который исчез из пака, не удаляет историю; прогресс остаётся, урок помечается архивным.

## Миграции

- `user.db`: `PRAGMA user_version` + последовательные SQL-миграции.
- Каждая миграция идемпотентна в рамках своей версии.
- Перед миграцией не удалять данные; при ошибке — откат транзакции.
- `dictionary-ja-ru.db` версионируется отдельно через `metadata.source_version` и пересобирается с нуля.
- Course packs версионируются `schemaVersion`/`packVersion`; несовместимость обнаруживается загрузчиком.

### Замечание по `expo-sqlite`

`withTransactionAsync` включает в транзакцию все запросы, которые выполняются, пока она активна. Держи область транзакции узкой и не запускай параллельные записи. Для миграций/эксклюзивных операций проверь поведение `withExclusiveTransactionAsync` и foreign keys отдельно.

## Экспорт

Позже: JSON-экспорт `user.db` (прогресс, карточки, настройки) и импорт с проверкой версии. Словарь не экспортируется — он восстанавливается из источника.
