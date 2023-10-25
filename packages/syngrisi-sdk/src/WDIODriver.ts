import hasha from 'hasha'
import { default as logger } from '@wdio/logger'
import { getDomDump } from './lib/getDomDump'
import { SyngrisiApi } from './lib/api'
import { CheckOptions, CheckParams, SessionParams } from './types'
import { getBrowserFullVersion, getBrowserName, getBrowserVersion, getOS, getViewport } from './lib/wdioHelpers'

const log = logger('syngrisi-wdio-sdk')
export { getDomDump }

export interface Config {
    url: string
}

class WDIODriver {
    api: SyngrisiApi
    config: any
    params: any

    constructor(cfg: Config) {

        this.api = new SyngrisiApi(cfg)
        this.params = {
            test: {}
        }
    }

    static sessionParamsGuard = (params: SessionParams) => {
        const requiredParams = ['run', 'runident', 'test', 'branch', 'app']

        for (const param of requiredParams) {
            if (!params[param]) {
                throw new Error(`error startTestSession: Mandatory parameter '${param}' is missing. Params: '${JSON.stringify(params)}'`)
            }
        }
    }

    async startTestSession(params: SessionParams, apikey: string) {
        try {
            WDIODriver.sessionParamsGuard(params)

            if (params.suite) {
                this.params.suite = params.suite || 'Unknown'
            }

            this.params.test = {
                os: params.os || await getOS(),
                viewport: params.viewport || await getViewport(),
                browser: params.browserName || await getBrowserName(),
                browserVersion: params.browserVersion || await getBrowserVersion(),
                name: params.test,
                app: params.app,
                run: params.run,
                branch: params.branch,
                runident: params.runident,
                suite: params.suite,
                tags: params.tags,

                browserFullVersion: params.browserFullVersion || await getBrowserFullVersion()
            }

            const respJson = await this.api.startSession(this.params.test, apikey)

            if (!respJson) {
                throw new Error(`response is empty, params: ${JSON.stringify(params, null, '\t')}`)
            }

            this.params.test.testId = respJson._id
            return respJson
        } catch (e: any) {
            const eMsg = `Cannot start session, error: '${e}' \n '${e.stack}'`
            log.error(eMsg)
            throw new Error(eMsg)
        }
    }

    async stopTestSession(apikey: string) {
        const result = await this.api.stopSession(this.params.test.testId, apikey)
        log.info(`Session with testId: '${result._id}' was stopped`)
    }

    // identArgsGuard(params: any) {
    //     this.params.ident.forEach((item: string) => {
    //         if (!params[item]) {
    //             throw new Error(`Wrong parameters for ident, the '${item}' property is empty`)
    //         }
    //     })
    // }

    // removeNonIdentProperties(params: any) {
    //     const opts = { ...params }
    //
    //     for (const prop of Object.keys(opts)) {
    //         if (!(prop in this.params.ident)) delete opts[prop]
    //     }
    //     return opts
    // }

    /**
     * Check if the baseline exist with specific ident and specific hashcode
     * @param {Buffer} imageBuffer  image buffer
     * @param {string} name         name of check
     * @param {Object} params       object that must be related to ident array
     * @param {string} apikey       apikey
     * @returns {Promise<Object>}
     */
    // ident:  ['name', 'viewport', 'browserName', 'os', 'app', 'branch'];
    async checkIfBaselineExist(name: string, imageBuffer: Buffer, apikey: string, params: any) {
        const imgHash = hasha(imageBuffer)
        // this.params.ident = await this.api.getIdent(apikey)
        let opts = {
            name: name,
            viewport: params.viewport || await getViewport(),
            browserName: this.params.browser || await getBrowserVersion(),
            os: this.params.os || await getOS(),
            app: this.params.app,
            branch: this.params.branch,
            imghash: imgHash,
        }

        return this.api.checkIfBaselineExist(opts, apikey)
    }

    async check(checkName: string, imageBuffer: Buffer, apikey: string, params: CheckParams, domDump: any) {
        if (this.params.test.testId === undefined) {
            throw new Error('The test id is empty, the session may not have started yet:'
                + `check name: '${checkName}', driver: '${JSON.stringify(this, null, '\t')}'`)
        }
        let opts: CheckOptions | null = null

        try {
            // ident:  ['name', 'viewport', 'browserName', 'os', 'app', 'branch'];
            opts = {
                testId: this.params.test.testId,
                suite: this.params.test.suite,
                name: checkName,
                viewport: params?.viewport || await getViewport(),
                hashCode: hasha(imageBuffer),
                domDump: domDump,

                browserName: this.params.test.browser,
                browserVersion: this.params.test.browserVersion,
                browserFullVersion: this.params.test.browserFullVersion,
                os: this.params.test.os,
                app: this.params.test.app,
                branch: this.params.test.branch,
            }
            Object.assign(
                opts,
                params,
            )
            return this.api.coreCheck(imageBuffer, opts, apikey)
        } catch (e: any) {
            log.error(`cannot create check, params: '${JSON.stringify(params)}' opts: '${JSON.stringify(opts)}, error: '${e.stack || e.toString()}'`)
            throw e
        }
    }

}

exports.SyngrisiDriver = WDIODriver
