import FormData from 'form-data'
import got from 'got-cjs'
import hasha from 'hasha'
import logger from '@wdio/logger'
import { LogLevelDesc } from 'loglevel'
import { errorObject, prettyCheckResult, printErrorResponseBody } from './utils'
import { ApiSessionParams, CheckOptions, CheckResult, Config } from './types'

const log = logger('syngrisi-wdio-sdk')
// 0 | 4 | 2 | 1 | 3 | 5 | "trace" | "debug" | "info" | "warn" | "error" |
if (process.env.SYNGRISI_LOG_LEVEL) {
    log.setLevel(process.env.SYNGRISI_LOG_LEVEL as LogLevelDesc)
}

class SyngrisiApi {
    private config: any

    constructor(cfg: Config) {
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

    public async startSession(params: ApiSessionParams): Promise<any> {
        const apiHash = hasha(this.config.apiKey)
        const form = new FormData()
        const required = ['run', 'suite', 'runident', 'name', 'viewport', 'browser', 'browserVersion', 'os', 'app']
        required.forEach(param => form.append(param, params[param]))

        // optional
        if (params.tags) form.append('tags', JSON.stringify(params.tags))
        if (params.branch) form.append('branch', params.branch)

        let result;
        try {
            result = await got.post(`${this.config.url}v1/client/startSession`, {
                body: form,
                headers: { apikey: apiHash },
            }).json()
            return result
        } catch (e: any) {
            log.error(`❌ Error posting start session data: '${e.stack || e}'`)
            if (e.response) printErrorResponseBody(e)
            return errorObject(e)
        }
    }

    public async stopSession(testId: string): Promise<any> {
        try {
            const apiHash = hasha(this.config.apiKey)
            const form = new FormData()
            const response = await got.post(`${this.config.url}v1/client/stopSession/${testId}`, {
                body: form,
                headers: { apikey: apiHash },
            }).json()
            return response
        } catch (e: any) {
            log.error(`❌ Error posting stop session data for test: '${testId}', error: '${e.stack || e}'`)
            if (e.response) printErrorResponseBody(e)
            return errorObject(e)
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

    public async coreCheck(imageBuffer: Buffer, params: CheckOptions): Promise<CheckResult> {
        let resultWithHash = await this.createCheck(params, null, params.hashCode)
        resultWithHash = this.addMessageIfCheckFailed(resultWithHash)

        log.debug(`Check result Phase #1: ${prettyCheckResult(resultWithHash)}`)
        if (resultWithHash.status === 'requiredFileData') {
            let resultWithFile = await this.createCheck(params, imageBuffer, params.hashCode)
            log.debug(`Check result Phase #2: ${prettyCheckResult(resultWithFile)}`)
            resultWithFile = this.addMessageIfCheckFailed(resultWithFile)
            return resultWithFile
        }
        return resultWithHash
    }

    public async createCheck(params: any, imageBuffer: Buffer | null, hashCode: string): Promise<any> {
        const apiHash = hasha(this.config.apiKey)
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

        Object.keys(fieldsMapping).forEach(key => {
            if (params[key]) { // @ts-ignore
                form.append(fieldsMapping[key], params[key])
            }
        })

        if (hashCode) form.append('hashcode', hashCode)
        if (imageBuffer) form.append('file', imageBuffer, 'file')

        try {
            const result = await got.post(url, {
                body: form,
                headers: { apikey: apiHash },
            }).json()

            return result
        } catch (e: any) {
            log.error(`❌ Error posting create check data params: '${JSON.stringify(params)}', error: '${e.stack || e}'`)
            if (e.response) printErrorResponseBody(e)
            return errorObject(e)
        }
    }

    public async getIdent(apiKey: string): Promise<any> {
        const url = `${this.config.url}v1/client/getIdent?apikey=${hasha(apiKey)}`
        try {
            const result = await got.get(url).json()
            return result
        } catch (e: any) {
            log.error(`❌ Error getting ident data, error: '${e.stack || e}'`)
            if (e.response) printErrorResponseBody(e)
            return errorObject(e)
        }
    }

    public async checkIfBaselineExist(params: any): Promise<any> {
        try {
            const searchString = this.objectToSearch({
                ...params, ...{ apikey: hasha(this.config.apiKey) },
            })
            const url = `${this.config.url}v1/client/checkIfScreenshotHasBaselines?${searchString}`
            // console.log({ url });
            const result = await got.get(url)
                .json()
            return result
        } catch (e: any) {
            log.error(`❌ Error getting if baseline exist, params: ${JSON.stringify(params)} data, error: '${e.stack || e}'`)
            if (e.response) printErrorResponseBody(e)
            return errorObject(e)
        }
    }

    public async getBaselines(params: any): Promise<any> {
        try {
            const filter = JSON.stringify({ ...params, apikey: hasha(this.config.apiKey) })

            const url = `${this.config.url}v1/client/baselines?filter=${filter}`
            const result = await got.get(url)
                .json()
            return result
        } catch (e: any) {
            log.error(`❌ Error getting baselines, params: ${JSON.stringify(params)} data, error: '${e.stack || e}'`)
            if (e.response) printErrorResponseBody(e)
            return errorObject(e)
        }
    }

    public async getSnapshots(params: any): Promise<any> {
        try {
            const filter = JSON.stringify({ ...params, apikey: hasha(this.config.apiKey) })

            const url = `${this.config.url}v1/client/snapshots?filter=${filter}`
            const result = await got.get(url)
                .json()
            return result
        } catch (e: any) {
            log.error(`❌ Error getting snapshots, params: ${JSON.stringify(params)} data, error: '${e.stack || e}'`)
            if (e.response) printErrorResponseBody(e)
            return errorObject(e)
        }
    }
}

export { SyngrisiApi }
export { transformOs } from './utils'
