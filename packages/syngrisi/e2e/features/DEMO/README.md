# Demo Tests

This folder contains demonstration tests that showcase Syngrisi features with narration and visual highlights.

## Available Demo Tests

### 1. Baselines Spotlight Demo
**File:** `baselines_spotlight_demo.feature`

Demonstrates navigation to the Baselines section via Spotlight search.

**Run:**
```bash
# Debug mode (skip demo steps)
SKIP_DEMO_TESTS=true npx bddgen && yarn playwright test "features/DEMO/baselines_spotlight_demo.feature" --workers=1 --headed

# Full demo mode (with narration and animations)
npx bddgen && yarn playwright test "features/DEMO/baselines_spotlight_demo.feature" --workers=1 --headed
```

### 2. Navigation Demo
**File:** `navigation_demo.feature`

Demonstrates navigation between checks and tests in the Check Details modal.

**Run:**
```bash
# Debug mode
SKIP_DEMO_TESTS=true npx bddgen && yarn playwright test "features/DEMO/navigation_demo.feature" --workers=1 --headed

# Full demo mode
npx bddgen && yarn playwright test "features/DEMO/navigation_demo.feature" --workers=1 --headed
```

### 3. SSO OAuth2 Demo
**File:** `sso_oauth2_demo.feature`

Demonstrates OAuth2 SSO authentication flow with Logto Identity Provider.

**Prerequisites:**
1. Start Logto infrastructure: `./support/sso/setup-logto.sh`
2. Or use Apple Container CLI: `container system start`

**Scenarios:**
- OAuth2 SSO Login with Logto Identity Provider
- OAuth2 Configuration Overview
- OAuth2 Account Linking

**Run:**
```bash
# Debug mode (skip demo steps, requires Logto)
SKIP_DEMO_TESTS=true npx bddgen && yarn playwright test "features/DEMO/sso_oauth2_demo.feature" --workers=1 --headed

# Full demo mode (with narration, requires Logto)
npx bddgen && yarn playwright test "features/DEMO/sso_oauth2_demo.feature" --workers=1 --headed

# Specific scenario
npx bddgen && yarn playwright test "features/DEMO/sso_oauth2_demo.feature" --grep "OAuth2 SSO Login" --workers=1 --headed
```

### 4. SSO SAML Demo
**File:** `sso_saml_demo.feature`

Demonstrates SAML 2.0 SSO authentication flow with Logto as SAML Identity Provider.

**Prerequisites:**
1. Start Logto infrastructure: `./support/sso/setup-logto.sh`
2. Provisioning must be completed (done automatically by setup script)

**Scenarios:**
- SAML 2.0 SSO Login with Logto IdP
- SAML Configuration and Trust
- SAML Account Linking
- SAML User Provisioning

**Run:**
```bash
# Debug mode (skip demo steps, requires Logto)
SKIP_DEMO_TESTS=true npx bddgen && yarn playwright test "features/DEMO/sso_saml_demo.feature" --workers=1 --headed

# Full demo mode (with narration, requires Logto)
npx bddgen && yarn playwright test "features/DEMO/sso_saml_demo.feature" --workers=1 --headed

# Specific scenario
npx bddgen && yarn playwright test "features/DEMO/sso_saml_demo.feature" --grep "SAML 2.0 SSO Login" --workers=1 --headed
```

## Environment Variables

### SKIP_DEMO_TESTS
**Default:** `false`

When set to `true`, all demo-specific steps are skipped:
- `When I announce: {string}`
- `When I announce: {string} and PAUSE`
- `When I highlight element {string}`
- `When I clear highlight`
- `When I end the demo`

**Usage:**
```bash
SKIP_DEMO_TESTS=true npx bddgen && yarn playwright test "features/DEMO/your_demo.feature" --workers=1 --headed
```

**Benefits:**
- Faster test execution during development
- Debug test logic without waiting for text-to-speech
- Run tests in CI environments where demo features are not available
- No code changes needed - keep demo steps in feature files

## Development Workflow

### 1. Initial Development
Write your scenario with all demo steps included from the start.

### 2. Debug & Test
Run with `SKIP_DEMO_TESTS=true` to quickly iterate:
- Verify selectors work correctly
- Check test logic and assertions
- Identify timing issues

### 3. Final Verification
Run with full demo experience to verify:
- Text-to-speech announcements
- Element highlights
- Visual effects and animations
- Confetti celebration

## Demo Steps Reference

All demo step definitions are in: `packages/syngrisi/e2e/steps/common/demo.steps.ts`

Available steps:
- `When I announce: "message"` - Show message banner with text-to-speech
- `When I announce: "message" and PAUSE` - Announce and pause execution
- `When I highlight element "selector"` - Highlight element with animated border
- `When I clear highlight` - Remove all highlights
- `When I end the demo` - Show confetti celebration

## Writing Demo Tests

See the guide: `packages/syngrisi/docs/agent/guides/create-demo-test.md`

Key principles:
- Always use `@demo` tag
- All demo tests must be in `features/DEMO/` folder
- Keep narration concise (1-2 sentences)
- Follow pattern: highlight → announce → action → assert
- End with clear highlight and demo completion

## CI/CD Integration

Demo tests are automatically skipped in CI environments (when `CI=true`). Additionally, you can explicitly skip demo steps:

```yaml
# .github/workflows/e2e.yml
- name: Run demo tests
  run: SKIP_DEMO_TESTS=true npm run test:demo
```

## Troubleshooting

### SSO Tests Fail
- Ensure Logto is running: `./support/sso/setup-logto.sh`
- Check Apple Container CLI: `container system start`
- Verify ports 3001, 3050, 5433 are available

### Text-to-Speech Not Working
- macOS only: Requires `say` command
- Set `SKIP_DEMO_TESTS=true` to skip TTS
- Demo steps are no-op in CI environments

### Database Errors
- Clear test database: `mongo SyngrisiDbTest0 --eval "db.dropDatabase()"`
- Check MongoDB is running: `mongosh --eval "db.version()"`
