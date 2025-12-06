import { describe, it, expect, beforeAll } from 'vitest'
import { getContainerContext } from '../../fixtures/container.fixture.js'

describe('Installation with specific npm tag', () => {
    const container = getContainerContext()

    beforeAll(() => {
        if (!container.isAvailable) {
            console.warn('Apple Container CLI not available, tests will be skipped')
        }
    })

    it.skipIf(!container.isAvailable)(
        'installs specific version via --npmTag',
        () => {
            // Use a known version that exists on npm
            const targetVersion = '2.3.4'

            const result = container.runInNode('20', [
                'mkdir -p /tmp/test-project',
                'cd /tmp/test-project',
                `npm init sy@latest -- --yes --force --npmTag ${targetVersion} 2>&1`,
                'cat package.json',
            ])

            expect(result.exitCode).toBe(0)
            expect(result.stdout).toContain(`"@syngrisi/syngrisi"`)
        }
    )

    it.skipIf(!container.isAvailable)(
        'handles version with @ prefix correctly',
        () => {
            const result = container.runInNode('20', [
                'mkdir -p /tmp/test-project',
                'cd /tmp/test-project',
                'npm init sy@latest -- --yes --force --npmTag @2.3.4 2>&1',
            ])

            // Should not have double @@ in the install command
            expect(result.stdout).not.toContain('@@')
        }
    )

    it.skipIf(!container.isAvailable)(
        'installs named tag (latest)',
        () => {
            const result = container.runInNode('20', [
                'mkdir -p /tmp/test-project',
                'cd /tmp/test-project',
                'npm init sy@latest -- --yes --force --npmTag latest 2>&1',
            ])

            expect(result.exitCode).toBe(0)
            expect(result.stdout).toMatch(/successfully installed/)
        }
    )
})
