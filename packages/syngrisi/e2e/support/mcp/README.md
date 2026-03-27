# MCP Support Utilities

This directory packages the Syngrisi end-to-end Playwright stack as a Model Context Protocol (MCP) service. The same server can be reached over HTTP/SSE or through a stdio bridge, making it convenient for local debugging, automated diagnostics, and LLM-driven workflows.

## Quick Start

From the repository root:

```bash
timeout 300s bash -lc 'cd packages/syngrisi/e2e && yarn test:mcp:headed'
```

That script expands to `cross-env E2E_HEADLESS=0 playwright test --workers=1 --config support/mcp/playwright.config.ts support/mcp/mcp.spec.ts`. It launches the full Syngrisi app, opens Chromium headed, and shuts down automatically when the spec finishes.

```bash
timeout 300s bash -lc 'cd packages/syngrisi/e2e && E2E_HEADLESS=1 yarn test:mcp'
```

The server uses dynamic port allocation (port 0), letting the OS assign a free port automatically. The actual port is reported as `🚀 MCP server listening at http://localhost:<port>`.

## Tools Exposed by the Server

`server.ts` builds the MCP surface using `playwright-mcp-advanced` and helper utilities in `utils/`:

- `session_start_new` – Starts a named logging session, regenerates the categorized step definitions as YAML files (returning paths to all generated files), spins up a Playwright page, and navigates to the app under test.
  * The server will attempt to start the Syngrisi app automatically if it is not already running, which is helpful when `@no-app-start` or other fixtures suppress the app launch.
- `sessions_clear` – Force-closes all Playwright contexts/pages from previous sessions to free resources when a run crashed or leaked browsers.
- `step_execute_single` – Execute a single BDD step with optional `stepDocstring` parameter for table or multi-line payload. **ALWAYS use this tool for single steps, diagnostic steps, and steps that return values**. This is the primary tool for step-by-step execution and debugging. Each run updates the active session log stored alongside other diagnostics. для ровно одного шага.
- `step_execute_many` – Validate and execute multiple steps in sequence. **Use ONLY for reproducing multiple steps together**. **DO NOT use for single steps, diagnostic steps, or steps that return values** (this tool does not return individual step results). использовать только при ≥2 шагах; одиночные шаги запрещены.
- `attach_existing_session` – Attach the bridge to a Playwright MCP server that was launched separately (for example via the debug step described below) by reading the latest port file in `support/mcp/logs/ports/`.
- `sd/diagnostics.sd.ts` includes utilities such as `When I analyze current page`, which provides page analysis for AI agents.

## Test Engine CLI additions

`support/mcp/test-engine-cli.ts` now supports several faster and less fragile interfaces on top of the bridge:

- `step-json <json>` – Execute one step from structured JSON, for example `{"stepText":"I test"}`
- `batch-json <json>` – Execute multiple structured steps, each item can include `stepDocstring`
- `step ... --docstring-file <path>` – Load docstring payload from a file instead of base64 or inline quoting
- `steps find <query>` – Search available step definitions without starting a browser session
- `restart <sessionName>` – Replace the current session for the same `SYSTEM_THREAD`
- `--json` – Return machine-readable output including `health`, `state`, `artifacts`, and `eventLogFile`

These commands are especially useful for quote-heavy steps such as `I create "1" tests with:` and for YAML payloads used in env/bootstrap flows.

Canonical manual headed flow:

```bash
cd packages/syngrisi/e2e
npx bddgen
yarn kill
export SYSTEM_THREAD=manual-browser
npx tsx support/mcp/test-engine-cli.ts start manual-browser --headed
npx tsx support/mcp/test-engine-cli.ts step "I go to \"main\" page"
npx tsx support/mcp/test-engine-cli.ts status
npx tsx support/mcp/test-engine-cli.ts shutdown
```

Operational caveats for the current session-aware CLI:

- Serialize commands for a given `SYSTEM_THREAD`; concurrent `step` calls can mix stdout and screenshot artifacts.
- `start` runs a smoke step before the session is marked healthy.
- `status` includes `health`, `brokenReason`, `eventLogFile`, `lastCommand`, and `lastArtifacts`.
- If a real step fails with `Session not started` after a successful `start`, use `restart` first.
- If a timed-out step is followed by `No active session found`, assume the session continuity is gone and bootstrap again.

Step definitions are loaded dynamically from `packages/syngrisi/e2e/steps/**` and `support/mcp/sd/**`. They are regenerated each time you start a new session—after editing any step definitions, restart the session so clients discover the updated catalogue.

The generated step definitions are organized into categorized YAML files stored in `support/mcp/steps/` (diagnostics, common interactions, assertions, domain-specific steps, etc.). Each YAML file includes metadata (category, generation timestamp, step count, source files) and properly formatted step definitions with descriptions and line numbers.

## STDIO ↔︎ SSE Bridge

If your client only understands stdio JSON-RPC, launch the bridge instead of talking to the HTTP endpoint directly:

```bash
timeout 300s bash -lc 'cd packages/syngrisi/e2e && npx tsx support/mcp/bridge-cli.ts'
```

- The bridge spins up its own stdio MCP server and exposes the same tool names. During bootstrap every call except `session_start_new` and `attach_existing_session` replies with a "Session not started" error.
- Calling `session_start_new` spawns the Playwright-backed HTTP server and attaches a streaming HTTP client transport. When you already have a server running (for example after using the `When I start the MCP test engine` debug step), call `attach_existing_session` to point the bridge at the latest port recorded under `support/mcp/logs/ports/`.
- Logs from the child process are written to `support/mcp/logs/server-<timestamp>.log`. The bridge prints the relative path so you can upload it as an artefact.
- Send `notifications/shutdown` to trigger a graceful shutdown; the bridge waits up to five seconds before escalating to `SIGINT`.
- The debug step `When I start the MCP test engine` is available from the E2E step library. It starts the MCP server, pauses the Playwright inspector, and writes the chosen port number to `support/mcp/logs/ports/<timestamp>.port`, enabling subsequent reconnection via `attach_existing_session`.

For finer control (custom stdio streams or embedding in tests) import `runBridge()` from `bridge.ts`.

## Emergency Cleanup

If the MCP server or bridge processes become unresponsive or "zombie" processes remain, use the provided shell script to forcefully terminate them:

```bash
./support/mcp/kill-mcp.sh
```

This script will:
1. Kill all `bridge-cli.ts` processes
2. Kill all Playwright MCP Server processes (`mcp.spec.ts`)

## Repository Layout

- `mcp.spec.ts` – Playwright entry point that calls `startMcpServer()` and blocks indefinitely.
- `server.ts` – Server factory responsible for loading steps, wiring MCP tools, and managing sessions.
- `bridge.ts` / `bridge-cli.ts` – STDIO bridge implementation and runnable entry point.
- `playwright.config.ts` – Dedicated Playwright configuration for MCP runs.
- `test/` – Transport-level Playwright specs (`mcp-http.spec.ts`, `mcp-bridge-cli.spec.ts`).
- `utils/` – Logging, step definition caching, response formatting, and other shared helpers.
- `sd/diagnostics.sd.ts` – Diagnostic steps designed for manual triggering via MCP.

## Verification

Run the transport tests after changing the harness:

```bash
timeout 180s bash -lc 'cd packages/syngrisi/e2e && E2E_HEADLESS=1 playwright test --config support/mcp/playwright.config.ts support/mcp/test'
```

## Testing policy for `test-engine`

For `support/mcp/test-engine*`, the default strategy is integration and e2e coverage, not unit coverage.

- Prefer CLI/session lifecycle specs such as [support/mcp/test/mcp-test-engine-cli.spec.ts](/Users/a1/Project/syngrisi/packages/syngrisi/e2e/support/mcp/test/mcp-test-engine-cli.spec.ts)
- Prefer transport-level specs for bridge/server behavior
- Prefer real headed/headless smoke flows when changing session reuse, attach, shutdown, or browser lifecycle

Do not add unit tests for the orchestration layer by default. The important contract here is multi-process behavior: session resolution, local state reuse, daemon lifecycle, bridge reconnect, and explicit shutdown.

If a helper becomes small, isolated, and materially cheaper to validate with a unit test than via integration, that is acceptable, but it should be a narrow exception.

### Real scenario ordering

`chromium-real-scenarios` exercises the real MCP workflow (e.g., `mcp-real-scenarios.spec.ts`). Those tests now start the bridge session first, trigger `I start Server` to force the app backend up, and then launch a fresh MCP session so all session data is created against the restarted server. When extending those specs, respect that ordering: start `session_start_new` only after the backend is ready.

The suite covers both the raw HTTP server and the stdio bridge. Attach the generated logs when investigating failures.
