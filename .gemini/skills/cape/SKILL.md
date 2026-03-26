---
name: cape
description: Interactive Syngrisi MCP test-engine wrapper for guided debugging, step execution, and debug-session attachment
invocation: /cape
version: 1.0.0
allowed-tools:
  - Bash
  - Read
---

# Cape Skill

Use this skill when you want a Cape-style workflow over the Syngrisi MCP Test Engine without talking to raw JSON-RPC directly.

## When to use

- Quick manual debugging through the MCP test engine
- Reproducing a UI flow step by step
- Attaching to an already running debug MCP session
- Exploring available MCP tools before running steps

## Start commands

Run from `packages/syngrisi/e2e`:

```bash
yarn start:mcp
```

Raw bridge mode is still available when needed:

```bash
yarn start:mcp:bridge
```

## Core workflow

1. Start the wrapper.
2. Run `start <sessionName>` or `attach`.
3. Use `step` for a single action or diagnostic step.
4. Use `batch` only for 2 or more sequential steps.
5. Run `shutdown` when finished.

## Commands

- `help`
- `start <sessionName> [--headed]`
- `attach`
- `tools`
- `step <stepText> [--docstring <text>] [--docstring-json <json>]`
- `batch <step1> <step2> [step3 ...]`
- `clear`
- `shutdown`
- `exit`

## Rules of thumb

- Always `start` or `attach` before executing steps.
- Prefer `step` for all single actions, diagnostics, and value-returning steps.
- Use `batch` only for multi-step reproduction.
- Prefer the existing step catalog over raw browser mechanics.
- If a session becomes inconsistent, run `clear` and start a fresh session.

## Example session

```text
start demo-session
step "I test"
step "I get current URL"
shutdown
```

## Debug attach flow

If a scenario already started the debug MCP server and wrote a port file into `support/mcp/logs/ports/`, use:

```text
attach
tools
start attached-session
```
