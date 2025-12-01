## Краткая спека эндпойнтов бэкенда (новые/затронутые)

- `GET /v1/baselines`
  - Параметры: `filter` (JSON-string), `sortBy`, `limit`, `page`, `populate`, `includeUsage` (строковый bool).
  - Поведение: авторизация через `ensureLoggedInOrApiKey`, для роли `user` фильтр дополняется `markedByUsername=req.user.username`. После стандартного paginate при `includeUsage=true` собираются `snapshootId` текущей страницы (включая `_id` из `populate`) и через `Check.aggregate` формируется `usageCount` для каждого элемента (если id невалиден/отсутствует — 0). Без флага отвечает как раньше.

- `GET /v1/tests`
  - Параметры: прежние пагинации и фильтры + новый `baselineSnapshotId`.
  - Поведение при `baselineSnapshotId`: перед пагинацией собирает `test` ids из коллекции `Check` по `baselineId` (helper `resolveTestIdsByBaselineSnapshot`), сужает выборку `_id: { $in: [...] }`. Если совпадений нет, возвращает пустую страницу с сохранением page/limit.

- `GET /v1/tasks/task_handle_orphan_baselines`
  - Параметры: `dryRun` (true/false, по умолчанию true), `execute` (alias, execute=true эквивалент dryRun=false).
  - Доступ: авторизованный админ.
  - Поведение: ищет бейзлайны, чьи `snapshootId` не встречаются в `Check.baselineId` (distinct по имеющимся `snapshootId`), пишет старт/режим/total, sample первых 10 (и `... and N more`), в dry-run завершает сообщением без удаления; при `dryRun=false` удаляет батчами по 500 и выводит прогресс/остаток через `HttpOutputWriter`.
