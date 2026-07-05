import { createHash } from 'node:crypto'
import { describe, it, expect, vi } from 'vitest'
import { CheckParamsSchema } from '@syngrisi/core-api'
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

    describe('check schema (shared with core-api)', () => {
        it('accepts the runtime shape PlaywrightDriver.check() builds against core-api CheckParamsSchema', () => {
            // Mirrors the `opts` object built in PlaywrightDriver.check() (PlaywrightDriver.ts)
            // before it is passed to paramsGuard(opts, 'check, opts', CheckOptionsSchema).
            // This guards Step 3 of plan 023: switching Playwright from its own local
            // CheckOptionsSchema to core-api's canonical CheckParamsSchema tightens
            // validation (24-char testId, min(64) hashCode, viewport regex) -- this test
            // proves the real runtime values Playwright computes still satisfy it.
            const opts = {
                name: 'Main Navigation Bar',
                viewport: '1920x1080', // as produced by pwHelpers.getViewport
                browserName: 'chromium',
                os: 'macOS',
                app: 'MyApp',
                branch: 'main',

                testId: '507f1f77bcf86cd799439011', // 24-char Mongo ObjectId shape
                suite: 'Smoke Tests',
                browserVersion: '120',
                browserFullVersion: '120.0.4430.85',

                hashCode: createHash('sha512').update(Buffer.from('test-image-bytes')).digest('hex'), // 128-char SHA-512
                domDump: undefined,
                skipDomData: true,
            }

            const result = CheckParamsSchema.safeParse(opts)
            expect(result.success).toBe(true)
        })
    })
})
