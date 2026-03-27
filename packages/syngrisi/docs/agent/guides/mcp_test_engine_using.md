# Using the Syngrisi MCP Test Engine (AI Agent Quick Guide)

MCP lives in `packages/syngrisi/e2e/support/mcp`. It wraps the Syngrisi Playwright BDD stack as an MCP server/bridge so agents can run steps. Always start a session first, then execute steps.

## Preferred validation strategy for `test-engine`

For `support/mcp/test-engine*`, prefer:

- integration tests for CLI/session lifecycle
- transport tests for bridge/server behavior
- headed or headless e2e/manual smoke flows for real browser validation

Do not add unit tests for the orchestration layer by default. This area is valuable only when the full flow works across separate process invocations, state cache, bridge reconnect, and explicit shutdown.

If a helper ever becomes genuinely isolated and hard to validate through integration tests, a small unit test is still acceptable, but that is the exception, not the default.

## Canonical manual headed flow

Use this as the default debugging sequence:

```bash
cd /Users/a1/Project/syngrisi/packages/syngrisi/e2e
npx bddgen
yarn kill
export SYSTEM_THREAD=manual-browser
npx tsx support/mcp/test-engine-cli.ts start manual-browser --headed
npx tsx support/mcp/test-engine-cli.ts step "I go to \"main\" page"
npx tsx support/mcp/test-engine-cli.ts status
npx tsx support/mcp/test-engine-cli.ts shutdown
```

Treat `start` as a one-time session bootstrap. Every later `step`, `status`, `tools`, `clear`, or `shutdown` call should be a separate CLI invocation targeting the same resolved agent id.

Important runtime caveats:

- Serialize commands per `SYSTEM_THREAD`; do not run multiple `step` invocations in parallel against the same session.
- `status` reflects daemon/cache state, not a full guarantee that the underlying bridge session is still attached.
- `start` now includes a mandatory smoke step (`I test`, fallback `I get current URL`).
- Use `restart <sessionName>` to replace a broken session for the same `SYSTEM_THREAD`.
- Health states are explicit: `initializing`, `ready`, `busy`, `broken`, `shutting_down`.
- If real steps start failing with `Session not started` while `status` still looks healthy, use `restart` first; if needed, fall back to `yarn kill` plus fresh `start`.
- If a regular UI step times out and the next call reports `No active session found`, treat the whole session as broken.
- Use `--json` when you need structured `state`, `health`, `artifacts`, and `eventLogFile`.

## Start the MCP server (Playwright-backed)
- Headed, keep-alive (good for debugging):  
  ```bash
  cd packages/syngrisi/e2e
  npm run test:mcp:headed
  ```
- Headless, stop when spec ends:  
  ```bash
  cd packages/syngrisi/e2e
  MCP_KEEP_ALIVE=0 E2E_HEADLESS=1 npm run test:mcp
  ```
The server prints `🚀 MCP server listening at http://localhost:<port>` and logs under `support/mcp/logs/`.

## STDIO ↔︎ SSE bridge (for stdio-only clients)
```bash
cd packages/syngrisi/e2e
npx tsx support/mcp/bridge-cli.ts
```
Bootstrap tools available before connecting: `session_start_new`, `attach_existing_session`. Everything else returns “Session not started” until a session is active. To connect to a server launched via the debug step, call `attach_existing_session` (reads latest port file from `support/mcp/logs/ports/`).

## Tool contract (call these over MCP)
- `session_start_new` (required first): `{ "sessionName": "My run", "headless": true|false }` → regenerates step YAMLs in `support/mcp/steps/`, opens app page.
- `step_execute_single` (primary): `{ "stepText": "I click element with label \"Login\"" , "stepDocstring": "..."? }` → run exactly one step; use for diagnostics or value-returning steps.
- `step_execute_many` (only for 2+ steps): `{ "steps": [ { "stepText": "I open site \"{{baseUrl}}\"" }, { "stepText": "I click button \"Login\"" } ] }` → no per-step results, do not use for single steps.
- `attach_existing_session`: attach bridge to an already running MCP server (e.g., started via debug step `When I start the MCP test engine`).

## Example MCP calls
- Start a session (stdio/JSON-RPC):
```json
{ "method": "tools/call", "params": { "name": "session_start_new", "arguments": { "sessionName": "demo", "headless": true } } }
```
- Run one diagnostic step:
```json
{ "method": "tools/call", "params": { "name": "step_execute_single", "arguments": { "stepText": "I analyze current page" } } }
```
- Run multiple steps:
```json
{ "method": "tools/call", "params": { "name": "step_execute_many", "arguments": { "steps": [ { "stepText": "I open site \"{{baseUrl}}\"" }, { "stepText": "I click element with label \"Login\"" } ] } } }
```

## Diagnostics and step catalog
- Step definitions are loaded from `packages/syngrisi/e2e/steps/**` plus `support/mcp/sd/**` (e.g., `When I analyze current page`, `I get accessibility snapshot of "role=button"`). They are rebuilt on every `session_start_new`.
- Generated YAML catalogs live in `support/mcp/steps/` with categories, source, and line numbers—send them to the LLM for discovery.
- Screenshots and diagnostics are saved under `support/mcp/screenshots/`. Ports recorded in `support/mcp/logs/ports/`.

## Shutdown and cleanup
- Graceful: send `notifications/shutdown` or stop the Playwright run; bridge will forward shutdown.
- Force kill (if zombie processes): `./support/mcp/kill-mcp.sh`.

## Rules of thumb for agents
- Always call `session_start_new` (or `attach_existing_session` with a saved port) before any step execution.
- Prefer `step_execute_single` for all single actions/diagnostics/returns; use `step_execute_many` only when you truly need multiple steps with no per-step output.
- If step definitions change, restart the session to refresh YAMLs.
- Avoid CSS/XPath-only selectors—update the app layout instead (see `update-app-layout.md` and `selector_best_practices.md`).
