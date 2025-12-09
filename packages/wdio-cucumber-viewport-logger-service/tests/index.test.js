import { describe, it, expect } from 'vitest'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const service = require('../src/index')
const launcher = require('../src/index').launcher

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
