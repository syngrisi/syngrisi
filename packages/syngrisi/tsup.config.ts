import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    "src/server/**/*.ts",
    "src/server.ts",
    "src/config.ts",
    "src/server/**/*.mts",
    "src/tasks/**/*.ts"
  ],
  format: ['esm'],
  splitting: false,
  sourcemap: true,
  clean: true,
  target: 'es2022',
  platform: 'node',
  // Mark deprecated dependencies as external (used only in server_old.ts)
  external: ['pino', 'pino-http', 'body-parser', 'p-queue', 'chalk', 'string-table', 'cookie-parser', 'http-status'],
});
