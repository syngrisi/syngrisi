# AGENTS.md

## Common rules

- Answer in the language you are asked in.
- Always write comments and debug messages in your code in English.

## Release Process

See [Release Cycle Documentation](docs/RELEASE_CYCLE.md) for detailed instructions on versioning, changelogs, and publishing packages.


## E2E Testing Guides

- [Run Tests Guide](packages/syngrisi/docs/agent/guides/run_test.md)
- [Common Steps Cheatsheet](packages/syngrisi/docs/agent/guides/common_steps_cheatsheet.md)
- [MCP Test Engine Usage](packages/syngrisi/docs/agent/guides/mcp_test_engine_using.md)
- [Quick Test Generation](packages/syngrisi/docs/agent/guides/test-generate-quick.md)
- [All Guides Index](packages/syngrisi/docs/agent/INDEX.md)

## Definition of Done (DoD) Checklist

Before marking a task as complete, conduct a final self-review using the following checklist:

1. **Test Coverage & Execution:** Have all necessary tests (or demo scripts) for the new functionality been written and successfully executed?
2. **Documentation:** Is the documentation (README, code comments, usage guides) updated to reflect the new changes?
3. **Code Review:** Have you reviewed all modified files for syntax errors, leftover debug code (console.logs/prints), and coding standards?
4. **Smoke Testing:** Have you run a smoke test to ensure the main functionality is working and no regressions were introduced?
