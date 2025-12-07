# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
# Install all dependencies (server + UI)
npm run install:all

# Build everything (UI + server)
npm run build

# Build UI only (Vite → mvc/views/react)
npm run build:ui

# Build server only (tsup → dist/)
npm run build:server

# Start server (auto-watches in development)
npm start

# Development mode (builds UI, watches server, auth disabled)
npm run dev

# Development mode for UI only (Vite dev server on port 8080)
npm run dev:ui

# Watch UI build
npm run build:watch
```

## Testing

E2E tests use Playwright BDD and live in `e2e/`. Commands run from project root:

```bash
# Full E2E suite
npm test

# Smoke tests
npm run smoke

# Run specific feature file (from e2e/ directory)
cd e2e && npx bddgen && npx playwright test "features/CHECKS_HANDLING/accept_by_user.feature" --grep "Accept by user" --workers=2

# Headed mode
cd e2e && npx bddgen && npx playwright test "features/path/to/file.feature" --grep "Scenario name" --workers=1 --headed

# Verify test stability after fixing
cd e2e && npx bddgen && npx playwright test "features/path/to/file.feature" --grep "Test name" --workers=3 --repeat-each=4

# Migration tests
npm run test:migrations
```

## Architecture

### Backend (Express + MongoDB)
- **Entry point**: `src/server/server.ts` → connects to MongoDB, runs migrations, starts Express app
- **App setup**: `src/server/app.ts` → middleware, routes, Passport auth
- **Routes**: `src/server/routes/v1/` (API), `src/server/routes/ui/` (UI pages)
- **Models**: `src/server/models/` — Mongoose schemas for App, Baseline, Check, Run, Snapshot, Suite, Test, User
- **Services**: `src/server/services/` — business logic layer
- **Controllers**: `src/server/controllers/` — request handlers
- **Schemas**: `src/server/schemas/` — Zod validation schemas
- **Config**: `src/server/config.ts` + `src/server/envConfig.ts`

### Frontend (React + Mantine)
- **Location**: `src/ui-app/`
- **Three React apps** built by Vite:
  - `index2/` — main comparison page
  - `admin/` — admin panel
  - `auth/` — authentication pages
- **Output**: `mvc/views/react/`
- **UI package.json**: `src/ui-app/package.json` (separate deps)

### Path Aliases (tsconfig.json)
```
@utils → src/server/utils
@models → src/server/models
@services → src/server/services
@controllers → src/server/controllers
@lib → src/server/lib
@config → src/server/config
@schemas → src/server/schemas
@logger → src/server/lib/logger
@settings → src/server/lib/AppSettings
@env → src/server/envConfig
```

### Key Environment Variables
- `SYNGRISI_DB_URI` — MongoDB connection string (default: `mongodb://127.0.0.1:27017/SyngrisiDb`)
- `SYNGRISI_APP_PORT` — Server port (default: 3000)
- `SYNGRISI_AUTH` — Enable authentication (default: true)
- `SYNGRISI_IMAGES_PATH` — Screenshot storage path (default: `./.snapshots-images/`)
- `SYNGRISI_LOG_LEVEL` — Log level (error/warn/info/verbose/debug/silly)

Full list: `docs/environment_variables.md`

## E2E Test Guidelines

**See `e2e/AGENTS.md` for complete rules.** Key points:

- Always run `npx bddgen` before test execution to generate step definitions
- Feature files in `e2e/features/` organized by area (AP, AUTH, CHECKS_HANDLING, CP, etc.)
- Step definitions in `e2e/steps/`
- Never increase timeouts without investigating root cause
- Selector priority: ARIA roles > Labels > Text > TestID > CSS/XPath
- After fixing tests, verify stability with `--workers=3 --repeat-each=4`
- Flaky tests tagged with `@flaky` run separately

## API Documentation

Swagger available at `/swagger/` when server is running.

## Data Model

Core entities: App → Suite → Run → Test → Check → Snapshot/Baseline

- **App**: Top-level project container
- **Suite**: Test suite grouping
- **Run**: Single test execution run
- **Test**: Individual test containing checks
- **Check**: Visual comparison result
- **Baseline**: Approved reference image
- **Snapshot**: Current screenshot for comparison
