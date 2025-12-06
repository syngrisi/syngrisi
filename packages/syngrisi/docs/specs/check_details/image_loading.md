# Image Preloading for CheckDetails Modal

## Overview

При открытии модального окна CheckDetails изображения (baseline, actual, diff) загружаются заново, что приводит к задержке при открытии. Цель этой фичи — предварительно загружать изображения при открытии грида, чтобы CheckDetails открывался мгновенно.

## Текущее состояние

### Текущий поток загрузки изображений

1. **Grid загружает checks** (`Checks.tsx:20-44`):
   - Запрос к API с `populate: 'baselineId,actualSnapshotId,diffId'`
   - Данные о файлах изображений уже доступны в ответе

2. **Check компонент показывает preview** (`Check.tsx:40-41`):
   ```typescript
   const imageFilename = check.diffId?.filename || check.actualSnapshotId?.filename || check.baselineId?.filename;
   const imagePreviewSrc = `${config.baseUri}/snapshoots/${imageFilename}`;
   ```
   - Загружается только одно превью-изображение

3. **При открытии CheckDetails** (`CheckDetails.tsx:196-248`):
   ```typescript
   const expectedImgSrc = `${config.baseUri}/snapshoots/${currentCheck?.baselineId?.filename}?expectedImg`;
   const expectedImg = await createImageAndWaitForLoad(expectedImgSrc);

   const actualImgSrc = `${config.baseUri}/snapshoots/${currentCheck?.actualSnapshotId?.filename}?actualImg`;
   const actualImg = await createImageAndWaitForLoad(actualImgSrc);

   const diffImgSrc = `${config.baseUri}/snapshoots/${currentCheck?.diffId?.filename}?diffImg`;
   const diffImage = currentCheck?.diffId?.filename ? await imageFromUrl(diffImgSrc) : null;
   ```
   - Три изображения загружаются последовательно
   - Пользователь видит задержку пока все изображения не загрузятся

### Проблемы текущего решения

1. **Задержка при открытии модального окна** — пользователь ждёт загрузки изображений
2. **Неиспользование данных** — URL изображений известны при загрузке грида, но не используются для preload
3. **Повторная загрузка** — preview изображение и полное изображение могут быть одинаковыми, но загружаются дважды

## Предлагаемое решение

### Архитектура

```
┌─────────────────────────────────────────────────────────────────┐
│                        ImagePreloadService                       │
├─────────────────────────────────────────────────────────────────┤
│  - preloadedImages: Map<string, PreloadedImage>                 │
│  - preloadQueue: PriorityQueue<PreloadRequest>                  │
│  - activePreloads: number                                       │
├─────────────────────────────────────────────────────────────────┤
│  + preloadCheckImages(check: ICheck): void                      │
│  + preloadChecksImages(checks: ICheck[]): void                  │
│  + getPreloadedImage(src: string): Image | null                 │
│  + isPreloaded(src: string): boolean                            │
│  + cancelPreload(src: string): void                             │
│  + clearCache(): void                                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     useImagePreload (hook)                       │
├─────────────────────────────────────────────────────────────────┤
│  - Интеграция с React компонентами                              │
│  - Автоматическая очистка при unmount                           │
│  - Статус загрузки для UI                                       │
└─────────────────────────────────────────────────────────────────┘
```

### Компоненты решения

#### 1. ImagePreloadService (`services/imagePreload.service.ts`)

Синглтон-сервис для управления предзагрузкой изображений:

```typescript
interface PreloadedImage {
  image: HTMLImageElement;
  src: string;
  loadedAt: number;
  size: number;
}

interface PreloadRequest {
  src: string;
  priority: 'high' | 'medium' | 'low';
  checkId: string;
}

class ImagePreloadService {
  private preloadedImages: Map<string, PreloadedImage>;
  private preloadQueue: PreloadRequest[];
  private activePreloads: number;
  private maxConcurrentPreloads: number;
  private maxCacheSize: number;
  private maxCacheAge: number;

  constructor(config?: {
    maxConcurrentPreloads?: number;  // default: 4
    maxCacheSize?: number;           // default: 100MB
    maxCacheAge?: number;            // default: 5 minutes
  });

  // Preload all images for a single check
  preloadCheckImages(check: ICheck): Promise<void>;

  // Preload images for multiple checks (with priority queue)
  preloadChecksImages(checks: ICheck[], options?: {
    startIndex?: number;
    count?: number;
    priority?: 'high' | 'medium' | 'low';
  }): void;

  // Get preloaded image (returns null if not preloaded)
  getPreloadedImage(src: string): HTMLImageElement | null;

  // Check if image is preloaded
  isPreloaded(src: string): boolean;

  // Cancel pending preload
  cancelPreload(src: string): void;

  // Clear all cached images
  clearCache(): void;

  // Get cache statistics
  getStats(): {
    cachedCount: number;
    totalSize: number;
    pendingCount: number;
  };
}

export const imagePreloadService = new ImagePreloadService();
```

#### 2. useImagePreload Hook (`hooks/useImagePreload.ts`)

React hook для интеграции с компонентами:

```typescript
interface UseImagePreloadOptions {
  enabled?: boolean;
  priority?: 'high' | 'medium' | 'low';
}

interface UseImagePreloadResult {
  isPreloaded: boolean;
  isLoading: boolean;
  error: Error | null;
  preload: () => void;
}

function useImagePreload(
  check: ICheck | null,
  options?: UseImagePreloadOptions
): UseImagePreloadResult;

function useImagePreloadBatch(
  checks: ICheck[],
  options?: UseImagePreloadOptions & {
    visibleRange?: [number, number];
    preloadAhead?: number;
  }
): {
  preloadedCount: number;
  totalCount: number;
  isPreloading: boolean;
};
```

#### 3. Интеграция с Checks Grid (`Checks.tsx`)

```typescript
// После загрузки checks, запускаем preload
const { data: checks } = useQuery(['preview_checks', ...]);

// Используем hook для preload видимых + соседних checks
useImagePreloadBatch(checks, {
  visibleRange: [0, 20],  // видимые checks
  preloadAhead: 5,        // preload 5 следующих
  priority: 'medium',
});
```

#### 4. Интеграция с CheckDetails (`CheckDetails.tsx`)

```typescript
// Модифицируем функцию загрузки изображений
const loadImages = async () => {
  const expectedImgSrc = `${config.baseUri}/snapshoots/${currentCheck?.baselineId?.filename}`;
  const actualImgSrc = `${config.baseUri}/snapshoots/${currentCheck?.actualSnapshotId?.filename}`;
  const diffImgSrc = currentCheck?.diffId?.filename
    ? `${config.baseUri}/snapshoots/${currentCheck?.diffId?.filename}`
    : null;

  // Проверяем cache
  let expectedImg = imagePreloadService.getPreloadedImage(expectedImgSrc);
  let actualImg = imagePreloadService.getPreloadedImage(actualImgSrc);
  let diffImg = diffImgSrc ? imagePreloadService.getPreloadedImage(diffImgSrc) : null;

  // Загружаем только отсутствующие
  if (!expectedImg) {
    expectedImg = await createImageAndWaitForLoad(expectedImgSrc);
  }
  if (!actualImg) {
    actualImg = await createImageAndWaitForLoad(actualImgSrc);
  }
  if (diffImgSrc && !diffImg) {
    diffImg = await createImageAndWaitForLoad(diffImgSrc);
  }

  // ... остальная логика
};
```

### Стратегия приоритизации

```
Priority HIGH:
  - Изображения текущего выбранного check (при hover)
  - Изображения первых N видимых checks

Priority MEDIUM:
  - Изображения следующих checks (preload ahead)
  - Изображения соседних checks

Priority LOW:
  - Остальные изображения в фоновом режиме
```

### Управление памятью

1. **LRU Cache** — удаление старых изображений при достижении лимита
2. **Максимальный размер cache** — ограничение общего размера (default: 100MB)
3. **TTL** — автоматическое удаление изображений старше N минут
4. **Cleanup при навигации** — очистка при уходе со страницы

## План реализации

### Фаза 1: Базовая инфраструктура ✅ ЗАВЕРШЕНО

#### Шаг 1.1: Создание ImagePreloadService ✅
- [x] Создать `packages/syngrisi/src/ui-app/shared/services/imagePreload.service.ts`
- [x] Реализовать базовый функционал preload
- [x] Реализовать Map для хранения загруженных изображений
- [x] Добавить методы `preloadCheckImages`, `getPreloadedImage`, `isPreloaded`

#### Шаг 1.2: Создание useImagePreload hook ✅
- [x] Создать `packages/syngrisi/src/ui-app/shared/hooks/useImagePreload.ts`
- [x] Интегрировать с ImagePreloadService
- [x] Добавить состояния loading/error
- [x] Добавить `useImagePreloadBatch` для batch preload
- [x] Добавить `useImagePreloadOnHover` для preload при hover

#### Шаг 1.3: Unit тесты
- [ ] Тесты для ImagePreloadService
- [ ] Тесты для useImagePreload hook

### Фаза 2: Интеграция с компонентами ✅ ЗАВЕРШЕНО

#### Шаг 2.1: Интеграция с Checks Grid ✅
- [x] Модифицировать `Checks.tsx` — добавить preload после загрузки данных
- [x] Preload первых 10 видимых checks

#### Шаг 2.2: Интеграция с CheckDetails ✅
- [x] Модифицировать `CheckDetails.tsx` — использовать cached изображения
- [x] Fallback на обычную загрузку если не в cache
- [x] Добавить логирование cache hit/miss

#### Шаг 2.3: Интеграция с Check компонентом (hover preload) ✅
- [x] Добавить preload на hover над check (list view и card view)
- [x] Priority HIGH для hovered check

### Фаза 3: Оптимизации ✅ ЗАВЕРШЕНО

#### Шаг 3.1: Priority Queue ✅
- [x] Реализовать очередь с приоритетами (high/medium/low)
- [x] Лимит одновременных загрузок (default: 4)
- [x] Возможность отмены загрузки

#### Шаг 3.2: Memory Management ✅
- [x] Реализовать LRU cache (удаление старейших записей)
- [x] Добавить ограничение по количеству (default: 50 items)
- [x] Добавить TTL для записей (default: 5 minutes)

#### Шаг 3.3: Virtual Scrolling Integration
- [ ] Интеграция с виртуальным скроллингом (если используется)
- [ ] Preload на основе visible range

### Фаза 4: UX улучшения (опционально)

#### Шаг 4.1: Loading индикаторы
- [ ] Показывать статус preload в UI (опционально)
- [ ] Прогресс-бар для batch preload (опционально)

#### Шаг 4.2: Network-aware loading
- [ ] Определение качества соединения
- [ ] Уменьшение preload при медленном соединении

## Результаты тестирования

Тестирование проведено с использованием MCP Test Engine:

| Действие | Время (ms) | Примечание |
|----------|------------|------------|
| Открытие Check 1 | 305ms | После preload |
| Открытие Check 2 | 191ms | Из cache |
| Открытие Check 3 | 222ms | Из cache |

**Вывод**: Время открытия CheckDetails сократилось с 1-3 секунд до ~200-300ms благодаря preload

## Изменённые файлы

| Файл | Тип изменения | Описание |
|------|---------------|----------|
| `shared/services/imagePreload.service.ts` | NEW ✅ | Сервис предзагрузки |
| `shared/services/index.ts` | MODIFY ✅ | Экспорт сервиса |
| `shared/hooks/useImagePreload.ts` | NEW ✅ | React hooks |
| `shared/hooks/index.ts` | MODIFY ✅ | Экспорт hooks |
| `index2/components/Tests/Table/Checks/Checks.tsx` | MODIFY ✅ | Batch preload |
| `index2/components/Tests/Table/Checks/Check.tsx` | MODIFY ✅ | Hover preload |
| `index2/components/Tests/Table/Checks/CheckDetails/CheckDetails.tsx` | MODIFY ✅ | Использование cached изображений |

## Конфигурация

Добавить настройки в конфигурацию приложения:

```typescript
interface ImagePreloadConfig {
  enabled: boolean;              // включить/выключить preload
  maxConcurrentPreloads: number; // макс. одновременных загрузок (default: 4)
  maxCacheSize: number;          // макс. размер cache в bytes (default: 100MB)
  maxCacheAge: number;           // TTL в ms (default: 5 minutes)
  preloadOnHover: boolean;       // preload при hover (default: true)
  preloadAhead: number;          // сколько checks preload вперёд (default: 5)
}
```

## Метрики успеха

1. **Time to Interactive (TTI)** для CheckDetails модального окна
   - Текущее: ~1-3 секунды (зависит от размера изображений)
   - Цель: < 100ms для preloaded изображений

2. **Cache Hit Rate**
   - Цель: > 80% для типичного workflow

3. **Memory Usage**
   - Должно оставаться в пределах заданного лимита
   - Не влиять на производительность приложения

## Риски и митигация

| Риск | Вероятность | Влияние | Митигация |
|------|-------------|---------|-----------|
| Увеличение потребления памяти | Высокая | Среднее | LRU cache с ограничением размера |
| Увеличение сетевого трафика | Средняя | Низкое | Умная приоритизация, отмена при навигации |
| Сложность отладки | Средняя | Низкое | Логирование, метрики в dev mode |
| Несовместимость с браузерами | Низкая | Высокое | Fallback на текущее поведение |

## Альтернативные решения

### Service Worker
Использование Service Worker для кэширования изображений на уровне браузера.
- Плюсы: работает между сессиями, нативный cache
- Минусы: сложнее реализация, требует HTTPS

### Lazy Loading с IntersectionObserver
Загрузка изображений при приближении к viewport.
- Плюсы: простая реализация
- Минусы: не даёт мгновенного открытия модалки

### HTTP/2 Server Push
Push изображений с сервера вместе с данными.
- Плюсы: оптимальное использование сети
- Минусы: требует изменений на сервере, сложная настройка

**Выбрано решение с ImagePreloadService** как оптимальный баланс между сложностью реализации и эффективностью.
