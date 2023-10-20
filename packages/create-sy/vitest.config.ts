/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
    test: {
        include: ['tests/**/*.test.ts'],
        /**
         * not to ESM ported packages
         */
        exclude: [
            'build', '.idea', '.git', '.cache',
            '**/node_modules/**', '__mocks__'
        ],
        coverage: {
            enabled: true,
            exclude: ['**/build/**', '__mocks__', '**/*.test.ts'],
            lines: 98,
            functions: 80,
            branches: 77,
            statements: 98
        }
    }
})
