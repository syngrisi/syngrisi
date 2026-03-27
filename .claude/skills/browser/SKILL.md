---
name: browser
description: Browser automation, manual UI debugging, and feature reproduction for Syngrisi via the test-engine CLI. Use this whenever the user wants to walk a browser flow step by step, run a headed UI check, reproduce an E2E scenario from feature files, debug MCP/Test Engine behavior, inspect available BDD steps, or execute a Syngrisi browser workflow without talking to raw JSON-RPC.
invocation: /browser
version: 2.0.0
allowed-tools:
  - Bash
  - Read
  - Write
---

# Browser Automation & Debugging for Syngrisi

Control the Syngrisi browser stack through the local test-engine CLI.

This skill is the Syngrisi analogue of Cape's browser skill, but it uses the Playwright-backed MCP Test Engine wrapper at `packages/syngrisi/e2e/support/mcp/test-engine-cli.ts` instead of CDP.

## Usage

Run from `packages/syngrisi/e2e`.

```bash
yarn start:mcp
```

Equivalent direct entrypoint:

```bash
npx tsx support/mcp/test-engine-cli.ts help
```

## Mandatory Preflight

Before any headed/manual browser flow:

```bash
cd /Users/a1/Project/syngrisi/packages/syngrisi/e2e
npx bddgen
yarn kill
npx tsx support/mcp/test-engine-cli.ts help
```

Interpretation rules:

- `npx bddgen` is mandatory before scenario-oriented work so the generated MCP step catalogs are fresh.
- `yarn kill` is mandatory before headed runs because stale Playwright/Chromium/server processes can cause `ERR_CONNECTION_REFUSED` or broken sessions.
- `help` is a cheap smoke check that confirms the wrapper starts before you launch a long interactive flow.

If preflight fails, stop and fix that first.

## Core Model

The CLI is now session-aware.

Each command is a separate process invocation, but the same browser/MCP session is reused through:

- explicit `--system-thread <id>`
- `SYSTEM_THREAD`
- parent PID heuristics
- fallback to a single active cached session

Core commands:

- `start <sessionName> [--headed] [--system-thread <id>]`
- `restart <sessionName> [--headed] [--system-thread <id>]`
- `attach [--system-thread <id>]`
- `status [--system-thread <id>]`
- `resolve [--system-thread <id>]`
- `tools [--system-thread <id>]`
- `step <stepText> [--docstring <text>] [--docstring-json <json>] [--docstring-base64 <base64>] [--system-thread <id>]`
- `step-json <json> [--system-thread <id>]`
- `batch <step1> <step2> [step3 ...] [--system-thread <id>]`
- `batch-json <json> [--system-thread <id>]`
- `steps find <query>`
- `clear [--system-thread <id>]`
- `shutdown [--system-thread <id>]`
- add `--json` for machine-readable `state`, `health`, `artifacts`, and `eventLogFile`

Rules of thumb:

- `start` once, then run later commands as separate CLI invocations in the same session.
- Run commands sequentially for a given `SYSTEM_THREAD`; do not fire multiple `step` calls in parallel against the same session.
- `start` now runs a mandatory smoke step before the session is considered healthy.
- Prefer `SYSTEM_THREAD` or explicit `--system-thread` for deterministic routing.
- Use `status` or `resolve` to inspect what session the CLI will target.
- Use `tools` as the stable wrapper-level MCP discovery command.
- Prefer `step` for all single actions, assertions, diagnostics, and value-returning steps.
- Use `batch` only for short deterministic sequences when per-step output is not needed.
- Prefer existing BDD/domain steps over low-level locator steps when both exist.
- Prefer `step-json` / `batch-json` when step text contains many quotes or when a docstring must be passed without shell escaping.
- Prefer `--docstring-file` or `--docstring-base64` over raw multiline shell quoting.
- `shutdown` is explicit; the browser should remain alive between separate `step` invocations until you call it.

## Recommended Manual Testing Flow

1. `npx bddgen`
2. `yarn kill`
3. export a stable session id, for example `export SYSTEM_THREAD=manual-browser`
4. `start <sessionName> --headed`
5. Run one setup step at a time with separate `step ...` invocations
6. After each important state transition, run a visible assertion step
7. If the session becomes broken, run `restart <sessionName> --headed`
8. Run `shutdown` only when you explicitly want to close the browser and finish the session

Example:

```bash
export SYSTEM_THREAD=manual-browser
npx tsx support/mcp/test-engine-cli.ts start demo --headed
npx tsx support/mcp/test-engine-cli.ts step "I go to \"main\" page"
npx tsx support/mcp/test-engine-cli.ts status
npx tsx support/mcp/test-engine-cli.ts restart demo --headed
```

Or use explicit routing:

```bash
npx tsx support/mcp/test-engine-cli.ts start demo --headed --system-thread manual-browser
npx tsx support/mcp/test-engine-cli.ts step "I go to \"main\" page" --system-thread manual-browser
npx tsx support/mcp/test-engine-cli.ts shutdown --system-thread manual-browser
```

## Step Selection Strategy

Prefer steps in this order:

1. Domain/business steps from `steps/domain/**`
2. Auth/server/data setup steps
3. Generic semantic UI steps from `steps/common/**`
4. Raw locator steps only as fallback

Before inventing a step, inspect the generated catalogs under `support/mcp/steps/`.

Useful discovery commands:

```bash
npx tsx support/mcp/test-engine-cli.ts steps find tolerance threshold
```

```bash
export SYSTEM_THREAD=discover-browser
npx tsx support/mcp/test-engine-cli.ts start discover --headed
npx tsx support/mcp/test-engine-cli.ts tools
npx tsx support/mcp/test-engine-cli.ts shutdown
```

## Quoting & Docstring Rules

### Single-line step text

```bash
npx tsx support/mcp/test-engine-cli.ts step "I login with user:\"Test\" password \"123456aA-\""
```

### Multiline docstring

Prefer base64:

```bash
DOC_B64=$(node -e 'process.stdout.write(Buffer.from(`SYNGRISI_TEST_MODE: "true"\nSYNGRISI_AUTH: "false"`).toString("base64"))')

npx tsx support/mcp/test-engine-cli.ts \
  start env-demo --headed

npx tsx support/mcp/test-engine-cli.ts \
  step "I set env variables:" --docstring-base64 "$DOC_B64"

npx tsx support/mcp/test-engine-cli.ts \
  shutdown
```

Or pass a file directly:

```bash
cat > /tmp/syngrisi-env.yml <<'EOF'
SYNGRISI_TEST_MODE: "true"
SYNGRISI_AUTH: "false"
EOF

npx tsx support/mcp/test-engine-cli.ts \
  start env-demo --headed

npx tsx support/mcp/test-engine-cli.ts \
  step "I set env variables:" --docstring-file /tmp/syngrisi-env.yml

npx tsx support/mcp/test-engine-cli.ts \
  shutdown
```

### Structured JSON mode

Use this when step text or payload quoting becomes fragile:

```bash
npx tsx support/mcp/test-engine-cli.ts start json-demo
npx tsx support/mcp/test-engine-cli.ts step-json '{"stepText":"I test"}'
npx tsx support/mcp/test-engine-cli.ts batch-json '[{"stepText":"I test"},{"stepText":"I get current URL"}]'
npx tsx support/mcp/test-engine-cli.ts shutdown
```

### Literal quotes inside step text

If shell quoting becomes messy, build a reusable variable first:

```bash
STEP_CREATE_USER_ARGS=("step" "I create via http user as:\"Test\" with params:" "--docstring-base64" "$DOC_B64")
npx tsx support/mcp/test-engine-cli.ts "${STEP_CREATE_USER_ARGS[@]}"
```

More patterns are in [step-patterns.md](step-patterns.md).

## Operational Cookbook

### 1) Headed login smoke

Use this for auth sanity checks and session creation validation.

```bash
export SYSTEM_THREAD=headed-login-smoke
ENV_FALSE_B64=$(node -e 'process.stdout.write(Buffer.from(`SYNGRISI_TEST_MODE: "true"\nSYNGRISI_AUTH: "false"`).toString("base64"))')
ENV_TRUE_B64=$(node -e 'process.stdout.write(Buffer.from(`SYNGRISI_TEST_MODE: "false"\nSYNGRISI_AUTH: "true"`).toString("base64"))')

npx tsx support/mcp/test-engine-cli.ts start headed-login-smoke --headed
npx tsx support/mcp/test-engine-cli.ts step "I clear Database and stop Server"
npx tsx support/mcp/test-engine-cli.ts step "I set env variables:" --docstring-base64 "$ENV_FALSE_B64"
npx tsx support/mcp/test-engine-cli.ts step "I start Server"
npx tsx support/mcp/test-engine-cli.ts step "I create via http test user"
npx tsx support/mcp/test-engine-cli.ts step "I stop Server"
npx tsx support/mcp/test-engine-cli.ts step "I set env variables:" --docstring-base64 "$ENV_TRUE_B64"
npx tsx support/mcp/test-engine-cli.ts step "I start Server and start Driver"
npx tsx support/mcp/test-engine-cli.ts step "I reload session"
npx tsx support/mcp/test-engine-cli.ts step "I login with user:\"Test\" password \"123456aA-\""
npx tsx support/mcp/test-engine-cli.ts step "I wait 30 seconds for the element with locator \"span*=TA\" to be visible"
npx tsx support/mcp/test-engine-cli.ts shutdown
```

### 2) Main page sanity flow

Use this for table/list smoke verification.

```bash
export SYSTEM_THREAD=headed-main-page
npx tsx support/mcp/test-engine-cli.ts start headed-main-page --headed
npx tsx support/mcp/test-engine-cli.ts step "the database is cleared"
npx tsx support/mcp/test-engine-cli.ts step "I open the app"
npx tsx support/mcp/test-engine-cli.ts step "I clear local storage"
npx tsx support/mcp/test-engine-cli.ts step "I create a test run \"Sanity Test A\" with 1 checks"
npx tsx support/mcp/test-engine-cli.ts step "I go to \"main\" page"
npx tsx support/mcp/test-engine-cli.ts step "the title is \"By Runs\""
npx tsx support/mcp/test-engine-cli.ts step "the element with locator \"[data-table-test-name='Sanity Test A']\" should be visible"
npx tsx support/mcp/test-engine-cli.ts step "I wait on element \"[data-table-check-name='Check 1']\" to not be displayed"
npx tsx support/mcp/test-engine-cli.ts shutdown
```

### 3) Check details navigation

Use this for the core user flow of opening a check and moving between results.

```bash
export SYSTEM_THREAD=headed-check-navigation
npx tsx support/mcp/test-engine-cli.ts start headed-check-navigation --headed
npx tsx support/mcp/test-engine-cli.ts step "the database is cleared"
npx tsx support/mcp/test-engine-cli.ts step "I create a test run \"NavCheckTest\" with 3 checks"
npx tsx support/mcp/test-engine-cli.ts step "I go to \"main\" page"
npx tsx support/mcp/test-engine-cli.ts step "I wait for test \"NavCheckTest\" to appear in table"
npx tsx support/mcp/test-engine-cli.ts step "I unfold the test \"NavCheckTest\""
npx tsx support/mcp/test-engine-cli.ts step "I open the 1st check \"Check 1\""
npx tsx support/mcp/test-engine-cli.ts step "I should see the check details for \"Check 1\""
npx tsx support/mcp/test-engine-cli.ts step "the \"Next Check\" button should be \"enabled\""
npx tsx support/mcp/test-engine-cli.ts step "I click the \"Next Check\" button"
npx tsx support/mcp/test-engine-cli.ts step "I should see the check details for \"Check 2\""
npx tsx support/mcp/test-engine-cli.ts shutdown
```

### 4) Debug attach flow

Use this when a scenario already launched a debug MCP server and recorded a `.port` file.

```bash
export SYSTEM_THREAD=debug-attach
npx tsx support/mcp/test-engine-cli.ts attach
npx tsx support/mcp/test-engine-cli.ts tools
npx tsx support/mcp/test-engine-cli.ts shutdown
```

## Session Semantics

- `start` creates or reuses a long-lived daemon for the resolved agent id.
- `step`, `batch`, `tools`, `clear`, `status`, and `shutdown` are expected to be called as separate shell commands.
- `start` returns `Reused: yes` when the session already exists for the resolved agent id.
- `shutdown` is the only normal way to end the session and close the browser.
- If session resolution is ambiguous, pass `--system-thread` explicitly instead of relying on heuristics.

## Current Runtime Caveats

- Treat one `SYSTEM_THREAD` as a strictly serialized command stream. Parallel commands can mix stdout and artifacts.
- Treat `health` as the primary session signal:
  - `ready` means smoke passed and the daemon is idle
  - `busy` means a command is running
  - `broken` means replace the session with `restart`
  - `shutting_down` means teardown is in progress
- If auto-resolution fails with `multiple active sessions exist`, stop relying on fallback and pass explicit `--system-thread` or `SYSTEM_THREAD`.
- If `status` says the session exists but a real `step` fails with `Session not started`, assume the daemon and bridge drifted out of sync.
- If a regular user step times out and the next command says `No active session found`, treat the session as broken and restart it from `yarn kill` plus fresh `start`.
- `status` now includes `eventLogFile`, `lastCommand`, `currentCommand`, `brokenReason`, and `lastArtifacts`.
- Use `--json` when the caller needs structured output instead of text.

## Testing Policy

For `support/mcp/test-engine*`, prefer:

- integration tests for CLI/session lifecycle
- bridge/server transport tests
- manual or e2e smoke checks for real browser behavior

Do not default to unit tests for the orchestration layer. The real contract is cross-process session reuse and shutdown behavior, so integration coverage is the primary signal.

## Canonical Manual Flow

Use this as the default headed debugging recipe:

1. `cd /Users/a1/Project/syngrisi/packages/syngrisi/e2e`
2. `npx bddgen`
3. `yarn kill`
4. `export SYSTEM_THREAD=manual-browser`
5. `npx tsx support/mcp/test-engine-cli.ts start manual-browser --headed`
6. Run each `step ...` as a separate CLI invocation
7. Use `status` to confirm you are still attached to the same session
8. Call `shutdown` only when you actually want to close the browser

### 5) Baseline tolerance demo

Use this when you need to demonstrate or debug the per-baseline `toleranceThreshold` feature in Check Details.

Recommended approach:

1. Start `--headed` once with a stable `SYSTEM_THREAD`
2. Create baseline and diff checks one step at a time
3. Open Check Details
4. Use the dropdown with `Auto-ignore Mode`
5. Click `Auto-calc`, then `Save`
6. Verify `[data-check='tolerance-indicator']` is visible
7. Do not call `shutdown` if the browser must stay open

## Troubleshooting Workflow

If a flow breaks:

1. Read the exact failing step text
2. Confirm the step exists in `support/mcp/steps/**/*.yaml`
3. Retry from clean state with `yarn kill`
4. Re-run a cheap real step such as `I test` or `I get current URL` to confirm the session is still usable
5. If `status` is `broken`, call `restart <sessionName> --headed`
6. If `status` looks healthy but real steps fail with `Session not started`, discard the session and bootstrap a new one
7. Prefer `step` over `batch` to isolate the failing action
8. For docstrings, switch to `--docstring-base64`
9. For quote-heavy steps, either prebuild shell variables/argv arrays or execute one `step` at a time as separate CLI invocations

See [troubleshooting-guide.md](troubleshooting-guide.md) for symptom-based diagnosis.

## Files to read when needed

- [step-patterns.md](step-patterns.md) — quoting, docstrings, and command composition
- [flow-recipes.md](flow-recipes.md) — reusable headed flows and setup snippets
- [troubleshooting-guide.md](troubleshooting-guide.md) — failure symptoms and fixes

## Reporting Back

When using this skill:

- Report the exact flow you ran
- Report whether it was headed or headless
- Point out if you had to use `yarn kill` or docstring base64 workarounds
- If the issue is in a step implementation rather than the CLI wrapper, say so explicitly
