## Краткая спека эндпойнтов бэкенда (новые/затронутые)

- `GET /v1/baselines`
  - Параметры: `filter` (JSON-string), `sortBy`, `limit`, `page`, `populate`, `includeUsage` (true/false).
  - Поведение: стандартный paginate по бейзлайнам. При `includeUsage=true` текущая страница дополнительно обогащается полем `usageCount` — количеством чеков, у которых `baselineId` совпадает со `snapshootId` бейзлайна. Без флага отвечает как раньше.

- `GET /v1/tests`
  - Параметры: прежние пагинации и фильтры + новый `baselineSnapshotId`.
  - Поведение при `baselineSnapshotId`: перед пагинацией собирает `test` ids из коллекции `Check` по `baselineId`, сужает выборку `_id: { $in: [...] }`. Если совпадений нет, возвращает пустую страницу.

- `GET /v1/tasks/task_handle_orphan_baselines`
  - Параметры: `dryRun` (true/false, по умолчанию true), `execute` (alias, execute=true эквивалент dryRun=false).
  - Доступ: авторизованный админ.
  - Поведение: ищет бейзлайны, чьи `snapshootId` не встречаются в `Check.baselineId`. В dry-run выводит статистику; при `dryRun=false` удаляет найденные бейзлайны батчами и пишет прогресс.
