# LanguageApp

Офлайн-приложение для изучения языков. Первый язык — японский: грамматика с упражнениями, личный словарь, тексты и интервальные повторения в одной среде.

Проект в активной разработке. Сейчас есть каркас приложения, навигация, тема, Zod-схемы контента, CLI и валидатор. Реальный урок `は`/`が`, SQLite-прогресс, словарь JMdict-rus и SRS ещё впереди.

## Стек

- React Native + Expo SDK 58
- TypeScript, strict
- Expo Router
- Zod для схем контента
- Node.js + `tsx` для контентных скриптов
- Планируется: `expo-sqlite`, FSRS (`ts-fsrs`), JMdict-rus, офлайн-словарь

## Быстрый старт

```bash
npm install
npx expo start --clear
```

Открой Expo Go на Android-телефоне и отсканируй QR. ПК и телефон должны быть в одной Wi-Fi-сети. Android Studio/JDK для Expo Go не нужны; iOS пока вне scope.

## Команды

```bash
npm start                    # Expo Dev Server
npm run typecheck            # TypeScript strict
npm run content:validate     # проверка course pack + генерация content/ja/index.ts
npm run test:content         # тесты схем и валидатора
npx expo-doctor              # проверка зависимостей/конфигурации
npx expo export --platform android  # smoke-test бандла
```

Создать новый grammar-урок:

```bash
npm run content:new -- \
  --type grammar \
  --level n5 \
  --section n5-particles \
  --title "Название урока" \
  --id ja-n5-my-lesson
```

Добавь `--dry-run`, чтобы посмотреть план без записи.

## Структура

```text
app/                 # маршруты Expo Router
src/features/        # экраны по фичам
src/ui/              # тема и переиспользуемые компоненты
src/i18n/            # русские строки
src/core/content/    # Zod-схемы контента
content/ja/          # manifest, lessons, grammar, texts
scripts/             # content:new, content:validate, тесты
docs/                # проектная документация
```

## Документация

- [`docs/README.md`](docs/README.md) — индекс документации.
- [`docs/01-product.md`](docs/01-product.md) — продукт и сценарии.
- [`docs/03-architecture.md`](docs/03-architecture.md) — архитектура.
- [`docs/05-course-packs.md`](docs/05-course-packs.md) — формат контента.
- [`docs/15-implementation-plan.md`](docs/15-implementation-plan.md) — пошаговый план.
- [`AGENTS.md`](AGENTS.md) — правила для агентов и текущие команды.

## Принципы

- Офлайн-first, без обязательного аккаунта.
- Короткие сессии, минимум лишних экранов.
- Контент — данные, а не JSX.
- Универсальное ядро, японская специфика — в адаптере.
- Android + Expo Go на первом этапе; iOS позже.

## Лицензии

Лицензия кода проекта пока не выбрана. Контент в `content/` помечен как `proprietary`. При добавлении JMdict/EDRDG потребуется атрибуция и соблюдение CC BY-SA 4.0; экран «Источники» появится на этапе словаря.
