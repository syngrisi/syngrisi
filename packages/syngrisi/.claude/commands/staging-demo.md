TEST: Staging Demo Tests (Interactive)

Запуск демо-тестов staging в интерактивном режиме с голосом и паузами.
Предусловие: staging сервер должен быть запущен на порту 5252.

Демо-тесты показывают проблемы загрязнения базы при staging тестировании.

---

```bash
cd /Users/a1/Projects/SYNGRISI_STAGE/packages/syngrisi/e2e-staging && \
  npx bddgen && \
  npx playwright test --grep "@polluting" --headed
```
