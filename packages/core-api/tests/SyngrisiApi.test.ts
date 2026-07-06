import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
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

describe('requestWithRetry transient-failure retries (idempotent methods)', () => {
    beforeEach(() => vi.useFakeTimers())
    afterEach(() => {
        vi.useRealTimers()
        vi.unstubAllGlobals()
    })

    const json = (body: unknown, status = 200) =>
        new Response(JSON.stringify(body), { status })

    it('retries an idempotent GET on a network-level error, then succeeds', async () => {
        const fetchMock = vi.fn()
            .mockRejectedValueOnce(new Error('ECONNRESET'))
            .mockResolvedValueOnce(json(['ident-a']))
        vi.stubGlobal('fetch', fetchMock)

        const api = new SyngrisiApi({ url: 'http://localhost:3000/', apiKey: 'k' })
        const resultP = api.getIdent()
        await vi.advanceTimersByTimeAsync(2000)

        expect(await resultP).toEqual(['ident-a'])
        expect(fetchMock).toHaveBeenCalledTimes(2)
    })

    it('retries an idempotent GET on a retryable 5xx, then succeeds', async () => {
        const fetchMock = vi.fn()
            .mockResolvedValueOnce(json({ error: 'boom' }, 503))
            .mockResolvedValueOnce(json(['ident-b']))
        vi.stubGlobal('fetch', fetchMock)

        const api = new SyngrisiApi({ url: 'http://localhost:3000/', apiKey: 'k' })
        const resultP = api.getIdent()
        await vi.advanceTimersByTimeAsync(2000)

        expect(await resultP).toEqual(['ident-b'])
        expect(fetchMock).toHaveBeenCalledTimes(2)
    })

    it('does NOT retry an idempotent GET on a non-retryable 4xx', async () => {
        const fetchMock = vi.fn().mockResolvedValue(json({ error: 'nope' }, 404))
        vi.stubGlobal('fetch', fetchMock)

        const api = new SyngrisiApi({ url: 'http://localhost:3000/', apiKey: 'k' })
        const result = await api.getIdent()

        expect(fetchMock).toHaveBeenCalledTimes(1)
        expect(result).toMatchObject({ error: true, statusCode: 404 })
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
