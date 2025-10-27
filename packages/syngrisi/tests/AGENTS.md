# Syngrisi Tests – Agent Checklist

- Always switch to `node v14.20.0` before installing dependencies or running WDIO: `nvm use v14.20.0`.
- Run `npm install` once after changing the Node version so that native modules (e.g. `fibers`) are rebuilt correctly.
- Use `npm test` for the full headless suite; prefer `npx wdio --spec <path>` when debugging individual features.
- If you temporarily switch Node versions (e.g. to download Chrome 118), switch back to 14 and reinstall dependencies before the next test run.
