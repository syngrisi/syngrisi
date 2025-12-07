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

### Troubleshooting

If release fails:
1. Check GitHub Actions logs for errors
2. For OIDC issues with non-scoped packages, add `NPM_TOKEN` secret or rename to `@syngrisi/` scope
3. Create GitHub Release manually if needed: `gh release create vX.Y.Z --generate-notes`

