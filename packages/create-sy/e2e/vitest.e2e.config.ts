import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        include: ['e2e/tests/**/*.e2e.ts'],
        exclude: ['node_modules', 'build'],
        testTimeout: 300_000, // 5 minutes per test
        hookTimeout: 120_000, // 2 minutes for hooks
        pool: 'forks',
        poolOptions: {
            forks: {
                singleFork: true, // Sequential execution for container tests
            },
        },
        reporters: ['verbose'],
        passWithNoTests: true,
        env: {
            E2E_MODE: 'true',
        },
    },
})
