// Ambient declarations for non-code side-effect imports (CSS) so the ui-app
// typecheck (tsc -p src/ui-app/tsconfig.json) resolves them. Vite/esbuild
// handle these at build time; tsc needs the module shims.
declare module '*.css';
