# Special Tags

## Playwright BDD Tags

- `@only` – run only the tagged feature or scenario
- `@skip` / `@fixme` – skip execution
- `@fail` – expect the scenario to fail
- `@slow` – triple the default timeout
- `@timeout:N` – set timeout in milliseconds (e.g., `@timeout:5000`)
- `@retries:N` – set retry count (e.g., `@retries:2`)
- `@mode:parallel` – force parallel execution (Feature only)
- `@mode:serial` – force serial execution (Feature only)
- `@mode:default` – revert to default execution mode (Feature only)

`@mode:*` tags matter only at the Feature level; placing them on individual scenarios has no effect.

## Project & Category Tags

- `@demo` – demo tests, run only via `--project=demo` or `npm run test:demo`. Must be in `features/DEMO/` folder
- `@flaky` – flaky tests, run separately with reduced parallelism
- `@smoke` – smoke tests subset for quick validation
- `@saml`, `@sso-external`, `@sso-logto` – SSO tests, run with 1 worker
- `@fast-server` – tests that use fast server startup
