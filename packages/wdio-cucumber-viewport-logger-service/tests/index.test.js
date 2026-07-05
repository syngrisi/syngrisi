import { describe, it, expect } from 'vitest'
import { createRequire } from 'module'

// The source is now TypeScript (compiled to dist/ via tsc), so this test
// requires the built CJS output — the same artifact real consumers load.
const require = createRequire(import.meta.url)
const service = require('../dist/index')
const launcher = require('../dist/index').launcher

describe('wdio-cucumber-viewport-logger-service', () => {
    describe('exports', () => {
        it('should export default service', () => {
            expect(service).toBeDefined()
        })

        it('should export launcher', () => {
            expect(launcher).toBeDefined()
        })
    })
})
