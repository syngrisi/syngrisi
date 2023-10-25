import FormData from 'form-data'
import got from 'got-cjs'
import hasha from 'hasha'
import logger from '@wdio/logger'
import { prettyCheckResult, printErrorResponseBody } from './utils'
import { ApiSessionParams, CheckOptions, CheckResult } from '../types'

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
        const apiHash = hasha(apikey)
        const form = new FormData()
        const required = ['run', 'suite', 'runident', 'name', 'viewport', 'browser', 'browserVersion', 'os', 'app']
        required.forEach(param => form.append(param, params[param]))

        // optional
        if (params.tags) form.append('tags', JSON.stringify(params.tags))
        if (params.branch) form.append('branch', params.branch)

        const response = await got.post(`${this.config.url}v1/client/startSession`, {
            body: form,
            headers: { apikey: apiHash },
        }).json()
        return response
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

    addMessageIfCheckFailed(result: any) {
        const patchedResult = result
        if (patchedResult.status.includes('failed')) {
            const checkView = `'${this.config.url}?checkId=${patchedResult._id}&modalIsOpen=true'`
            patchedResult.message = `To evaluate the results of the check, follow the link: '${checkView}'`
            // basically the links is useless - backward compatibility
            patchedResult.vrsGroupLink = checkView
            patchedResult.vrsDiffLink = checkView
        }
        return patchedResult
    }

    public async coreCheck(imageBuffer: Buffer, params: CheckOptions, apikey: string): Promise<CheckResult> {
        let resultWithHash = await this.createCheck(params, null, params.hashCode, apikey)
        resultWithHash = this.addMessageIfCheckFailed(resultWithHash)

        log.info(`Check result Phase #1: ${prettyCheckResult(resultWithHash)}`)
        if (resultWithHash.status === 'requiredFileData') {
            let resultWithFile = await this.createCheck(params, imageBuffer, params.hashCode, apikey)
            log.info(`Check result Phase #2: ${prettyCheckResult(resultWithFile)}`)
            resultWithFile = this.addMessageIfCheckFailed(resultWithFile)
            return resultWithFile
        }
        return resultWithHash
    }

    public async createCheck(params: any, imageBuffer: Buffer | null, hashCode: string, apikey: string): Promise<any> {
        const apiHash = hasha(apikey)
        const url = `${this.config.url}v1/client/createCheck`
        const form = new FormData()
        const fieldsMapping = {
            branch: 'branch',
            app: 'appName',
            suite: 'suitename',
            domDump: 'domdump',
            vShifting: 'vShifting',
            testId: 'testid',
            name: 'name',
            viewport: 'viewport',
            browserName: 'browserName',
            browserVersion: 'browserVersion',
            browserFullVersion: 'browserFullVersion',
            os: 'os'
        }

        try {
            Object.keys(fieldsMapping).forEach(key => {
                if (params[key]) { // @ts-ignore
                    form.append(fieldsMapping[key], params[key])
                }
            })

            if (hashCode) form.append('hashcode', hashCode)
            if (imageBuffer) form.append('file', imageBuffer, 'file')

            const result = await got.post(url, {
                body: form,
                headers: { apikey: apiHash },
            }).json()

            return result
        } catch (e: any) {
            log.error('❌ createCheck error create check vi API' + e.stack || e.toString())
            log.error('👉 Params:', params)
            if (e.response) printErrorResponseBody(e)
            throw e
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
            throw new Error(e.toString() + e.stack)
        }
    }
}

export { SyngrisiApi }
