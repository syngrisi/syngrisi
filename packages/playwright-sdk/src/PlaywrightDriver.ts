import hasha from 'hasha'
import { default as logger } from '@wdio/logger'

import { SyngrisiApi } from '@syngrisi/core-api'
import {
    BaselineParams,
    BaselineParamsSchema,
} from './schemas/Baseline.schema'
import { CheckOptions, CheckOptionsSchema } from './schemas/Check.schema'
import { BrowserName, CheckParams, Config, Params, PW } from '../types'
import { SessionParams, SessionParamsSchema } from './schemas/SessionParams.schema'
import { getBrowserFullVersion, getBrowserName, getBrowserVersion, getOS, getViewport } from './lib/pwHelpers'
import { paramsGuard } from './schemas/paramsGuard'
import { Browser, Page } from '@playwright/test'
import { ViewportSize } from 'playwright-core'
import { LogLevelDesc } from 'loglevel'

const log = logger('syngrisi-wdio-sdk')

// 0 | 4 | 2 | 1 | 3 | 5 | "trace" | "debug" | "info" | "warn" | "error" |
if (process.env.SYNGRISI_LOG_LEVEL) {
    log.setLevel(process.env.SYNGRISI_LOG_LEVEL as LogLevelDesc)
}

export class PlaywrightDriver {
    api: SyngrisiApi
    pw: PW
    page: Page
    browser: Browser
    browserName: BrowserName
    viewport: ViewportSize
    // config: any
    params: Params

    constructor(cfg: Config) {
        this.pw = cfg.pw
        this.page = cfg.pw.page
        this.browser = cfg.pw.browser
        this.browserName = cfg.pw.browserName
        this.viewport = cfg.pw.viewport

        // console.log(this.browser.version())
        this.api = new SyngrisiApi(cfg)
        this.params = {
            test: {}
        }
    }

    async startTestSession({ params, suppressErrors }: {
        params: SessionParams,
        suppressErrors?: boolean
    }) {
        try {
            paramsGuard(params, 'startTestSession, params', SessionParamsSchema)

            if (params.suite) {
                this.params.suite = params.suite || 'Unknown'
            }

            this.params.test = {
                os: params.os || await getOS(this.page),
                viewport: params.viewport || await getViewport(this.viewport),
                browser: params.browserName || await getBrowserName(this.browserName),
                browserVersion: params.browserVersion || getBrowserVersion(this.browser.version()),
                name: params.test,
                app: params.app,
                run: params.run,
                branch: params.branch,
                runident: params.runident,
                suite: params.suite,
                tags: params.tags,
                browserFullVersion: params.browserFullVersion || getBrowserFullVersion(this.browser.version())
            }
            // console.log('💥', this.params.test)

            // @ts-ignore
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

    async stopTestSession({ suppressErrors = false }: {
        suppressErrors?: boolean
    } = {}) {
        try {
            const testId = this.params.test.testId
            this.params.test.testId = undefined
            // @ts-ignore
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

    async getBaselines({ params }: {
        params: BaselineParams
    }) {
        let opts: BaselineParams = {
            name: params.name,
            viewport: params.viewport || await getViewport(this.viewport),
            browserName: params.browserName || this.params.test.browser || getBrowserVersion(this.browser.version()),
            os: params.os || this.params.test.os || await getOS(this.page),
            app: params.app || this.params.test.app,
            branch: params.branch || this.params.test.branch,
        }
        paramsGuard(opts, 'getBaseline, opts', BaselineParamsSchema)

        const result = await this.api.getBaselines(opts)

        if (result.error) {
            throw `❌ Get baselines error: ${JSON.stringify(result, null, '  ')}`
        }
        return result
    }

    async getSnapshots({ params }: any) {

        const result = await this.api.getSnapshots(params)

        if (result.error) {
            throw `❌ Get snapshots error: ${JSON.stringify(result, null, '  ')}`
        }
        return result
    }

    async check({ checkName, imageBuffer, params, domDump, suppressErrors = false }: {
        checkName: string,
        imageBuffer: Buffer,
        params: CheckParams,
        domDump?: any,
        suppressErrors?: boolean
    }) {
        // console.log(params)
        if (this.params.test.testId === undefined) {
            throw new Error('The test id is empty, the session may not have started yet:'
                + `check name: '${checkName}', driver: '${JSON.stringify(this, null, '\t')}'`)
        }
        if (!Buffer.isBuffer(imageBuffer)) throw new Error('check - wrong imageBuffer')
        let opts: CheckOptions | null = null
        const hash = hasha(imageBuffer)
        try {
            opts = {
                // ident:  ['name', 'viewport', 'browserName', 'os', 'app', 'branch'];
                name: checkName,
                // viewport: params?.viewport || await getViewport(this.viewport),
                viewport: await getViewport(this.viewport),
                // @ts-ignore
                browserName: this.params.test.browser,
                // @ts-ignore
                os: this.params.test.os,
                // @ts-ignore
                app: this.params.test.app,
                // @ts-ignore
                branch: this.params.test.branch,

                // ['name', 'viewport', 'browserName', 'os', 'app', 'branch', 'testId', 'suite', 'browserVersion', 'browserFullVersion' ];
                testId: this.params.test.testId,
                // @ts-ignore
                suite: this.params.test.suite,
                // @ts-ignore
                browserVersion: this.params.test.browserVersion,
                // @ts-ignore
                browserFullVersion: this.params.test.browserFullVersion,

                hashCode: hash || '',
                domDump: domDump,
            }
            paramsGuard(opts, 'check, opts', CheckOptionsSchema)

            Object.assign(
                // @ts-ignore
                opts,
                params,
            )

            // @ts-ignore
            const result = await this.api.coreCheck(imageBuffer, opts)

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
