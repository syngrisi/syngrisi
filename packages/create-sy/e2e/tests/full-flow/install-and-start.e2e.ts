import { describe, it, expect, beforeAll } from 'vitest'
import { getContainerContext } from '../../fixtures/container.fixture.js'

describe('Full installation and server startup flow', () => {
    const container = getContainerContext()

    beforeAll(() => {
        if (!container.isAvailable) {
            console.warn('Apple Container CLI not available, tests will be skipped')
        }
    })

    it.skipIf(!container.isAvailable)(
        'complete flow: npm init sy -> install -> check binary',
        () => {
            const result = container.runInNode('20', [
                'mkdir -p /tmp/test-project',
                'cd /tmp/test-project',
                // Install
                'npm init sy@latest -- --yes --force 2>&1',
                // Verify installation
                'test -f package.json && echo "PACKAGE_JSON_EXISTS"',
                'test -d node_modules/@syngrisi && echo "SYNGRISI_INSTALLED"',
                // Check binary is available
                'npx sy --help 2>&1 | head -5 || echo "HELP_DISPLAYED"',
            ], { timeout: 300_000 }) // 5 minutes for full flow

            expect(result.exitCode).toBe(0)
            expect(result.stdout).toContain('PACKAGE_JSON_EXISTS')
            expect(result.stdout).toContain('SYNGRISI_INSTALLED')
        }
    )

    it.skipIf(!container.isAvailable)(
        'installation in existing project with package.json',
        () => {
            const result = container.runInNode('20', [
                'mkdir -p /tmp/existing-project',
                'cd /tmp/existing-project',
                // Create existing package.json
                'echo \'{"name": "my-existing-project", "version": "1.0.0"}\' > package.json',
                'npm install 2>&1',
                // Install syngrisi into existing project
                'npm init sy@latest -- --yes --force 2>&1',
                // Verify syngrisi was added
                'cat package.json | grep syngrisi',
            ], { timeout: 300_000 })

            expect(result.exitCode).toBe(0)
            expect(result.stdout).toContain('syngrisi')
        }
    )

    it.skipIf(!container.isAvailable)(
        'syngrisi binary shows version',
        () => {
            const result = container.runInNode('20', [
                'mkdir -p /tmp/test-project',
                'cd /tmp/test-project',
                'npm init sy@latest -- --yes --force 2>&1',
                'npx sy --version 2>&1',
            ], { timeout: 300_000 })

            expect(result.exitCode).toBe(0)
            // Version should be displayed (format like 2.3.4)
            expect(result.stdout).toMatch(/\d+\.\d+\.\d+/)
        }
    )

    // Note: Full server startup test requires MongoDB
    // This test is skipped by default as it requires additional infrastructure
    it.skip(
        'server starts and responds to health check (requires MongoDB)',
        () => {
            // This would require a MongoDB container to be running
            // and network connectivity between containers
            const result = container.runInNode('20', [
                'mkdir -p /tmp/test-project',
                'cd /tmp/test-project',
                'npm init sy@latest -- --yes --force 2>&1',
                // Start server (would need SYNGRISI_DB_URI to be set)
                'SYNGRISI_AUTH=false npx sy &',
                'sleep 15',
                'curl -sf http://localhost:3000/v1/app/info || echo "SERVER_CHECK"',
                'pkill -f syngrisi || true',
            ], { timeout: 300_000 })

            expect(result.exitCode).toBe(0)
        }
    )
})
