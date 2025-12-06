import { describe, it, expect } from 'vitest'
import { validateNpmTag } from '../src/utils'

describe('validateNpmTag', () => {
    describe('valid tags', () => {
        it('accepts empty string', () => {
            expect(validateNpmTag('')).toEqual({ valid: true })
        })

        it('accepts semantic versions', () => {
            expect(validateNpmTag('1.2.3')).toEqual({ valid: true })
            expect(validateNpmTag('2.3.4')).toEqual({ valid: true })
            expect(validateNpmTag('10.20.30')).toEqual({ valid: true })
        })

        it('accepts semantic versions with @ prefix', () => {
            expect(validateNpmTag('@1.2.3')).toEqual({ valid: true })
            expect(validateNpmTag('@2.3.4')).toEqual({ valid: true })
        })

        it('accepts semantic versions with range prefixes', () => {
            expect(validateNpmTag('^1.2.3')).toEqual({ valid: true })
            expect(validateNpmTag('~1.2.3')).toEqual({ valid: true })
            // Note: >= is rejected because > is in forbidden characters list
            // This is intentional - only exact versions or tags should be used
        })

        it('accepts semantic versions with prerelease', () => {
            expect(validateNpmTag('1.2.3-beta')).toEqual({ valid: true })
            expect(validateNpmTag('1.2.3-alpha.1')).toEqual({ valid: true })
        })

        it('accepts common npm tags', () => {
            expect(validateNpmTag('latest')).toEqual({ valid: true })
            expect(validateNpmTag('beta')).toEqual({ valid: true })
            expect(validateNpmTag('next')).toEqual({ valid: true })
            expect(validateNpmTag('canary')).toEqual({ valid: true })
        })

        it('accepts tags with dashes', () => {
            expect(validateNpmTag('pre-release')).toEqual({ valid: true })
            expect(validateNpmTag('my-custom-tag')).toEqual({ valid: true })
        })
    })

    describe('invalid tags', () => {
        it('rejects tags with semicolon (command injection)', () => {
            const result = validateNpmTag('latest; rm -rf /')
            expect(result.valid).toBe(false)
            expect(result.error).toContain('forbidden characters')
        })

        it('rejects tags with pipe (command injection)', () => {
            const result = validateNpmTag('latest | cat /etc/passwd')
            expect(result.valid).toBe(false)
            expect(result.error).toContain('forbidden characters')
        })

        it('rejects tags with backticks (command substitution)', () => {
            const result = validateNpmTag('`whoami`')
            expect(result.valid).toBe(false)
            expect(result.error).toContain('forbidden characters')
        })

        it('rejects tags with $() (command substitution)', () => {
            const result = validateNpmTag('$(whoami)')
            expect(result.valid).toBe(false)
            expect(result.error).toContain('forbidden characters')
        })

        it('rejects tags with newlines', () => {
            const result = validateNpmTag('latest\nrm -rf /')
            expect(result.valid).toBe(false)
            expect(result.error).toContain('forbidden characters')
        })

        it('rejects tags starting with numbers', () => {
            const result = validateNpmTag('123invalid')
            expect(result.valid).toBe(false)
            expect(result.error).toContain('Invalid npmTag format')
        })
    })
})
