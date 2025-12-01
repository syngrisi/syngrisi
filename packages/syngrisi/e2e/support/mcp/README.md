# MCP Support Utilities

This directory packages the Syngrisi end-to-end Playwright stack as a Model Context Protocol (MCP) service. The same server can be reached over HTTP/SSE or through a stdio bridge, making it convenient for local debugging, automated diagnostics, and LLM-driven workflows.

## Quick Start

From the repository root:

```bash
timeout 300s bash -lc 'cd packages/syngrisi/e2e && npm run test:mcp:headed'
```

That script expands to `cross-env MCP_KEEP_ALIVE=1 E2E_HEADLESS=0 playwright test --workers=1 --config support/mcp/playwright.config.ts support/mcp/mcp.spec.ts`. It launches the full Syngrisi app, opens Chromium headed, and keeps the MCP server alive until you interrupt it.

Need an ephemeral run instead? Force the Playwright spec to exit once diagnostics finish:

```bash
timeout 300s bash -lc 'cd packages/syngrisi/e2e && MCP_KEEP_ALIVE=0 E2E_HEADLESS=1 npm run test:mcp'
```

The server uses dynamic port allocation (port 0), letting the OS assign a free port automatically. The actual port is reported as `🚀 MCP server listening at http://localhost:<port>`.

## Tools Exposed by the Server

`server.ts` builds the MCP surface using `playwright-mcp-advanced` and helper utilities in `utils/`:

- `session_start_new` – Starts a named logging session, regenerates the categorized step definitions as YAML files (returning paths to all generated files), spins up a Playwright page, and navigates to the app under test.
- `step_execute_single` – Execute a single BDD step with optional `stepDocstring` parameter for table or multi-line payload. **ALWAYS use this tool for single steps, diagnostic steps, and steps that return values**. This is the primary tool for step-by-step execution and debugging. Each run updates the active session log stored alongside other diagnostics. для ровно одного шага.
- `step_execute_many` – Validate and execute multiple steps in sequence. **Use ONLY for reproducing multiple steps together**. **DO NOT use for single steps, diagnostic steps, or steps that return values** (this tool does not return individual step results). использовать только при ≥2 шагах; одиночные шаги запрещены.
- `attach_existing_session` – Attach the bridge to a Playwright MCP server that was launched separately (for example via the debug step described below) by reading the latest port file in `support/mcp/logs/ports/`.
- `sd/diagnostics.sd.ts` includes utilities such as `When I analyze current page`, which provides page analysis for AI agents.

Step definitions are loaded dynamically from `packages/syngrisi/e2e/steps/**` and `support/mcp/sd/**`. They are regenerated each time you start a new session—after editing any step definitions, restart the session so clients discover the updated catalogue.

The generated step definitions are organized into categorized YAML files stored in `support/mcp/steps/` (diagnostics, common interactions, assertions, domain-specific steps, etc.). Each YAML file includes metadata (category, generation timestamp, step count, source files) and properly formatted step definitions with descriptions and line numbers.

## STDIO ↔︎ SSE Bridge

If your client only understands stdio JSON-RPC, launch the bridge instead of talking to the HTTP endpoint directly:

```bash
timeout 300s bash -lc 'cd packages/syngrisi/e2e && npx tsx support/mcp/bridge-cli.ts'
```

- The bridge spins up its own stdio MCP server and exposes the same tool names. During bootstrap every call except `session_start_new` and `attach_existing_session` replies with a "Session not started" error.
- Calling `session_start_new` spawns the Playwright-backed HTTP server (with `MCP_KEEP_ALIVE=0` so it shuts down when the bridge does) and attaches a streaming HTTP client transport. When you already have a server running (for example after using the `When I start the MCP test engine` debug step), call `attach_existing_session` to point the bridge at the latest port recorded under `support/mcp/logs/ports/`.
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
timeout 180s bash -lc 'cd packages/syngrisi/e2e && MCP_KEEP_ALIVE=0 E2E_HEADLESS=1 playwright test --config support/mcp/playwright.config.ts support/mcp/test'
```

The suite covers both the raw HTTP server and the stdio bridge. Attach the generated logs when investigating failures.

