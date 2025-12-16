
// TSUP UI CONFIG - UNDER CONSTRUCTION! 
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/ui-app/index2/main.tsx',
    'src/ui-app/admin/main.tsx',
  ],
  outDir: 'dist2',
  tsconfig: './vite.tsconfig.json',
  minify: true,
  dts: true,
  format: ['esm'],
  splitting: false,
  sourcemap: true,
  external: ['react'],
  injectStyle: false,
  clean: true,
});
