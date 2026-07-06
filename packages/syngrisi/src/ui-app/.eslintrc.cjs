// Minimal ESLint config for the ui-app: its sole job is to ratchet down the
// explicit-`any` backlog. It intentionally does NOT pull in the server config's
// custom rules or the full React plugin set — just the TS parser (for .tsx) and
// no-explicit-any. Run via the `lint:ui` script.
module.exports = {
    root: true,
    env: { browser: true, es2021: true },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
    },
    plugins: ['@typescript-eslint'],
    ignorePatterns: ['node_modules/', 'dist/', '*.d.ts'],
    rules: {
        '@typescript-eslint/no-explicit-any': 'error',
    },
};
