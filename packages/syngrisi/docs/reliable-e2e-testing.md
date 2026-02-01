# Reliable E2E Testing — Syngrisi

**Version:** 1.0.0  
**Last Updated:** January 14, 2026

Принципы надёжного E2E тестирования, адаптированные для visual testing платформы Syngrisi.

---

## Золотые правила

1. **Никогда не проверяйте существование элемента — проверяйте наблюдаемое поведение.**  
   Наличие элемента не доказывает работоспособность. Проверяйте фактический output.

2. **Для динамических систем: используйте изменяющийся контент, не статику.**  
   Статичные данные могут давать одинаковые скриншоты, маскируя баги.

3. **Всегда ждите распространения изменений перед проверкой.**  
   Асинхронным системам нужно время для прохождения всех слоёв.

---

## Паттерн Capture-Change-Verify

Основной паттерн для проверки изменений:

1. **Capture**: Зафиксировать начальное состояние
2. **Change**: Выполнить действие
3. **Verify**: Убедиться что состояние изменилось

```gherkin
# Step 1: Capture baseline
When I capture the current check status

# Step 2: Make change
And I accept the check

# Step 3: Verify observable output changed
Then the check status should change from "failed" to "passed"
```

### Почему это работает

Традиционная проверка:

```gherkin
# ❌ НЕ ПОЛНО: не доказывает что система отреагировала
When I accept the check
Then the check status should be "passed"
```

**Проблема:** Тест пройдёт если:

-   Чек уже был passed до действия
-   Действие не сработало, но статус случайно правильный

Capture-Change-Verify доказывает причинно-следственную связь:

```gherkin
# ✅ ПОЛНО: доказывает что действие вызвало изменение
Given the check is in status "failed"
When I accept the check
Then the status should transition from "failed" to "passed"
```

---

## Observable State Verification

**Принцип:** Проверяйте наблюдаемое изменение состояния, а не свойства элементов.

Вместо:

-   "Кнопка существует"
-   "Список имеет элементы"
-   "Модал видимый"

Проверяйте:

-   Конкретные данные появились на экране
-   Output отражает input/действие
-   Состояние изменилось измеримым образом

### Примеры для Syngrisi

```gherkin
# ❌ ПЛОХО: только проверка DOM структуры
Then the check card element should exist

# ✅ ХОРОШО: проверка фактических данных
Then the check card should display name "Main Page"
And the check status should be "passed"
And the mismatch should be "0.00%"
```

```gherkin
# ❌ ПЛОХО: не проверяет содержимое
Then the diff image should be visible

# ✅ ХОРОШО: проверяет реальное содержимое
Then the diff image should be displayed
And the diff image should have non-zero dimensions
And the highlighted diff regions should be visible
```

---

## Visual Testing специфика

### Стабилизация перед скриншотом

```gherkin
# ✅ ХОРОШО: стабильное состояние
Given the page is fully loaded
And all skeleton loaders have disappeared
And animations are complete
When I take a visual snapshot

# ❌ ПЛОХО: скриншот во время загрузки
When I take a visual snapshot  # spinner ещё крутится
```

### Работа с Diff изображениями

```gherkin
Scenario: Verify diff image shows actual differences
  Given I have a check with status "failed"
  When I view the check details
  Then the diff image should be displayed
  And the diff regions should highlight differences
```

---

## Таблицы рекомендаций

### Времена ожидания

| Операция                    | Рекомендуемое ожидание | Причина                |
| --------------------------- | ---------------------- | ---------------------- |
| Простое изменение состояния | 100-300ms              | Локальный рендеринг    |
| Network request             | 500-1000ms             | API call + response    |
| Загрузка изображений        | 1-2 секунды            | Download + decode      |
| Сложный рендеринг           | 2-3 секунды            | Тяжёлые вычисления     |
| Сравнение изображений       | 1-3 секунды            | Server-side processing |

### Эффективность техник

| Техника                | Что ловит            | Надёжность       |
| ---------------------- | -------------------- | ---------------- |
| Check element exists   | Ничего значимого     | ❌ Низкая        |
| Verify specific text   | Неправильный контент | ⚠️ Средняя       |
| Verify data attributes | Data binding issues  | ✅ Высокая       |
| Capture-change-verify  | Stale state          | ✅ Очень высокая |
| Visual snapshot        | Визуальные регрессии | ✅ Высокая       |

---

## Анти-паттерны

| Анти-паттерн                           | Почему плохо                    | Альтернатива                |
| -------------------------------------- | ------------------------------- | --------------------------- |
| Проверка существования элемента        | Не доказывает функциональность  | Проверять observable output |
| Фиксированные координаты в assertions  | Хрупко к изменениям             | Проверять consistency       |
| Статичный контент для change detection | Может дать одинаковые скриншоты | Динамический контент        |
| Пропуск ожидания propagation           | Race conditions                 | Wait for state changes      |
| Hardcode ожидаемых значений            | Хрупко к minor changes          | Capture and compare         |

---

## Чек-лист надёжного теста

### Дизайн теста

-   [ ] Тест выполняет наблюдаемое действие
-   [ ] Тест проверяет что observable output изменился
-   [ ] Тест утверждает что изменение ожидаемое
-   [ ] Тест использует локальный/контролируемый контент
-   [ ] Тест использует высококонтрастные, различимые состояния
-   [ ] Тест независим (не зависит от других тестов)

### Реализация

-   [ ] Используются подходящие tolerance для сравнений
-   [ ] Есть wait после async операций
-   [ ] Данные теста семантически понятны
-   [ ] Есть детальное логирование для debug
-   [ ] Учтён letterboxing для scaled контента

### Надёжность

-   [ ] Тест не зависит от фиксированных координат
-   [ ] Тест не проверяет только element existence
-   [ ] Тест проверяет end-to-end flow
-   [ ] Тест обрабатывает graceful degradation

---

## Диагностика проблем

### Тест проходит, но фича сломана (False Positive)

**Причина:** Проверка surface properties вместо observable behavior

**Решение:**

-   Проверять actual output, не existence
-   Использовать Capture-Change-Verify
-   Проверять полный code path

### Тест падает, но фича работает (False Negative)

**Причина:**

-   Fixed coordinate assertions
-   Недостаточное wait time
-   Слишком strict tolerances

**Решение:**

-   Observed-state pattern для координат
-   Добавить waits
-   Generous но bounded tolerances

### Тест flaky (случайные падения)

**Причина:**

-   Race conditions
-   Async timing issues
-   Network variance

**Решение:**

-   Waits с `waitForFunction()` или `waitForSelector()`
-   Увеличить timeouts
-   Retry logic для network operations
