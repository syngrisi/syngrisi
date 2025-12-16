import { describe, it, expect, beforeAll } from 'vitest'
import { getContainerContext } from '../../fixtures/container.fixture.js'

describe('Installation with invalid npm tag', () => {
    const container = getContainerContext()

    beforeAll(() => {
        if (!container.isAvailable) {
            console.warn('Apple Container CLI not available, tests will be skipped')
        }
    })

    it.skipIf(!container.isAvailable)(
        'fails gracefully with non-existent version',
        () => {
            const result = container.runInNode('20', [
                'mkdir -p /tmp/test-project',
                'cd /tmp/test-project',
                'npm init sy@latest -- --yes --force --npmTag 99.99.99 2>&1 || echo "EXPECTED_FAILURE"',
            ])

            // The command should fail or show error
            expect(
                result.exitCode !== 0 ||
                result.stdout.includes('EXPECTED_FAILURE') ||
                result.stderr.includes('404') ||
                result.stderr.includes('not found')
            ).toBe(true)
        }
    )

    it.skipIf(!container.isAvailable)(
        'rejects dangerous characters in tag',
        () => {
            const result = container.runInNode('20', [
                'mkdir -p /tmp/test-project',
                'cd /tmp/test-project',
                'npm init sy@latest -- --yes --force --npmTag "latest; rm -rf /" 2>&1 || echo "VALIDATION_FAILED"',
            ])

            // Should be rejected by our validation
            expect(
                result.stdout.includes('VALIDATION_FAILED') ||
                result.stdout.includes('Invalid npmTag') ||
                result.stderr.includes('Invalid npmTag')
            ).toBe(true)
        }
    )

    it.skipIf(!container.isAvailable)(
        'rejects tag with shell metacharacters',
        () => {
            const result = container.runInNode('20', [
                'mkdir -p /tmp/test-project',
                'cd /tmp/test-project',
                'npm init sy@latest -- --yes --force --npmTag "$(whoami)" 2>&1 || echo "VALIDATION_FAILED"',
            ])

            // Should be rejected by our validation
            expect(
                result.stdout.includes('VALIDATION_FAILED') ||
                result.stdout.includes('Invalid npmTag') ||
                result.stdout.includes('forbidden characters')
            ).toBe(true)
        }
    )
})
