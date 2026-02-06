import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SyngrisiApi } from '../src/SyngrisiApi'

const { gotMock } = vi.hoisted(() => {
    const fn = vi.fn() as any
    fn.get = vi.fn()
    return { gotMock: fn }
})

vi.mock('got-cjs', () => ({
    default: gotMock,
}))

describe('SyngrisiApi auth headers for read endpoints', () => {
    beforeEach(() => {
        gotMock.mockReset()
        gotMock.get.mockReset()
        delete process.env.SYNGRISI_AUTH_TOKEN
    })

    it('passes headers to getBaselines', async () => {
        gotMock.mockReturnValue({
            json: vi.fn().mockResolvedValue({ results: [] }),
        })

        const api = new SyngrisiApi({
            url: 'http://localhost:3000/',
            apiKey: 'plain-api-key',
            headers: { 'X-Kanopy-Authorization': 'Bearer token' },
        })

        await api.getBaselines({
            name: 'baseline',
            viewport: '1200x800',
            browserName: 'chrome',
            os: 'linux',
            app: 'app',
            branch: 'main',
        })

        expect(gotMock).toHaveBeenCalledTimes(1)
        const [, options] = gotMock.mock.calls[0]
        expect(options.headers['X-Kanopy-Authorization']).toBe('Bearer token')
    })

    it('adds Authorization from SYNGRISI_AUTH_TOKEN fallback for getSnapshots', async () => {
        process.env.SYNGRISI_AUTH_TOKEN = 'env-token'
        gotMock.get.mockReturnValue({
            json: vi.fn().mockResolvedValue({ results: [] }),
        })

        const api = new SyngrisiApi({
            url: 'http://localhost:3000/',
            apiKey: 'plain-api-key',
        })

        await api.getSnapshots({ _id: '0123456789abcdef01234567' })

        expect(gotMock.get).toHaveBeenCalledTimes(1)
        const [, options] = gotMock.get.mock.calls[0]
        expect(options.headers.Authorization).toBe('Bearer env-token')
    })

    it('does not send apikey in URL or headers when apiKey is omitted', async () => {
        gotMock.mockReturnValue({
            json: vi.fn().mockResolvedValue({ results: [] }),
        })

        const api = new SyngrisiApi({
            url: 'http://localhost:3000/',
            headers: { Authorization: 'Bearer token' },
        })

        await api.getBaselines({
            name: 'baseline',
            viewport: '1200x800',
            browserName: 'chrome',
            os: 'linux',
            app: 'app',
            branch: 'main',
        })

        expect(gotMock).toHaveBeenCalledTimes(1)
        const [url, options] = gotMock.mock.calls[0]
        expect(url).toContain('/v1/client/baselines?filter=')
        expect(url).not.toContain('apikey=')
        expect(options.headers.apikey).toBeUndefined()
        expect(options.headers.Authorization).toBe('Bearer token')
    })
})
