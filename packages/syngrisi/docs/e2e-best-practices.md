# E2E Best Practices для Syngrisi

Общие принципы для BDD/E2E тестирования в проекте Syngrisi.
Применимы для всех Playwright-BDD тестов независимо от конкретного модуля.

---

## 1. Коммуникация важнее реализации

-   `.feature` файл — единый источник истины о поведении.
-   Сценарий должен быть понятен человеку без контекста кода.
-   Не используйте комментарии как замену ясных шагов.

## 2. Явные шаги и атомарность

-   Один шаг = одно действие или одна проверка.
-   Никакой скрытой бизнес-логики внутри шагов.
-   Никаких скрытых проверок в `When` шагах — все ожидания в `Then`.

```gherkin
# ❌ Скрытая логика
When I create a check  # внутри отправляет API и ждёт рендер

# ✅ Прозрачная логика
When I send check creation request with name "Main Page"
And I wait for check to appear in the list
Then the check with name "Main Page" should be visible
```

## 3. Явность важнее магии

-   Избегайте "умных" шагов с ветвлениями и скрытыми условиями.
-   Если поведение отличается по окружению — выделяйте отдельные сценарии.
-   Ошибки не должны замалчиваться; flaky тест — дефект теста.

```gherkin
# ✅ Явные сценарии с тегами
@visual
Scenario: Visual diff is displayed correctly

@api-only
Scenario: Check creation via API returns correct status

# ❌ Скрытая логика в шаге
When I verify the check  # внутри: if (hasBaseline) compare else create
```

## 4. DAMP в сценариях, DRY в коде

-   В Gherkin допускается повторение ради читаемости.
-   Переиспользование выносится в фикстуры/утилиты/page objects.
-   Логика циклов/ветвлений не должна появляться в шагах.

### Правила форматирования Gherkin

-   Один пробел между ключевым словом и текстом.
-   Не использовать кавычки в названиях Scenario и Feature.
-   Порядковые числительные: `1st`, `2nd`, `3rd` для индексов элементов.
-   Плейсхолдеры в угловых скобках: `<placeholder>`.

```gherkin
# ✅ Хорошо
Scenario Outline: User accepts check with status <status>

# ❌ Плохо
Scenario Outline: "User accepts check"
```

## 5. Разделение слоев

| Слой             | Ответственность           |
| ---------------- | ------------------------- |
| Gherkin          | Бизнес-намерение          |
| Step definitions | Тонкий слой связывания    |
| Фикстуры/утилиты | Механика взаимодействия   |
| Page Objects     | Локаторы и методы страниц |

### Переиспользуемость шагов

```gherkin
# ✅ Универсальный шаг
Then the element with testId "check-status" should contain text "passed"

# ❌ Узкоспециализированный шаг
Then the check status icon should be green checkmark
```

## 6. Детерминизм и стабильность

-   Не используйте `sleep` вместо ожидания условий.
-   Ожидайте конкретные состояния: видимость, доступность, текст.
-   Тесты не должны зависеть от порядка выполнения.

```gherkin
# ❌ Произвольный sleep
Then I wait 5 seconds

# ✅ Ожидание условия
Then the loading spinner should disappear
And the check list should be visible
```

## 7. Работа с данными

-   Каждый сценарий владеет своими данными.
-   Используйте уникальные имена: `Test_<timestamp>_<feature>`.
-   Секреты — только через `.env`, не в сценариях.
-   Очищайте тестовые данные после сценария (cleanup).

### Хардкод vs конфигурация

| Хардкодить когда           | Выносить в конфиг когда        |
| -------------------------- | ------------------------------ |
| Значение редко меняется    | Меняется между окружениями     |
| Используется в одном месте | Появляется в 2+ файлах         |
| Стабильный URL-путь        | Зависит от deploy-конфигурации |

## 8. Локаторы и доступность

Приоритет локаторов:

1. `data-testid` — для критичных элементов
2. `role` + accessible name
3. `label`
4. Text content

```typescript
// ✅ Стабильный локатор
page.getByTestId('accept-check-button');

// ❌ Хрупкий локатор
page.locator('.css-1a2b3c4 > div:nth-child(2) button');
```

## 9. Явные ожидания и наблюдаемые исходы

```gherkin
# ❌ Расплывчатый исход
Then the check comparison works correctly

# ✅ Конкретный исход
Then the diff image should be displayed
And the mismatch percentage should be "0.5%"
```

## 10. Теги для Syngrisi

| Тег           | Назначение                         |
| ------------- | ---------------------------------- |
| `@smoke`      | Критичные проверки для CI          |
| `@regression` | Полный набор                       |
| `@visual`     | Визуальные тесты                   |
| `@api`        | API-only сценарии                  |
| `@slow`       | Медленные тесты (отдельный запуск) |
| `@skip`       | Временно отключенные               |
| `@wip`        | В разработке                       |

## 11. Артефакты и наблюдаемость

При падении теста должны быть доступны:

-   Screenshot
-   Video (при необходимости)
-   Playwright Trace
-   Логи сервера

```bash
# Запуск с трейсами
npx playwright test --trace on
```

## 12. Визуальные проверки в Syngrisi

Syngrisi — инструмент для визуального тестирования. Рекомендации:

```gherkin
# ✅ Ожидание стабильного состояния перед снапшотом
Given the page is fully loaded
And all animations are complete
When I take a visual snapshot with name "Dashboard"
Then the snapshot should match the baseline

# ❌ Снапшот во время загрузки
When I take a visual snapshot with name "Dashboard"  # spinner ещё крутится
```

## 13. Работа с базой данных

-   Используйте seed-данные для предсказуемого начального состояния.
-   Изолируйте тестовые данные по `runId` или `testId`.
-   Очистка: удаляйте созданные checks/tests/runs после сценария.

## 14. Стабилизация интерфейса

-   Дожидайтесь исчезновения skeleton loaders.
-   Ожидайте завершения infinity scroll загрузок.
-   Стабилизируйте состояние перед assert.

```gherkin
Given the checks list is fully loaded
And the skeleton loaders have disappeared
```

## 15. CI/CD интеграция

-   Smoke тесты при каждом PR.
-   Полный regression ночью.
-   Используйте sharding для параллелизации.

```bash
# Только smoke
npx playwright-bdd test --tags @smoke

# Regression
npx playwright-bdd test --tags @regression
```

---

## Чек-лист перед коммитом теста

-   [ ] Сценарий понятен без чтения step definitions
-   [ ] Нет скрытой логики в When-шагах
-   [ ] Используются стабильные локаторы
-   [ ] Нет произвольных sleep/wait
-   [ ] Тестовые данные изолированы
-   [ ] Добавлены соответствующие теги
-   [ ] Тест работает локально минимум 3 раза подряд
