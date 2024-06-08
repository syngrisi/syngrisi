import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    "src/server/**/*.ts",
    "src/server.ts",
    "src/config.ts",
    "src/server/**/*.mts",
    "src/tasks/**/*.ts"
  ],
  splitting: false,
  sourcemap: true,
  clean: true,
});
