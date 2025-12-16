import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SyngrisiApi, transformOs } from '../src/SyngrisiApi'

describe('SyngrisiApi', () => {
    describe('constructor', () => {
        it('should create instance with valid config', () => {
            const api = new SyngrisiApi({
                url: 'http://localhost:3000/',
                apiKey: 'test-api-key'
            })
            expect(api).toBeInstanceOf(SyngrisiApi)
        })

        it('should throw error with invalid config (missing url)', () => {
            expect(() => {
                // @ts-expect-error - testing invalid config
                new SyngrisiApi({ apiKey: 'test' })
            }).toThrow()
        })

        it('should create instance without apiKey (optional)', () => {
            // apiKey is optional in the schema
            const api = new SyngrisiApi({ url: 'http://localhost:3000/' })
            expect(api).toBeInstanceOf(SyngrisiApi)
        })
    })
})

describe('transformOs', () => {
    it('should return original value if not in mapping', () => {
        expect(transformOs('UnknownOS')).toBe('UnknownOS')
    })

    it('should transform macintel to macOS', () => {
        expect(transformOs('macintel')).toBe('macOS')
    })

    it('should transform win32 to WINDOWS', () => {
        expect(transformOs('win32')).toBe('WINDOWS')
    })

    it('should return linux unchanged (not in mapping)', () => {
        // linux is not in the transform mapping, returns original value
        expect(transformOs('linux')).toBe('linux')
    })

    it('should return darwin unchanged (not in mapping)', () => {
        // darwin is not in the transform mapping, returns original value
        expect(transformOs('darwin')).toBe('darwin')
    })
})
