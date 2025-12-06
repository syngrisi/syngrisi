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

## Packages

| Package | Version | Description |
|---------|---------|-------------|
| `@syngrisi/syngrisi` | 2.4.0 | Main visual testing application |
| `@syngrisi/core-api` | 2.4.0 | Core JS client for API communication |
| `@syngrisi/playwright-sdk` | 2.4.0 | Playwright integration SDK |
| `@syngrisi/wdio-sdk` | 2.4.0 | WebdriverIO integration SDK |
| `@syngrisi/node-resemble.js` | 2.4.0 | Image comparison library |
| `create-sy` | 2.4.0 | CLI tool for project setup |
| `wdio-syngrisi-cucumber-service` | 2.4.0 | WDIO Cucumber service |
| `wdio-cucumber-viewport-logger-service` | 2.4.0 | WDIO viewport logger |

## Development

```bash
# Run E2E tests
cd packages/syngrisi/e2e && npx bddgen && npx playwright test

# Run smoke tests
yarn --cwd packages/syngrisi smoke

# Build specific package
yarn --cwd packages/core-api build
```

## Documentation

- [Main App Documentation](packages/syngrisi/CLAUDE.md)
- [E2E Test Guidelines](packages/syngrisi/e2e/CLAUDE.md)
- [Environment Variables](packages/syngrisi/docs/environment_variables.md)
- [API Documentation](http://localhost:3000/swagger/) (when server is running)

## License

MIT
