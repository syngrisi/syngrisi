# AGENTS.md

## Common rules

- Answer in the language you are asked in.
- Always write comments and debug messages in your code in English.

## Release Process

This monorepo uses **Changesets** for version management and automated releases via GitHub Actions.

### How to Release

1. **Create a changeset** for your changes:
   ```bash
   npx changeset add
   ```
   Or create a file manually in `.changeset/[random-name].md`:
   ```markdown
   ---
   "@syngrisi/syngrisi": patch
   ---

   Brief description of changes
   ```

2. **Commit and push** the changeset:
   ```bash
   git add .changeset/ && git commit -m "chore: add changeset" && git push
   ```

3. **Wait for Changesets PR** - GitHub Actions will automatically create a PR titled "chore(release): version packages"

4. **Merge the PR** - This triggers the release workflow which:
   - Publishes packages to npm using OIDC (no token needed for `@syngrisi/*` packages)
   - Creates a GitHub Release with auto-generated notes

### Version Types

- **patch** (2.4.0 → 2.4.1): Bug fixes, CI improvements, documentation
- **minor** (2.4.0 → 2.5.0): New features (backwards compatible)
- **major** (2.4.0 → 3.0.0): Breaking changes

### Published Packages

Packages with `@syngrisi/` scope are published via npm OIDC:
- `@syngrisi/syngrisi` - Main server package
- `@syngrisi/playwright-sdk` - Playwright integration
- `@syngrisi/wdio-sdk` - WebdriverIO integration
- `@syngrisi/core-api` - Core API client
- `@syngrisi/node-resemble.js` - Image comparison library

Other published packages (require NPM_TOKEN for publishing):
- `create-sy` - CLI tool for scaffolding new Syngrisi projects (`npm create sy`)
- `wdio-syngrisi-cucumber-service` - WebdriverIO Cucumber integration service
- `wdio-cucumber-viewport-logger-service` - WebdriverIO viewport logging service

### Troubleshooting

If release fails:
1. Check GitHub Actions logs for errors
2. For OIDC issues with non-scoped packages, add `NPM_TOKEN` secret or rename to `@syngrisi/` scope
3. Create GitHub Release manually if needed: `gh release create vX.Y.Z --generate-notes`

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
