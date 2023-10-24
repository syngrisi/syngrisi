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
            exclude: ['**/build/**', '__mocks__', '**/*.test.ts', 'src/utils*'],
            lines: 97,
            functions: 80,
            branches: 70,
            statements: 97
        }
    }
})
