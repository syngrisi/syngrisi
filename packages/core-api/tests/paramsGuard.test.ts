import { describe, it, expect } from 'vitest'
import { paramsGuard } from '../src/utils'
import { ConfigSchema } from '../schemas/SyngrisiApi.schema'

describe('paramsGuard', () => {
    it('returns true when the params satisfy the schema', () => {
        expect(paramsGuard({ url: 'x' }, 'ctx', ConfigSchema)).toBe(true)
    })

    it('throws an Error whose message contains the pretty-printed error details and the params section', () => {
        // This pins the canonical error format both SDKs now inherit after
        // consolidation (plan 023-sdk-consolidation): pretty-printed
        // (`JSON.stringify(..., null, 2)`) error details, followed by a
        // `params:` section with the offending input.
        const badParams = { apiKey: 'test' } // missing required `url`

        expect(() => paramsGuard(badParams, 'ctx', ConfigSchema)).toThrow(Error)

        try {
            paramsGuard(badParams, 'ctx', ConfigSchema)
            throw new Error('expected paramsGuard to throw')
        } catch (e: any) {
            expect(e.message).toContain(`Invalid 'ctx' parameters`)
            // Pretty-printed JSON.stringify(errorDetails, null, 2) uses newlines + 2-space indent
            expect(e.message).toMatch(/\n\s{2}"/)
            expect(e.message).toContain('params:')
            expect(e.message).toContain(JSON.stringify(badParams, null, 2))
        }
    })
})
