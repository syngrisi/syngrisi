# Спецификация: Auto Ignore Regions

## Обзор

Функция автоматического создания ignore regions на основе найденных diff-областей. Пользователь может одним кликом создать ignore regions, покрывающие все обнаруженные различия.

## Требования

### Функциональные требования

- Кнопка "Auto Region" в панели инструментов регионов (RegionsToolbar)
- Автоматическое сканирование diff-изображения для поиска областей различий
- Создание ignore region для каждой обнаруженной diff-области
- Padding 5px вокруг каждого региона по умолчанию
- Уведомление пользователя о количестве созданных регионов

### Условия активации кнопки

Кнопка "Auto Region" активна когда:
- Есть baseline (чек был принят)
- Есть diff-изображение (были обнаружены различия)
- Текущий view не является "slider"

### Горячие клавиши

- **R** — Создать auto ignore regions

## Техническая реализация

### Компоненты

1. **RegionsToolbar.tsx** (`src/ui-app/index2/components/Tests/Table/Checks/CheckDetails/Toolbar/RegionsToolbar.tsx`)
   - Добавлена кнопка с иконкой `IconWand`
   - Prop `hasDiff: boolean` для контроля disabled состояния
   - Горячая клавиша `R` через `useHotkeys`

2. **MainView.ts** (`src/ui-app/index2/components/Tests/Table/Checks/CheckDetails/Canvas/mainView.ts`)
   - Метод `createAutoIgnoreRegions(padding: number = 5): Promise<number>`
   - Использует `highlightDiff` для получения групп diff-пикселей
   - Создает ignore region для каждой группы

3. **highlightDiff.ts** (`src/ui-app/index2/components/Tests/Table/Checks/CheckDetails/Toolbar/highlightDiff.ts`)
   - Добавлен параметр `options: HighlightDiffOptions = {}`
   - Опция `skipAnimation: boolean` для пропуска анимации (используется для auto-region)

### Алгоритм обнаружения diff-областей

1. Получение diff-изображения из canvas
2. Сканирование всех пикселей изображения
3. Поиск пикселей цвета diff (255, 0, 255, 255 - magenta)
4. Группировка связанных пикселей в регионы
5. Вычисление bounding box для каждой группы (minX, maxX, minY, maxY)

### Создание регионов

```typescript
async createAutoIgnoreRegions(padding: number = 5): Promise<number> {
    if (!this.diffImage) return 0;

    // Получить группы diff без анимации
    const { groups } = await highlightDiff(this, null, null, { skipAnimation: true });

    // Создать ignore region для каждой группы
    for (const group of groups) {
        const regionParams = {
            left: Math.max(0, group.minX - padding),
            top: Math.max(0, group.minY - padding),
            width: (group.maxX - group.minX) + padding * 2,
            height: (group.maxY - group.minY) + padding * 2,
            name: 'ignore_rect',
            strokeWidth: 0,
            noSelect: true,
        };
        this.addIgnoreRegion(regionParams);
    }

    return groups.length;
}
```

### Интерфейс группы

```typescript
interface IGroup {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    imageData: any;
    members: { x: number; y: number }[];
}
```

## UI/UX

### Tooltip кнопки

```
Auto ignore regions from diff [R]
Create ignore regions for all diff areas
```

### Предупреждения в tooltip

- Если нет baseline: "First you need to accept this check"
- Если нет diff: "No diff available"

### Success notification

```
Created N ignore region(s) from diff
```

## E2E тесты

**Файл:** `e2e/features/CP/check_details/auto_regions.feature`

### Сценарии

1. **Auto region button is disabled without baseline**
   - Проверка что кнопка неактивна для нового чека без baseline

2. **Auto region creates ignore regions from diff**
   - Создание чека с diff
   - Принятие чека (создание baseline)
   - Нажатие кнопки Auto Region
   - Проверка создания ignore regions
   - Сохранение регионов
   - Проверка что регионы отображаются

## План выполнения

1. [x] Создать спецификацию
2. [x] Модифицировать highlightDiff.ts (добавить skipAnimation)
3. [x] Добавить метод createAutoIgnoreRegions() в MainView.ts
4. [x] Добавить кнопку Auto Region в RegionsToolbar.tsx
5. [x] Добавить prop hasDiff в CheckDetails.tsx
6. [x] Написать E2E тесты

## Статус реализации

✅ **Все функции реализованы:**

- ✅ Кнопка "Auto Region" в тулбаре
- ✅ Горячая клавиша `R`
- ✅ Алгоритм обнаружения diff-областей
- ✅ Автоматическое создание ignore regions
- ✅ Padding вокруг регионов
- ✅ Disabled состояния для кнопки
- ✅ Tooltips с подсказками
- ✅ E2E тесты
