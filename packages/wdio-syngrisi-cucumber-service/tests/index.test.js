import { describe, it, expect } from 'vitest'
import SyngrisiCucumberService, { launcher } from '../src/index'

describe('wdio-syngrisi-cucumber-service', () => {
    describe('exports', () => {
        it('should export default SyngrisiCucumberService', () => {
            expect(SyngrisiCucumberService).toBeDefined()
        })

        it('should export launcher', () => {
            expect(launcher).toBeDefined()
        })
    })
})
