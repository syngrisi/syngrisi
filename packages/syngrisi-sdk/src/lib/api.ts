import FormData from 'form-data'
import got from 'got-cjs'
import hasha from 'hasha'
import logger from '@wdio/logger'
import { printErrorResponseBody } from './utils'
import { ApiSessionParams } from '../types'

const log = logger('syngrisi-wdio-sdk')

class SyngrisiApi {
    private config: any

    constructor(cfg: any) {
        this.config = cfg
    }

    private objectToSearch(obj: any): string {
        const str = []
        for (const p in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, p)) {
                str.push(`${encodeURIComponent(p)}=${encodeURIComponent(obj[p])}`)
            }
        }
        return str.join('&')
    }

    public async startSession(params: ApiSessionParams, apikey: string): Promise<any> {
        try {
            const apiHash = hasha(apikey)
            const form = new FormData()
            form.append('run', params.run)
            form.append('suite', params.suite)
            form.append('runident', params.runident)
            if (params.tags) form.append('tags', JSON.stringify(params.tags))
            if (params.branch) form.append('branch', params.branch)
            form.append('name', params.name)
            form.append('status', params.status)
            form.append('viewport', params.viewport)
            form.append('browser', params.browserName)
            form.append('browserVersion', params.browserVersion)
            form.append('os', params.os)
            form.append('app', params.app)
            const response = await got.post(`${this.config.url}v1/client/startSession`, {
                body: form,
                headers: { apikey: apiHash },
            }).json()
            return response
        } catch (e: any) {
            log.info(`Cannot createTest with params: '${JSON.stringify(params)}', error: '${e}'`)
            printErrorResponseBody(e)
            throw new Error(e + e.stack)
        }
    }

    public async stopSession(testId: string, apikey: string): Promise<any> {
        try {
            const apiHash = hasha(apikey)
            const form = new FormData()
            const response = await got.post(`${this.config.url}v1/client/stopSession/${testId}`, {
                body: form,
                headers: { apikey: apiHash },
            }).json()
            return response
        } catch (e) {
            throw new Error(`Cannot stop the test session with id: '${testId}', error: '${e}'`)
        }
    }

    public async createCheck(params: any, imageBuffer: Buffer | null, hashCode: string, apikey: string): Promise<any> {
        const apiHash = hasha(apikey)
        const url = `${this.config.url}v1/client/createCheck`
        const form = new FormData()
        try {
            if (params.branch) form.append('branch', params.branch)
            if (params.app) form.append('appName', params.app)
            if (params.suite) form.append('suitename', params.suite)
            if (params.domDump) form.append('domdump', params.domDump || '')
            if (hashCode) form.append('hashcode', hashCode)
            if (imageBuffer) form.append('file', imageBuffer, 'file')
            if (params.vShifting) form.append('vShifting', params.vShifting)

            form.append('testid', params.testId)
            form.append('name', params.name)
            form.append('viewport', params.viewport)
            form.append('browserName', params.browserName)
            form.append('browserVersion', params.browserVersion)
            form.append('browserFullVersion', params.browserFullVersion)
            form.append('os', params.os)
            const result = await got.post(url, {
                body: form,
                headers: { apikey: apiHash },
            }).json()
            return result
        } catch (e: any) {
            printErrorResponseBody(e)
            throw new Error(`fait to post data, response body: ${e.response?.body} \n '${e.stack || e}'`)
        }
    }

    public async getIdent(apiKey: string): Promise<any> {
        const url = `${this.config.url}v1/client/getIdent?apikey=${hasha(apiKey)}`
        const result = await got.get(url).json()
        return result
    }

    public async checkIfBaselineExist(params: any, apikey: string): Promise<any> {
        try {
            const searchString = this.objectToSearch({
                ...params, ...{ apikey: hasha(apikey) },
            })
            const url = `${this.config.url}v1/client/checkIfScreenshotHasBaselines?${searchString}`
            // console.log({ url });
            const result = got.get(url, { throwHttpErrors: false })
                .json()
            return result
        } catch (e: any) {
            throw new Error(e + e.stack)
        }
    }
}

export { SyngrisiApi }
