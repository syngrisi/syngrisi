## План бэкенда

1) **Ручка `/v1/baselines`**
- Обработка query-параметра `includeUsage` (string bool) в контроллере: после `paginate` собрать `snapshootId` текущей страницы (включая `_id` из populate), агрегировать `Check` по полю `baselineId` и добавлять `usageCount` в каждый элемент результата (0, если id невалиден/отсутствует). Для роли `user` фильтр дополняется `markedByUsername=req.user.username`, доступ через `ensureLoggedInOrApiKey`.
- Helper `buildUsageCountMap` выделен для маппинга `_id → count` и покрыт unit-тестом (пропускает строки без `_id`).
- `RequestPaginationSchema` расширен полями `includeUsage` и `baselineSnapshotId` для документации.

2) **Фильтр для чек-вью**
- В `testService.queryTests` реализована поддержка фильтра `baselineSnapshotId` через helper `resolveTestIdsByBaselineSnapshot` (валидирует ObjectId, делает `distinct('test')` по `Check.baselineId`). При отсутствии совпадений возвращается пустая страница `buildEmptyResult` с заданными page/limit; иначе в фильтр подставляется `_id: { $in: [...] }`.
- Вспомогательная логика покрыта unit-тестами без реальной БД.

3) **Задача очистки осиротевших бейзлайнов**
- Core-функция `handleOrphanBaselinesTask({ dryRun, batchSize=500 }, output, deps)` (deps для тестов). Осиротевшие — бейзлайны, чьи `snapshootId` не встречаются в `Check.baselineId` (distinct ограничен набором `snapshootId`).
- HTTP-ручка `/v1/tasks/task_handle_orphan_baselines` + сервисный метод в `tasks.service` (по умолчанию dryRun=true, alias execute=true) + запись в `tasksList`/навигацию админки.
- Выводит старт/режим/total, список первых 10 id/имен (`... and N more` при избытке); в execute удаляет батчами и сообщает прогресс/остаток.

4) **Тесты**
- Unit на `buildUsageCountMap` (корректное сопоставление id, строки без `_id` игнорируются).
- Unit на вспомогательные функции фильтрации тестов по `baselineSnapshotId` (пустой массив, массив с id, некорректный id).
- Unit на `handleOrphanBaselinesTask` с моками моделей (dry run не удаляет, execute удаляет из мока, выводит сообщения в `MockOutputWriter`).

5) **Безопасность и обратная совместимость**
- Не менять поведение `/v1/baselines` без `includeUsage`.
- Существующие клиенты задач не ломаются: новая задача в отдельной ручке; существующие схемы не затрагиваются.
