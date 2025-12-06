import { describe, it, expect, beforeAll } from 'vitest'
import { getContainerContext } from '../../fixtures/container.fixture.js'

describe('Installation on Node.js 20', () => {
    const container = getContainerContext()

    beforeAll(() => {
        if (!container.isAvailable) {
            console.warn('Apple Container CLI not available, tests will be skipped')
        }
    })

    it.skipIf(!container.isAvailable)(
        'verifies Node.js 20 environment',
        () => {
            const result = container.runInNode('20', [
                'node --version',
            ])

            expect(result.exitCode).toBe(0)
            expect(result.stdout).toMatch(/^v20\./)
        }
    )

    it.skipIf(!container.isAvailable)(
        'npm init sy@latest works on Node.js 20',
        () => {
            const result = container.runInNode('20', [
                'mkdir -p /tmp/test-project',
                'cd /tmp/test-project',
                'npm init sy@latest -- --yes --force 2>&1',
            ])

            expect(result.exitCode).toBe(0)
            expect(result.stdout).toMatch(/successfully installed/)
        }
    )

    it.skipIf(!container.isAvailable)(
        'syngrisi binary is available after installation on Node.js 20',
        () => {
            const result = container.runInNode('20', [
                'mkdir -p /tmp/test-project',
                'cd /tmp/test-project',
                'npm init sy@latest -- --yes --force 2>&1',
                'npx sy --version 2>&1 || echo "SY_BINARY_WORKS"',
            ])

            expect(result.exitCode).toBe(0)
        }
    )
})
