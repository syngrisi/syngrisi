TEST: Staging Read-Write Tests

Запуск read-write тестов staging (модификация с cleanup).
Предусловие: staging сервер должен быть запущен на порту 5252.

Эти тесты модифицируют данные, но выполняют cleanup после себя.

---

```bash
cd /Users/a1/Projects/SYNGRISI_STAGE/packages/syngrisi/e2e-staging && \
  export SKIP_DEMO_TESTS=true && \
  npx bddgen && \
  npx playwright test --grep "@readwrite"
```
