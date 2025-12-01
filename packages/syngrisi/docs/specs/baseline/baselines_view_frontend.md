## Фронтенд для `/baselines`

1) **Маршрут и навигация**
- `/baselines` зарегистрирован в `index2/App.tsx`, страница рендерится через общий `IndexLayout` (переключение Tests/Baselines по pathname).
- Пункт в `navigationData`; в Spotlight-экшенах отображается только для ролей admin/reviewer. QueryParamProvider (`use-query-params`) управляет `filter/base_filter/quick_filter/app/sortBy`.

2) **Страница и состояние**
- Страница состоит из таблицы с бесконечной прокруткой и тулбара, где иконки открывают две боковые панели: `BaselinesSettings` (сортировка и выбор колонок) и `BaselinesFilter` (конструктор фильтров).
- Сортировка пишется в query string через `SearchParams` (`sortBy=<field>:<asc|desc>`), доступные поля: name, branch, createdDate, browserName, viewport, os, markedAs (`usageCount` исключен). Видимость колонок хранится в `localStorage` (`baselinesVisibleFields`).
- Фильтруемые поля в конструкторе: name, branch, browserName, viewport, os, createdDate, markedAs (string/date/enum фильтры с regex или сравнениями).

3) **Получение данных**
- Используется `useInfinityScroll` с вызовом `GenericService.get('baselines', {...base_filter, ...filter}, { page, limit: 20, sortBy, populate: 'snapshootId', includeUsage: true })`; базовый фильтр дополняется `app` из query (`$oid`).
- Подгрузка страниц происходит при появлении скелетона (`InfinityScrollSkeleton`), метаданные первой страницы берутся из `firstPageQuery`. Ошибки показываются текстом, при загрузке отображаются скелетоны.

4) **Таблица и колонки**
- Mantine `Table` + `ScrollArea`, выбор колонок через `Chip.Group` (по умолчанию: preview, name, branch, browserName, viewport, os, createdDate, usageCount, markedAs).
- Превью: картинка 80×60 с `HoverCard` шириной 400px, плейсхолдер при отсутствии `snapshootId.filename`.
- `usageCount` выводится `Badge` с подсказкой "Number of checks using this baseline (reference only)". OS/Browser ячейки содержат иконки, даты форматируются `yyyy-MM-dd HH:mm:ss`.

5) **Навигация из таблицы**
- Клик по строке ведет на `/` через `navigate`, добавляя `filter={"baselineSnapshotId":"<snapshootId>"}` (используется `snapshootId` из строки; чекбоксы/кнопки останавливают всплытие).

6) **Удаление**
- Строки можно выделять чекбоксами; при наличии выбранных появляется иконка корзины. Удаление подтверждается модалкой и выполняется через `GenericService.delete('baselines', id)` для каждого id с последующим `refetch`.

## Тесты фронтенда
- Специализированных unit/компонентных тестов для Baselines сейчас нет; покрытие ограничено ручными проверками и общими хуками. Требуются отдельные тесты на сортировку/фильтрацию, отображение usageCount/превью и навигацию при клике по строке.
