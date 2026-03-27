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

## Baseline Tolerance Threshold

Syngrisi supports `toleranceThreshold` in percent on a per-baseline basis.

- If `rawMisMatchPercentage <= toleranceThreshold`, the check passes.
- `wrong_dimensions` still fails regardless of the threshold.
- The actual diff percent is still preserved in the check result.
- The threshold can be changed in Check Details from the same dropdown as `Auto-ignore Mode`.
- `Auto-calc` in that dropdown sets the threshold to `currentDiff + 0.01`.
- When a threshold is saved from Check Details, the current check is immediately re-compared.
- The client API `POST /v1/client/createCheck` also accepts `toleranceThreshold`; when a matching baseline already exists for the same ident, that baseline is updated with the provided threshold.

## Documentation

- [Main App Documentation](packages/syngrisi/CLAUDE.md)
- [Development Guide](packages/syngrisi/docs/DEVELOPMENT.md)
- [E2E Test Guidelines](packages/syngrisi/e2e/CLAUDE.md)
- [Environment Variables](packages/syngrisi/docs/environment_variables.md)
- [API Documentation](http://localhost:3000/swagger/) (when server is running)

## License

MIT
