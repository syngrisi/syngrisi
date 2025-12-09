import { describe, it, expect, vi } from 'vitest'
import { WDIODriver } from '../src/WDIODriver'

describe('WDIODriver', () => {
    describe('constructor', () => {
        it('should create instance with valid config', () => {
            const driver = new WDIODriver({
                url: 'http://localhost:3000/',
                apiKey: 'test-api-key'
            })
            expect(driver).toBeInstanceOf(WDIODriver)
        })

        it('should create instance with autoAccept option', () => {
            const driver = new WDIODriver({
                url: 'http://localhost:3000/',
                apiKey: 'test-api-key',
                autoAccept: true
            })
            expect(driver).toBeInstanceOf(WDIODriver)
        })

        it('should throw error with invalid config (missing url)', () => {
            expect(() => {
                // @ts-expect-error - testing invalid config
                new WDIODriver({ apiKey: 'test' })
            }).toThrow()
        })

        it('should create instance without apiKey (optional)', () => {
            // apiKey is optional in the schema
            const driver = new WDIODriver({ url: 'http://localhost:3000/' })
            expect(driver).toBeInstanceOf(WDIODriver)
        })
    })

    describe('Region', () => {
        it('should create region with correct coordinates', () => {
            const region = new WDIODriver.Region(10, 20, 100, 200)
            expect(region.left).toBe(10)
            expect(region.top).toBe(20)
            expect(region.right).toBe(100)
            expect(region.bottom).toBe(200)
        })
    })
})
