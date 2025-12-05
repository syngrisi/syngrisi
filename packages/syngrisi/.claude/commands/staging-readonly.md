TEST: Staging Read-only Tests

Запуск read-only тестов staging (только чтение данных).
Предусловие: staging сервер должен быть запущен на порту 5252.

Эти тесты не модифицируют данные и могут запускаться в любом порядке.

---

```bash
cd /Users/a1/Projects/SYNGRISI_STAGE/packages/syngrisi/e2e-staging && \
  export SKIP_DEMO_TESTS=true && \
  npx bddgen && \
  npx playwright test --grep "@readonly"
```
