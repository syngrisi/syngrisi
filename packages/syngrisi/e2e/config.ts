import dotenv from 'dotenv';
import path from 'path';
import { bool, cleanEnv, num, str } from 'envalid';

// Load .env from e2e directory first, then from parent (packages/syngrisi)
dotenv.config({ path: path.resolve(__dirname, '.env'), quiet: true });
dotenv.config({ path: path.resolve(__dirname, '..', '.env'), quiet: true });

export const env = cleanEnv(process.env, {
  CI: bool({
    default: false,
    desc: 'Marks CI execution to adjust retries and reporting'
  }),
  E2E_BASE_URL: str({
    default: 'http://localhost:3002',
    desc: 'Base URL for E2E tests'
  }),
  E2E_BACKEND_HOST: str({
    default: 'localhost',
    desc: 'Host to bind backend server in E2E tests'
  }),
  E2E_LOG_LEVEL: str({
    default: 'info',
    desc: 'E2E framework log level (error, warn, info, debug)'
  }),
  SYNGRISI_DISABLE_FIRST_RUN: str({
    default: 'true',
    desc: 'Disable first run setup for Syngrisi'
  }),
  SYNGRISI_AUTH: str({
    default: 'false',
    desc: 'Enable authentication for Syngrisi'
  }),
  SYNGRISI_COVERAGE: str({
    default: 'false',
    desc: 'Enable coverage collection'
  }),
  SYNGRISI_V8_COVERAGE_ON_EXIT: str({
    default: 'false',
    desc: 'Enable v8 coverage collection on exit'
  }),
  DOCKER: str({
    default: '0',
    desc: 'Run tests in Docker mode'
  }),
  PLAYWRIGHT_HEADED: bool({
    default: false,
    desc: 'Run Playwright tests in headed mode'
  }),
  PLAYWRIGHT_WORKERS: num({
    default: 4 as any,
    desc: 'Number of parallel workers for Playwright (4 is optimal for stability with fast-server tests)'
  }),
  SYNGRISI_DB_URI: str({
    default: '',
    desc: 'MongoDB URI for Syngrisi (auto-generated if not provided)'
  }),
  SYNGRISI_IMAGES_PATH: str({
    default: '',
    desc: 'Path for Syngrisi test screenshots (auto-generated if not provided)'
  }),
  E2E_DEBUG: bool({
    default: false,
    desc: 'Enable debug mode - pause browser on test failure for inspection'
  }),
  E2E_FORCE_TRACE: bool({
    default: false,
    desc: 'Enable Playwright trace for all test runs'
  }),
  E2E_REUSE_SERVER: bool({
    default: true,
    desc: 'Keep Syngrisi server running between tests to reduce startup overhead'
  }),
  E2E_REUSE_LOGTO: str({
    default: 'true',
    desc: 'Keep Logto containers running between tests (set to "false" in CI for clean state)'
  }),
  LOGTO_PORT: num({
    default: 3001,
    desc: 'Logto main port'
  }),
  LOGTO_ADMIN_PORT: num({
    default: 3050,
    desc: 'Logto admin console port (3050 to avoid conflict with Syngrisi E2E workers 3002-3020)'
  }),
  LOGTO_POSTGRES_PORT: num({
    default: 5433,
    desc: 'Postgres port for Logto'
  })
});

export const config = {
  timeout: 5 * 60 * 1000,
  expectTimeout: 10_000,
  retriesCI: 2,
  retriesLocal: 2,
  blobReportPath: './reports/blob',
  mergedReportPath: './reports/html'
} as const;
