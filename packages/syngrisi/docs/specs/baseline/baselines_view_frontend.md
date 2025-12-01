## План фронтенда для `/baselines`

1) **Новый маршрут и навигация**
- Добавить маршрут `/baselines` в `index2/App.tsx`, пункт в `navigationData`.
- Подключить страницу к общему `IndexLayout`/`AppShell` (или собственной оболочке) без влияния на текущий `/` сценарий.

2) **Страница BaselinesPage**
- Структура: фильтры + таблица + пагинация/лимит.
- Состояние фильтров/сортировки/страницы хранить в query params через `use-query-params` (JsonParam/StringParam) с локальным дебаунсом на ввод.
- Фильтры: name/branch/browserName/os/viewport/app (строковый `regex` insensitive).
- Сортировка: `createdDate`, `updatedDate`, `name`, `branch` (asc/desc). `usageCount` явно исключить из сортировки.
- Пагинация: `Pagination` + `Select` лимита (10/20/50).

3) **Получение данных**
- Запрос через `GenericService.get('baselines', filter, { page, limit, sortBy, populate: 'snapshootId', includeUsage: true })`.
- Обработать загрузку/ошибки (`Loader`, `Alert`), мемоизировать `filtersToApi` чтобы не дергать лишние запросы.

4) **Таблица и колонки**
- Использовать `Table` + `ScrollArea`. Конфигурация колонок в массиве объектов `{ key, label, render, sortable }`.
- Видимость колонок через `MultiSelect` + `useLocalStorage` (по умолчанию: preview, name, branch, browserName, viewport, os, createdDate, usageCount, markedAs).
- Превью: миниатюра (80–100px) из `/snapshoots/<filename>`; `Tooltip`/`HoverCard` с большим превью (300–400px). Плейсхолдер при отсутствии файла.
- Usage count: `Badge`/`Text`, подсказка что поле справочное и не сортируется.

5) **Редирект в чек-вью**
- Клик по строке или отдельной кнопке → `navigate('/')` c установкой query param `filter` = `{ baselineSnapshotId: snapshootId }` (через `setQuery` из `useParams`), сбрасывая страницу/группировку в дефолт.
- Логирование/обработка отсутствия `snapshootId`.

6) **UI-полировка**
- Подписи/хинты на русском; внутренние комментарии/логирование только на английском.
- Адаптив: таблица тянется на ширину, превью ограничены.

## Тесты фронтенда
- Юнит: функция построения API-фильтра/сортировки и маппинга ответа (без запроса) в отдельном helper — проверить regex-фильтр, сортировку, отсутствие сортировки по usageCount.
- Компонентный smoke (через React Testing Library или существующий стек, если присутствует) для BaselinesPage: рендер загрузки, отображение строки/usageCount/превью-ховеркард по мок-данным.
- Навигационный тест: клик по строке вызывает `navigate` с нужным query param (мокаем `useNavigate`/`useParams`).
- Ручные проверки: загрузка данных, фильтр по имени, смена сортировки, смена страницы, редирект в `/` с примененным фильтром.
