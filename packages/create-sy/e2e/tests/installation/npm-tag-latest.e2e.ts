import { describe, it, expect, beforeAll } from 'vitest'
import { getContainerContext } from '../../fixtures/container.fixture.js'

describe('Installation with latest npm tag', () => {
    const container = getContainerContext()

    beforeAll(() => {
        if (!container.isAvailable) {
            console.warn('Apple Container CLI not available, tests will be skipped')
        }
    })

    it.skipIf(!container.isAvailable)(
        'npm init sy@latest installs syngrisi successfully',
        () => {
            const result = container.runInNode('20', [
                'mkdir -p /tmp/test-project',
                'cd /tmp/test-project',
                'npm init sy@latest -- --yes --force 2>&1',
                'cat package.json',
            ])

            expect(result.exitCode).toBe(0)
            expect(result.stdout).toContain('@syngrisi/syngrisi')
        }
    )

    it.skipIf(!container.isAvailable)(
        'displays success message with installed version',
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
        'creates package.json if not exists',
        () => {
            const result = container.runInNode('20', [
                'mkdir -p /tmp/test-new-project',
                'cd /tmp/test-new-project',
                'npm init sy@latest -- --yes --force 2>&1',
                'test -f package.json && echo "PACKAGE_JSON_EXISTS"',
            ])

            expect(result.exitCode).toBe(0)
            expect(result.stdout).toContain('PACKAGE_JSON_EXISTS')
        }
    )
})
