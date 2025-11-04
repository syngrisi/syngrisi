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

## Chrome for Testing 118 Setup

- **REQUIRED:** Chrome for Testing 118 must be installed and configured before running tests.
- ChromeDriver 118.0.1 requires Chrome 118, not the system Chrome.
- To install Chrome 118:
  1. Switch to Node v20.19.2: `nvm use v20.19.2`
  2. Install Chrome: `cd ../.. && npx @puppeteer/browsers install chrome@118 --path ./chrome --platform mac_arm`
  3. Switch back to Node v14.20.0: `nvm use v14.20.0`
  4. Ensure `.env` file contains: `CHROME_BINARY=/absolute/path/to/chrome/chrome/mac_arm-118.0.5993.70/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`

## Known Issues and Fixes

- **Dependency compatibility:** The `@so-ric/colorspace` package uses syntax incompatible with Node.js 14. 
  - Fixed by patching `node_modules/@so-ric/colorspace/dist/index.cjs.js`:
    - Replace `||=` operator (line 1976) with: `if (!limiters[m]) limiters[m] = [];`
    - Replace `Object.hasOwn` (lines 158, 260) with: `Object.prototype.hasOwnProperty.call`
- **Missing files:** `src/utills/vDriver.js` and `getConfig` function in `common.js` have been added.
- **Import syntax:** Some files use ES6 imports, but must use CommonJS `require()` for Node.js 14 compatibility.
