# Исследование: Проблема с курсором на кнопках в CheckDetails

## Описание проблемы

При наведении курсора на кнопку Accept (лайк) и другие кнопки в тулбаре CheckDetails, курсор отображается как `not-allowed` (запрещено) вместо `pointer` (палец), хотя кнопки полностью рабочие и не disabled.

**Визуально:** Курсор выглядит как перечёркнутый круг, что вводит пользователя в заблуждение.

## Затронутые компоненты

1. **AcceptButton** - `/src/ui-app/index2/components/Tests/Table/Checks/AcceptButton.tsx`
2. **RemoveButton** - `/src/ui-app/index2/components/Tests/Table/Checks/RemoveButton.tsx`
3. **ActionPopoverIcon** - `/src/ui-app/shared/components/ActionPopoverIcon.tsx` (общий компонент-обёртка)

## Структура DOM

```
AcceptButton
├─ Tooltip (внешний, строки 112-130)
│  └─ div (строка 131)
│     └─ ActionPopoverIcon (строки 132-155)
│        └─ Popover
│           └─ Popover.Target
│              └─ Tooltip (внутренний, с pointerEvents: 'none')
│                 └─ ActionIcon (variant="light")
│                    └─ BsHandThumbsUp icon
```

## Проведённое исследование

### 1. Анализ кода

**ActionPopoverIcon.tsx (строки 67-106):**
- Tooltip оборачивает ActionIcon
- Tooltip имеет `styles={{ tooltip: { pointerEvents: 'none' }, root: { pointerEvents: 'none' } }}`
- ActionIcon использует `variant="light"`
- ActionIcon получает `style={{ pointerEvents: 'auto' }}`

**AcceptButton.tsx (строки 135-138):**
```typescript
sx={{
    cursor: isCurrentlyAccepted ? 'default' : 'pointer',
    '&:hover': { backgroundColor: isCurrentlyAccepted ? 'rgba(255, 255, 255, 0);' : '' },
}}
```

### 2. Гипотезы

#### Гипотеза 1: CSS Specificity конфликт
- `sx` prop из AcceptButton передаётся через `{...rest}` в ActionPopoverIcon
- ActionPopoverIcon имеет свой inline `style` с cursor
- Mantine может обрабатывать приоритеты по-разному

#### Гипотеза 2: Mantine ActionIcon variant="light"
- ActionIcon с `variant="light"` может иметь встроенные CSS стили для cursor
- Эти стили могут переопределять inline styles

#### Гипотеза 3: Tooltip блокировка
- Двойное обёртывание в Tooltip (внешний в AcceptButton + внутренний в ActionPopoverIcon)
- `pointerEvents: 'none'` на Tooltip может влиять на cursor inheritance

#### Гипотеза 4: Порядок применения стилей
- `{...rest}` идёт после `style` и `styles` props
- Если в rest есть конфликтующие стили, они могут перезаписать cursor

### 3. Попытки исправления

#### Попытка 1: Добавить cursor в inline style
```typescript
style={{ pointerEvents: 'auto', cursor: disabled ? 'not-allowed' : 'pointer' }}
```
**Результат:** Не помогло

#### Попытка 2: Использовать Mantine `styles` prop
```typescript
style={{ pointerEvents: 'auto' }}
styles={{
    root: {
        cursor: disabled ? 'not-allowed' : 'pointer',
    },
}}
```
**Результат:** Не помогло

### 4. Тестирование через MCP Test Engine

**Шаги для воспроизведения:**
```gherkin
Given I open the app
When I unfold the test "Seed Test Data"
And I wait for "2" seconds
And I click element with locator "[data-check-previw-link='Failed Check']"
And I wait for "1" seconds
```

**Проверка CSS:**
```gherkin
Then I wait until the css attribute "cursor" from element "[data-test='check-accept-icon']" is "pointer"
```

**Парадокс:** Тест на CSS проходит (показывает `cursor: pointer`), но визуально курсор всё равно `not-allowed`.

## Дополнительные данные

### Версии
- Mantine: `^5.10.5`
- React: проект использует React 18

### Глобальные стили
- Проверены CSS файлы в `src/ui-app/asserts/css/` - нет переопределений cursor
- Mantine theme в `App.tsx` не содержит кастомных стилей для ActionIcon

### Файлы для изучения
1. `/src/ui-app/shared/components/ActionPopoverIcon.tsx` - основной компонент
2. `/src/ui-app/index2/components/Tests/Table/Checks/AcceptButton.tsx` - использует ActionPopoverIcon
3. `/src/ui-app/index2/components/Tests/Table/Checks/RemoveButton.tsx` - использует ActionPopoverIcon
4. `/src/ui-app/index2/App.tsx` - MantineProvider конфигурация

## Нерешённые вопросы

1. **Почему CSS тест проходит, но визуально cursor неправильный?**
   - Возможно, `getComputedStyle` возвращает один cursor, но браузер применяет другой из-за специфики элемента

2. **Откуда приходит `not-allowed` cursor?**
   - Нужно проверить DevTools в браузере и найти точное CSS правило

3. **Влияет ли Tooltip на cursor?**
   - Tooltip wrapper с `pointerEvents: 'none'` может как-то влиять

## Рекомендации для следующего агента

1. **Открыть DevTools** и найти точное CSS правило, которое устанавливает `cursor: not-allowed`
2. **Проверить Computed styles** в браузере для элемента `[data-test="check-accept-icon"]`
3. **Попробовать `!important`** как крайнюю меру
4. **Проверить pseudo-элементы** - возможно cursor приходит от ::before/::after
5. **Изучить Mantine source** для ActionIcon variant="light" - какие стили он применяет

## Команды для тестирования

```bash
# Пересборка UI
yarn build:ui

# Запуск MCP test engine (в headed режиме)
# В test engine:
# I open the app
# I unfold the test "Seed Test Data"
# I wait for "2" seconds
# I click element with locator "[data-check-previw-link='Failed Check']"
# I wait until the css attribute "cursor" from element "[data-test='check-accept-icon']" is "pointer"
```

## Текущее состояние кода

**ActionPopoverIcon.tsx (строки 82-106):**
```typescript
<ActionIcon
    disabled={disabled}
    data-test={testAttr}
    data-popover-icon-name={testAttrName}
    data-loading={loading}
    aria-label={title}
    variant={'light' as any}
    color={iconColor}
    onClick={() => {
        if (paused) return;
        handlers.toggle();
    }}
    title={title}
    loading={loading}
    size={size}
    style={{ pointerEvents: 'auto' }}
    styles={{
        root: {
            cursor: disabled ? 'not-allowed' : 'pointer',
        },
    }}
    {...rest}
>
    {icon}
</ActionIcon>
```

## Решение (Попытка 2)

Предыдущее решение (удаление `pointerEvents: 'none'` у Tooltip) не помогло, так как проблема, вероятно, заключалась в том, что обертка Tooltip перехватывала события или наследовала неправильный курсор.

Новое решение:
1. В `src/ui-app/shared/components/ActionPopoverIcon.tsx` восстановлено свойство `pointerEvents: 'none'` для `Tooltip` (чтобы клики проходили сквозь него к кнопке).
2. Добавлено явное свойство `cursor: pointer` (или `not-allowed` при disabled) для **корневого элемента Tooltip** (`styles.root`). Это гарантирует, что даже если мышь находится над оберткой, курсор будет правильным.
3. Добавлено явное свойство `cursor: pointer` в `inline style` самого `ActionIcon`, чтобы усилить приоритет.

Код:
```typescript
                    styles={{
                        tooltip: { pointerEvents: 'none' },
                        root: {
                            cursor: disabled ? 'not-allowed' : 'pointer',
                        },
                    }}
```
и
```typescript
                        style={{
                            pointerEvents: 'auto',
                            cursor: disabled ? 'not-allowed' : 'pointer',
                        }}
```

Тесты `CHECKS_HANDLING/accept_button_clickable.feature` проходят успешно.

