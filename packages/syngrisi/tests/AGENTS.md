# Syngrisi Tests – Agent Checklist

- Always switch to `node v14.20.0` before installing dependencies or running WDIO: `nvm use v14.20.0`.
- Run `npm install` once after changing the Node version so that native modules (e.g. `fibers`) are rebuilt correctly.
- Use `npm test` for the full headless suite; prefer `npx wdio --spec <path>` when debugging individual features.
- If you temporarily switch Node versions (e.g. to download Chrome 118), switch back to 14 and reinstall dependencies before the next test run.

**MANDATORY:** If you encounter any issues during Syngrisi test runs—especially those related to connections, ports, or environment—always run `npm install` from the `packages/syngrisi/tests` directory to recompile dependencies for Node v14. This ensures all native modules are rebuilt correctly for the required Node version.

**EXAMPLE:** Always run tests from the `packages/syngrisi/tests` directory. For example:

```sh
npx cross-env RETRY=1 STREAMS=6 LOG=1 HL=1 npx wdio --spec './features/CP/table/bulk_test_apply.feature'
```
