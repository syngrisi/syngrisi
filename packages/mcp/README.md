# @syngrisi/mcp

Official [Model Context Protocol](https://modelcontextprotocol.io) server for
[Syngrisi](https://github.com/syngrisi/syngrisi) — the open-source, self-hosted visual
testing platform. It lets AI coding agents (Claude Code, Cursor, ...) ask "what broke in
the last run?", look at baseline/actual/diff images, and accept checks — straight from
the IDE, over stdio, without touching the browser UI.

This is a thin adapter over your running Syngrisi instance's REST API. It does not run
tests itself — see `@syngrisi/playwright-sdk` / `@syngrisi/wdio-sdk` for that, or the
internal MCP *test engine* documented in `packages/syngrisi/docs/agent/guides/mcp_test_engine_using.md`
for driving BDD e2e steps.

## Install & run

No install needed — run it directly with `npx`:

```shell
npx -y @syngrisi/mcp --url http://localhost:3000 --api-key <your-api-key>
```

`--api-key` can be omitted for instances started with `SYNGRISI_AUTH=false`.

### Claude Code

```shell
claude mcp add syngrisi -- npx -y @syngrisi/mcp --url http://localhost:3000 --api-key <your-api-key>
```

### Cursor (`.cursor/mcp.json`)

```json
{
  "mcpServers": {
    "syngrisi": {
      "command": "npx",
      "args": ["-y", "@syngrisi/mcp", "--url", "http://localhost:3000", "--api-key", "<your-api-key>"]
    }
  }
}
```

## Configuration

Configuration is env-only (plus two CLI flags that override the env) — there are no
config files.

| Env var | CLI flag | Required | Description |
|---|---|---|---|
| `SYNGRISI_URL` | `--url` | Yes | Base URL of the Syngrisi instance, e.g. `http://localhost:3000` |
| `SYNGRISI_API_KEY` | `--api-key` | No | API key; omit for instances with `SYNGRISI_AUTH=false` |

## Tools

| Tool | Arguments | Description |
|---|---|---|
| `list_runs` | `app?`, `limit?` | Recent runs (id, name, app, createdDate), newest-first |
| `get_run_status` | `runId?` | Aggregate status of a run: total/passed/failed/new tests + failed check names. Defaults to the latest run |
| `get_failed_checks` | `runId?`, `limit?` | Failed checks in a run: name, browser, viewport, os, branch, mismatch %, fail reasons |
| `get_check` | `checkId` | Full details of one check, including snapshot filenames and image URLs |
| `get_check_images` | `checkId`, `which?` (`baseline`\|`actual`\|`diff`\|`all`) | Inline images (base64 PNG) for a check. Refuses images over 8MB |
| `accept_check` | `checkId`, `baselineId?` | Accept a check, promoting its actual snapshot (or a given `baselineId`) to the new baseline |

Every tool returns a compact human-readable text summary first, then structured JSON in
the same response. Errors never throw — they come back as `isError: true` with a text
message. The API key is never included in any tool output or log.

### Known limitation

A few Syngrisi REST endpoints used here (`GET /v1/runs`, `GET /v1/snapshots`) are
session-auth only in some server versions and don't accept the `apikey` header — this
package still sends it (harmless), and works around the gap for check-related tools by
requesting `populate=baselineId,actualSnapshotId,diffId` on `GET /v1/checks` (which does
accept an API key) instead of calling `/v1/snapshots` separately. `list_runs` /
`get_run_status`'s default-latest-run resolution may not work against an auth-enabled
instance when using an API key only, without an authenticated session; it works
correctly when `SYNGRISI_AUTH=false` or when called from an already-authenticated
client.

## Development

```shell
yarn build       # compile to dist/
yarn test        # node:test against a stubbed Syngrisi server
yarn smoke:live   # end-to-end smoke against a real, running Syngrisi instance
```
