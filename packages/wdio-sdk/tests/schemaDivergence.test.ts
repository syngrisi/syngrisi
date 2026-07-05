import { describe, it, expect } from 'vitest'
import { SessionParamsSchema as WdioSessionParamsSchema } from '../src/schemas/WDIODriver'
// Cross-import Playwright's SDK-local session schema by file path. Both schema
// files depend only on zod, so this pulls in no framework runtime.
import { SessionParamsSchema as PwSessionParamsSchema } from '../../playwright-sdk/src/schemas/SessionParams.schema'

/**
 * Regression tripwire for the DELIBERATELY UNMERGED schema divergence
 * documented in plan 023-sdk-consolidation (finding D).
 *
 * WDIO's SessionParamsSchema treats `suite` as REQUIRED; Playwright's treats it
 * as OPTIONAL. Unifying them would change one SDK's public startTestSession
 * accept/reject behavior, so the two guards are intentionally kept SDK-local.
 * If a future refactor accidentally unifies them, this test fails and flags it.
 */
describe('SessionParamsSchema divergence (wdio vs playwright) — intentionally NOT unified', () => {
    // A valid session payload with every required field EXCEPT `suite`.
    const suitelessParams = {
        run: 'run-123',
        runident: 'run-identifier',
        test: 'Homepage Test',
        branch: 'main',
        app: 'MyProject',
    }

    it('WDIO requires `suite` (rejects a suite-less payload)', () => {
        const result = WdioSessionParamsSchema.safeParse(suitelessParams)
        expect(result.success).toBe(false)
    })

    it('Playwright treats `suite` as optional (accepts the same suite-less payload)', () => {
        const result = PwSessionParamsSchema.safeParse(suitelessParams)
        expect(result.success).toBe(true)
    })
})
