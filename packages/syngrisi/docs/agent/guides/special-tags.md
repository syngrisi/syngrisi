# Special Tags

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
