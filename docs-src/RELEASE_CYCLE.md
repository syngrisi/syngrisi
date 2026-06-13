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

2. **Commit and push** the changeset (add `[skip-e2e]` if E2E tests already passed locally):
   ```bash
   git add .changeset/ && git commit -m "chore: add changeset [skip-e2e]" && git push
   ```

3. **Wait for CI** (build + unit tests) → Release workflow automatically creates a PR titled "chore(release): version packages"

4. **Merge the PR locally** and push (no admin rights needed):
   ```bash
   git fetch origin changeset-release/main && git merge origin/changeset-release/main && git push
   ```
   > If the merge commit triggers E2E and they fail on flaky tests, push a retry:
   > ```bash
   > git commit --allow-empty -m "ci: retry [skip-e2e]" && git push
   > ```

5. **Wait for Release workflow** — it publishes packages to npm and creates a GitHub Release

6. **Verify**:
   ```bash
   npm view @syngrisi/syngrisi version
   gh release list --limit 3
   ```

## Skip E2E Tests on CI

Add `[skip-e2e]` to the commit message to skip E2E tests while keeping build, unit tests, and release workflow running:

```bash
git commit -m "chore: add changeset [skip-e2e]"
# or for an empty retry commit:
git commit --allow-empty -m "ci: retry [skip-e2e]"
```

> **Warning**: Do NOT use `[skip ci]` in commit messages — this blocks ALL workflows including the release workflow! Use `[skip-e2e]` instead.

## Quick Release (Skip CI Tests)

If tests have already been run locally and you want to release quickly:

### Option A: Skip E2E via commit message (no admin rights needed)

1. Create changeset and commit with `[skip-e2e]`:
   ```bash
   git commit -m "chore: add changeset [skip-e2e]" && git push
   ```
2. Wait for CI (build + unit tests only) → Release workflow creates a PR
3. Merge the PR → Release workflow publishes to npm

### Option B: Skip CI check via workflow dispatch (requires admin rights)

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

### Verify release

```bash
npm view @syngrisi/syngrisi version
```

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
