# Syngrisi

Visual Testing Tool - compare screenshots and detect visual regressions.

## Monorepo Structure

```
packages/
├── syngrisi/                    # Main application (Express + React)
├── core-api/                    # Core JS client SDK
├── playwright-sdk/              # Playwright testing SDK
├── wdio-sdk/                    # WebdriverIO SDK
├── node-resemble.js/            # Image comparison library
├── create-sy/                   # CLI setup tool (npx create-sy)
├── wdio-syngrisi-cucumber-service/      # WDIO Cucumber service
└── wdio-cucumber-viewport-logger-service/ # WDIO viewport logger
```

## Requirements

- Node.js >= 22.19.0
- Yarn >= 1.22.0 (npm is blocked)
- MongoDB 8.0+

## Quick Start

```bash
# Install dependencies
yarn install

# Build all packages
yarn build

# Start main application
yarn start

# Run tests
yarn test
```

## Development

```bash
# Run E2E tests
cd packages/syngrisi/e2e && npx bddgen && npx playwright test

# Run smoke tests
yarn --cwd packages/syngrisi smoke

# Build specific package
yarn --cwd packages/core-api build
```

## Tolerance Threshold

Syngrisi supports `toleranceThreshold` (0-100%) to allow checks with small visual differences to pass.

- If `rawMisMatchPercentage <= toleranceThreshold`, the check passes.
- `wrong_dimensions` still fails regardless of the threshold.
- The actual diff percent is still preserved in the check result.

Tolerance can be set at two levels:

- **Per-baseline** — via the Check Details UI (same dropdown as `Auto-ignore Mode`). `Auto-calc` sets the threshold to `currentDiff + 0.01`. When saved, the current check is immediately re-compared.
- **Per-check via API** — `POST /v1/client/createCheck` accepts `toleranceThreshold` which overrides the baseline tolerance for that specific check only, without modifying the baseline.

## Documentation

- [Main App Documentation](packages/syngrisi/CLAUDE.md)
- [Development Guide](packages/syngrisi/docs/DEVELOPMENT.md)
- [E2E Test Guidelines](packages/syngrisi/e2e/CLAUDE.md)
- [Environment Variables](packages/syngrisi/docs/environment_variables.md)
- [API Documentation](http://localhost:3000/swagger/) (when server is running)

## License

MIT
