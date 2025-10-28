# Syngrisi Tests – Agent Checklist

- Always switch to `node v14.20.0` before installing dependencies or running WDIO: `nvm use v14.20.0`.
- Run `npm install` once after changing the Node version so that native modules (e.g. `fibers`) are rebuilt correctly.
- Перед запуском очисти артефакты предыдущих прогонов: `rm -rf logs test_output.log run.log` (или хотя бы очисти содержимое `logs/`). Это исключит чтение устаревшего отчёта.
- Используй `npm test` для полного headless-прогона; при отладке отдельных фич предпочтительнее `npx wdio --spec <path>`.
- Если временно переключался на другую версию Node (например, для скачивания Chrome), вернись на 14-ю и заново запусти `npm install` перед тестами.

- **MANDATORY:** If you encounter any issues during Syngrisi test runs—especially those related to connections, ports, or environment—always run `npm install` from the `packages/syngrisi/tests` directory to recompile dependencies for Node v14. This ensures all native modules are rebuilt correctly for the required Node version.
- **Recommended workflow:**  
  ```bash
  cd packages/syngrisi/tests
  nvm use
  rm -rf logs test_output.log run.log
  npm install   # при первом запуске или после смены Node
  npm test | tee run.log
  ```

**EXAMPLE:** Always run tests from the `packages/syngrisi/tests` directory. For example:

```sh
npx cross-env RETRY=1 STREAMS=6 LOG=1 HL=1 npx wdio --spec './features/CP/table/bulk_test_apply.feature'
```
