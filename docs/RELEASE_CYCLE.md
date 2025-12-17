# Release Process

This monorepo uses **Changesets** for version management and automated releases via GitHub Actions.

## How to Release

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

## Quick Release (Skip CI Tests)

If tests have already been run locally and you want to release quickly:

1. Create and push changeset as above
2. **Manually trigger** the Release workflow with skip option:
   ```bash
   gh workflow run release.yml -f skip_ci_check=true
   ```
3. Wait for PR to be created, then merge it
4. **Trigger release again** after merge (CI will start on merge commit):
   ```bash
   gh workflow run release.yml -f skip_ci_check=true
   ```
5. Verify packages on NPM:
   ```bash
   npm view @syngrisi/syngrisi version
   ```

> **Warning**: Do NOT use `[skip ci]` in commit messages — this blocks ALL workflows including the release workflow!

## Version Types

- **patch** (2.4.0 → 2.4.1): Bug fixes, CI improvements, documentation
- **minor** (2.4.0 → 2.5.0): New features (backwards compatible)
- **major** (2.4.0 → 3.0.0): Breaking changes

## Published Packages

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

## Troubleshooting

### Release workflow not triggered
- Check if commit message contains `[skip ci]` — this blocks all workflows
- Manually trigger: `gh workflow run release.yml -f skip_ci_check=true`

### CI running after merge (tests taking too long)
- Cancel CI: `gh run cancel <run_id>`
- Trigger release manually with skip: `gh workflow run release.yml -f skip_ci_check=true`

### GitHub Release created as Draft
- Publish manually: `gh release edit vX.Y.Z --draft=false`

### No GitHub Release created
- Create manually: `gh release create vX.Y.Z --generate-notes`

### OIDC/NPM publishing issues
- For non-scoped packages, add `NPM_TOKEN` secret
- Or rename package to `@syngrisi/` scope

### Verify release
```bash
# Check NPM versions
npm view @syngrisi/syngrisi version
npm view @syngrisi/playwright-sdk version

# Check GitHub releases
gh release list --limit 3

# Check local version after pull
git pull && cat packages/syngrisi/package.json | grep version
```
