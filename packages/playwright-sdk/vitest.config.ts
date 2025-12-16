import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        include: ['tests/**/*.test.ts'],
        exclude: ['node_modules', 'dist'],
        coverage: {
            provider: 'v8',
            enabled: true,
            exclude: ['**/dist/**', '**/tests/**', '**/*.test.ts'],
        },
    },
})
