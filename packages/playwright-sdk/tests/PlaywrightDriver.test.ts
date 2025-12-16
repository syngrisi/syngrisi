import { describe, it, expect, vi } from 'vitest'
import { PlaywrightDriver } from '../src/PlaywrightDriver'

// Mock page object for testing
const createMockPage = () => ({
    context: () => ({
        browser: () => ({
            browserType: () => ({ name: () => 'chromium' }),
            version: () => '120.0.0'
        })
    }),
    viewportSize: () => ({ width: 1920, height: 1080 }),
    evaluate: vi.fn()
})

describe('PlaywrightDriver', () => {
    describe('Region', () => {
        it('should create region with correct coordinates', () => {
            const region = new PlaywrightDriver.Region(10, 20, 100, 200)
            expect(region.left).toBe(10)
            expect(region.top).toBe(20)
            expect(region.right).toBe(100)
            expect(region.bottom).toBe(200)
        })
    })

    describe('constructor', () => {
        it('should throw error with invalid config (missing page)', () => {
            expect(() => {
                // @ts-expect-error - testing invalid config
                new PlaywrightDriver({
                    url: 'http://localhost:3000/',
                    apiKey: 'test-api-key'
                })
            }).toThrow()
        })

        it('should throw error with invalid config (missing url)', () => {
            expect(() => {
                // @ts-expect-error - testing invalid config
                new PlaywrightDriver({
                    page: createMockPage(),
                    apiKey: 'test-api-key'
                })
            }).toThrow()
        })

        it('should create instance without apiKey (optional)', () => {
            // apiKey is optional in the schema
            const driver = new PlaywrightDriver({
                page: createMockPage() as any,
                url: 'http://localhost:3000/'
            })
            expect(driver).toBeInstanceOf(PlaywrightDriver)
        })
    })
})
