# Отчёт: Staging E2E Test Harness

**Дата:** 5 декабря 2025
**Ветка:** `add_baseline_view`
**Обновлено:** 5 декабря 2025 — добавлена категоризация тестов

---

## 1. Выполненная работа

### 1.1 Создание отдельной папки e2e-staging

Staging тесты были вынесены в отдельную папку `e2e-staging/` для изоляции от основных E2E тестов. Это решило проблему конфликта портов (ERR_CONNECTION_REFUSED на порту 5252) при запуске обычных тестов.

**Структура:**
```
e2e-staging/
├── playwright.config.ts      # Конфигурация Playwright для staging
├── package.json              # Зависимости (playwright-bdd, dotenv, got-cjs, form-data)
├── tsconfig.json             # TypeScript конфигурация
├── .env.example              # Пример переменных окружения
├── support/
│   ├── fixtures.ts           # BDD fixtures (test, Given, When, Then)
│   ├── logger.ts             # Простой логгер
│   ├── demo.steps.ts         # Шаги для демо-анонсов и пауз
│   └── staging-global-setup.ts  # Проверка доступности staging сервера
├── steps/
│   └── staging/
│       └── staging.steps.ts  # Все staging-специфичные шаги (~50 шагов)
└── features/
    ├── smoke/                # Smoke тесты
    ├── extended/             # Расширенные тесты
    ├── demo/                 # Демо-тесты
    └── maintenance/          # Тесты обслуживания
```

### 1.2 Демо-тесты

Созданы 3 демо-теста, иллюстрирующие проблемы staging окружения:

| Тест | Тег | Описание |
|------|-----|----------|
| Preview Visibility | `@problem-preview-visibility` | E2E тесты создают чеки с пустыми/мелкими изображениями — превью не видны на экране (66 элементов в DOM, но визуально пусто) |
| Data Pollution | `@problem-data-pollution` | База загрязнена E2E данными — при фильтрации по "E2E" видны тестовые данные среди production |
| API Creation | `@problem-api-creation` | Демонстрация создания чека через API, поиск в UI, cleanup |

**Команды запуска:**
```bash
# Все демо
cd /Users/a1/Projects/SYNGRISI_STAGE/packages/syngrisi/e2e-staging && npm run test:demo

# По отдельности
npx bddgen && npx playwright test --project demo --grep "preview"
npx bddgen && npx playwright test --project demo --grep "pollution"
npx bddgen && npx playwright test --project demo --grep "api-creation"
```

### 1.3 Интеграция с staging worktree

- Обновлён `scripts/staging/setup-staging.sh` — добавлена установка зависимостей e2e-staging
- Обновлена документация `docs/staging-testing.md` с конкретными путями и командами
- Тесты запускаются из staging worktree: `/Users/a1/Projects/SYNGRISI_STAGE/packages/syngrisi/e2e-staging`

### 1.4 API интеграция для создания чеков

Реализован полный цикл работы с чеками через API:
- `startSession` — создание тестовой сессии
- `createCheck` — создание чека с изображением (multipart form-data)
- `accept` — принятие чека (создание baseline)
- `delete` — удаление чека, baseline, test session

**Особенности:**
- API ключ хешируется SHA-512 (как в wdio driver)
- Используется `got-cjs` и `form-data` для multipart запросов
- Автоматический cleanup после тестов

### 1.5 Исправленные баги

| Проблема | Решение |
|----------|---------|
| `createBdd() should use 'test' extended from "playwright-bdd"` | Исправлен импорт в fixtures.ts: `test` из `playwright-bdd` |
| Missing step definitions | Добавлены шаги `I click element with locator` и `I fill into element with locator` |
| SKIP_DEMO_TESTS не работает | Нужно использовать `export SKIP_DEMO_TESTS=true` перед обеими командами |

---

## 2. Не выполнено

### 2.1 Smoke и Extended тесты

Smoke и extended тесты существуют в feature-файлах, но не были полностью протестированы в этой сессии. Фокус был на демо-тестах.

### 2.2 Maintenance тесты

Тесты обслуживания (cleanup tasks, database consistency) не реализованы — только заглушки в feature-файлах.

### 2.3 CI/CD интеграция

Не настроен автоматический запуск staging тестов в CI pipeline.

### 2.4 Параллельный запуск

Все staging тесты запускаются в 1 worker из-за зависимости от общего состояния базы.

---

## 3. Открытые вопросы

### 3.1 API Key для staging

В `.env` файле e2e-staging поле `STAGING_API_KEY` пустое. Для полноценной работы SDK тестов нужно:
- Получить API ключ из staging базы данных
- Или создать тестовый API ключ через admin интерфейс

**Текущий workaround:** используется значение `'123'` которое хешируется.

### 3.2 Синхронизация staging worktree

После каждого коммита в основной репозиторий нужно обновлять staging worktree:
```bash
cd /Users/a1/Projects/SYNGRISI_STAGE && git checkout <commit-hash>
```

Это ручной процесс, который может приводить к рассинхронизации.

### 3.3 Проблема с превью изображений

Демо-тест показывает 66 превью в DOM, но визуально они не видны. Причины:
- E2E тесты создают чеки с минимальными (1x1 пиксель) или пустыми изображениями
- Нет валидации размера изображения при создании чека

**Возможные решения:**
1. Добавить валидацию минимального размера изображения в API
2. Показывать placeholder для пустых/мелких превью
3. Помечать тестовые данные специальным флагом

### 3.4 Очистка тестовых данных

После запуска E2E тестов в staging базе остаются тестовые данные. Вопросы:
- Как отличить тестовые данные от production?
- Нужен ли автоматический cleanup по расписанию?
- Стоит ли использовать отдельный app/suite для E2E тестов?

### 3.5 Аутентификация в headless режиме

Демо-тесты работают в headed режиме (`headless: false`). При запуске в headless режиме возможны проблемы с:
- Cookie handling
- Session persistence
- Redirect после логина

---

## 4. Коммиты

| Hash | Описание |
|------|----------|
| `79c51bea` | feat(e2e): add staging test harness with demo tests |
| `62741176` | refactor(e2e): move staging tests to separate e2e-staging folder |
| `4d9b25e9` | feat(staging): add e2e-staging setup to staging script |
| `1c379234` | docs(staging): update staging-testing.md with e2e-staging commands |

---

## 5. Категоризация тестов (ОБНОВЛЕНИЕ)

Тесты разбиты на 3 категории по уровню воздействия на данные:

### 5.1 Read-only (@readonly) — 22 сценария
Только чтение данных, не модифицируют базу:
- `smoke/login.feature` — логин разными пользователями
- `smoke/check_operations.feature` — просмотр, фильтрация, навигация
- `extended/advanced_navigation.feature` — поиск, сортировка
- `extended/bulk_operations.feature` — скролл, обновление
- `extended/data_integrity.feature` — проверка заголовков
- `maintenance/cleanup_tasks.feature` — проверка доступа админа

### 5.2 Read-write (@readwrite) — 3 сценария
Модифицируют данные, но выполняют cleanup:
- `extended/check_lifecycle.feature` — создание, принятие, удаление чеков

### 5.3 Polluting (@polluting) — 3 сценария
Демо-тесты, загрязняющие базу (запускать последними):
- `demo/staging_problems_demo.feature` — демонстрация проблем

### 5.4 Скрипты запуска

```bash
# По отдельности
./scripts/staging/run-readonly-tests.sh
./scripts/staging/run-readwrite-tests.sh
./scripts/staging/run-polluting-tests.sh

# Полный цикл (в правильном порядке)
./scripts/staging/run-all-staging-tests.sh

# npm scripts
npm run staging:test:readonly
npm run staging:test:readwrite
npm run staging:test:polluting
npm run staging:test:all
```

### 5.5 TUI команды (Claude Code)
- `/staging-readonly` — запуск read-only тестов
- `/staging-readwrite` — запуск read-write тестов
- `/staging-polluting` — запуск polluting тестов
- `/staging-demo` — интерактивный запуск демо

---

## 6. Результаты тестирования (ОБНОВЛЕНИЕ)

```
═══════════════════════════════════════════════════════════════
  STAGING TEST SUITE - FULL CYCLE (5 декабря 2025)
═══════════════════════════════════════════════════════════════

PHASE 1: Read-only tests
  21 passed, 1 skipped (1.5m)

PHASE 2: Read-write tests
  3 passed (21s)

PHASE 3: Polluting tests
  3 passed (42s)

═══════════════════════════════════════════════════════════════
  ИТОГО: 27 passed, 0 failed, 1 skipped (~3m)
═══════════════════════════════════════════════════════════════
```

---

## 7. Решённые проблемы

| Проблема | Решение |
|----------|---------|
| API Key 401 Unauthorized | API ключ добавлен в production dump базы |
| Тесты загрязняют базу | Категоризация: polluting запускаются последними |
| Нет reset между прогонами | Скрипты делают reset перед каждой фазой |
| Второй пользователь | Добавлен reviewer2 (mvarabyova@exadel.com) |

---

## 8. Рекомендации

1. ~~Получить реальный API ключ~~ ✅ Добавлен в базу
2. **Добавить CI job** для запуска smoke тестов после деплоя на staging
3. **Реализовать автоматический cleanup** тестовых данных по тегу или времени создания
4. **Добавить валидацию изображений** — минимальный размер, непустое содержимое
5. ~~Документировать процесс~~ ✅ Добавлены скрипты и TUI команды
