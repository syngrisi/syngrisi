import hasha from 'hasha'
import { default as logger } from '@wdio/logger'
import { getDomDump } from './lib/getDomDump'

// @ts-ignore
import { SyngrisiApi } from '@syngrisi/core-api'
import {
    BaselineParams,
    BaselineParamsSchema,
    RequiredIdentOptionsSchema,
    RequiredIdentOptions
} from './schemas/Baseline.schema'
import { CheckOptions, CheckOptionsSchema } from './schemas/Check.schema'
import { CheckParams, Config } from './types'
import { SessionParams, SessionParamsSchema } from './schemas/SessionParams.schema'
import { getBrowserFullVersion, getBrowserName, getBrowserVersion, getOS, getViewport } from './lib/wdioHelpers'
import { paramsGuard } from './schemas/paramsGuard'

const log = logger('syngrisi-wdio-sdk')
export { getDomDump }

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

    async startTestSession({ params, suppressErrors = false }: { params: SessionParams, suppressErrors?: boolean }) {
        try {
            paramsGuard(params, 'startTestSession, params', SessionParamsSchema)

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

            const result = await this.api.startSession(this.params.test)
            if (result.error && !suppressErrors) {
                throw `❌ Start Test Session Error: ${JSON.stringify(result, null, '  ')}`
            }

            if (!result) {
                throw new Error(`response is empty, params: ${JSON.stringify(params, null, '\t')}`)
            }

            this.params.test.testId = result._id
            return result
        } catch (e: any) {
            const eMsg = `Cannot start session, error: '${e}' \n '${e.stack}'`
            log.error(eMsg)
            throw new Error(eMsg)
        }
    }

    async stopTestSession({ suppressErrors = false }: { suppressErrors?: boolean } = {}) {
        try {
            const testId = this.params.test.testId
            this.params.test.testId = undefined
            const result = await this.api.stopSession(testId)
            if (result.error && !suppressErrors) {
                throw `❌ Start Test Session Error: ${JSON.stringify(result, null, '  ')}`
            }
            log.debug(`Session with testId: '${result._id}' was stopped`)
            return result
        } catch (e: any) {
            const eMsg = `Cannot stop session, error: '${e}' \n '${e.stack}'`
            log.error(eMsg)
            throw e
        }

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
     * Check if the baseline exist with specific ident and specific snapshot hashcode
     * @param {Buffer} imageBuffer      image buffer
     * @param {string} name             name of check
     * @param {Object} params           object that must be related to ident array
     * @param {boolean} suppressErrors  suppress API errors
     * @returns {Promise<Object>}
     */
    // ident:  ['name', 'viewport', 'browserName', 'os', 'app', 'branch'];
    async checkIfBaselineExist({ params, imageBuffer, suppressErrors = false }
                                   : { name: string, imageBuffer: Buffer, params: BaselineParams, suppressErrors?: boolean }) {
        if(!Buffer.isBuffer(imageBuffer)) throw new Error('checkIfBaselineExist - wrong imageBuffer')
        paramsGuard(params, 'checkIfBaselineExist, params', BaselineParamsSchema)
        const imgHash = hasha(imageBuffer)

        let opts: RequiredIdentOptions = {
            name: params.name,
            viewport: params.viewport || await getViewport(),
            browserName: params.browserName || this.params.test.browser || await getBrowserVersion(),
            os: params.os || this.params.test.os || await getOS(),
            app: params.app || this.params.test.app,
            branch: params.branch || this.params.test.branch,
            imghash: imgHash,
        }

        paramsGuard(opts, 'checkIfBaselineExist, opts', RequiredIdentOptionsSchema)

        const result = await this.api.checkIfBaselineExist(opts)

        if (result.error && !suppressErrors) {
            throw `❌ Check If Baseline With certain snapshot hashcode error: ${JSON.stringify(result, null, '  ')}`
        }
        return result
    }

    async check({ checkName, imageBuffer, params, domDump, suppressErrors = false }: {
        checkName: string,
        imageBuffer: Buffer,
        params: CheckParams,
        domDump: any,
        suppressErrors?: boolean
    }) {
        if (this.params.test.testId === undefined) {
            throw new Error('The test id is empty, the session may not have started yet:'
                + `check name: '${checkName}', driver: '${JSON.stringify(this, null, '\t')}'`)
        }
        if (!Buffer.isBuffer(imageBuffer)) throw new Error('check - wrong imageBuffer')
        let opts: CheckOptions | null = null

        try {
            opts = {
                // ident:  ['name', 'viewport', 'browserName', 'os', 'app', 'branch'];
                name: checkName,
                viewport: params?.viewport || await getViewport(),
                browserName: this.params.test.browser,
                os: this.params.test.os,
                app: this.params.test.app,
                branch: this.params.test.branch,

                // ['name', 'viewport', 'browserName', 'os', 'app', 'branch', 'testId', 'suite', 'browserVersion', 'browserFullVersion' ];
                testId: this.params.test.testId,
                suite: this.params.test.suite,
                browserVersion: this.params.test.browserVersion,
                browserFullVersion: this.params.test.browserFullVersion,

                hashCode: hasha(imageBuffer),
                domDump: domDump,
            }
            paramsGuard(opts, 'check, opts', CheckOptionsSchema)

            Object.assign(
                opts,
                params,
            )
            const result = this.api.coreCheck(imageBuffer, opts)

            if (result.error && !suppressErrors) {
                throw `❌ Create Check error: ${JSON.stringify(result, null, '  ')}`
            }
            return result
        } catch (e: any) {
            log.error(`cannot create check, params: '${JSON.stringify(params)}' opts: '${JSON.stringify(opts)}, error: '${e.stack || e.toString()}'`)
            throw e
        }
    }

}

exports.SyngrisiDriver = WDIODriver
