TEST: Staging Polluting Tests

Запуск тестов загрязняющих базу (демо-тесты).
Предусловие: staging сервер должен быть запущен на порту 5252.

⚠️ ЗАПУСКАТЬ ПОСЛЕДНИМИ! Эти тесты оставляют данные в базе.

---

```bash
cd /Users/a1/Projects/SYNGRISI_STAGE/packages/syngrisi/e2e-staging && \
  export SKIP_DEMO_TESTS=true && \
  npx bddgen && \
  npx playwright test --grep "@polluting"
```
