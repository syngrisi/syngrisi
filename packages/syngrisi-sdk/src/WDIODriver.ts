import hasha from 'hasha'
import { default as logger } from '@wdio/logger'
import { getDomDump } from './lib/getDomDump'
import { prettyCheckResult } from './lib/utils'
import { SyngrisiApi } from './lib/api'
import { SessionParams } from './types'
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
        this.config = cfg
        this.params = {}
    }

    // static async getViewport() {
    //     if (isAndroid()) {
    //         // @ts-ignore
    //         return browser.capabilities.deviceScreenSize
    //     }
    //
    //     const viewport = await browser.getWindowSize()
    //     if (viewport && viewport.width && viewport.height) {
    //         return `${viewport.width}x${viewport.height}`
    //     }
    //     return '0x0'
    // }
    //
    // static transformOs(platform: string) {
    //     const lowercasePlatform = platform.toLowerCase()
    //     const transform: { [key: string]: string } = {
    //         win32: 'WINDOWS',
    //         windows: 'WINDOWS',
    //         macintel: 'macOS',
    //     }
    //     return transform[lowercasePlatform] || platform
    // }
    //
    // // not really os but more wide therm 'platform'
    // static async getOS() {
    //     let platform
    //     if (isAndroid() || isIos()) {
    //
    //         // @ts-ignore
    //         platform = browser.options?.capabilities['bstack:options']?.deviceName
    //             // @ts-ignore
    //             || browser.options?.capabilities['appium:deviceName']
    //             // @ts-ignore
    //             || browser.options?.capabilities?.deviceName
    //         if (!platform) {
    //
    //             throw new Error(`Cannot get the platform of your device: ${JSON.stringify(browser.options?.capabilities)}`)
    //         }
    //     } else {
    //         let navPlatform
    //         for (let x = 0; x < 5; x++) {
    //             try {
    //                 navPlatform = await browser.execute(() => navigator.platform)
    //                 if (navPlatform) break
    //             } catch (e) {
    //                 log.error(`Error - cannot get the platform #${x}: '${e}'`)
    //                 await browser.pause(500)
    //                 navPlatform = await browser.execute(() => navigator.platform)
    //             }
    //         }
    //         // @ts-ignore
    //         platform = browser.capabilities.platform || navPlatform
    //     }
    //
    //     if (process.env.ENV_POSTFIX) {
    //         return `${platform}_${process.env.ENV_POSTFIX}`
    //     }
    //     return transformOs(platform)
    // }
    //
    // static getBrowserName() {
    //     // @ts-ignore
    //     let { browserName } = browser.capabilities
    //     // @ts-ignore
    //     const chromeOpts = browser.options.capabilities['goog:chromeOptions']
    //     if (chromeOpts && chromeOpts.args && chromeOpts.args.includes('--headless')) {
    //         browserName += ' [HEADLESS]'
    //     }
    //     return browserName
    // }
    //
    // static isAndroid() {
    //     return (
    //         browser.isAndroid
    //         // @ts-ignore
    //         || (browser.options.capabilities.browserName === 'Android')
    //         // @ts-ignore
    //         || (browser.options.capabilities.platformName === 'Android')
    //     )
    // }
    //
    // static isIos() {
    //     return browser.isIOS
    //         // @ts-ignore
    //         || (browser.execute(() => navigator.platform) === 'iPhone')
    //         // @ts-ignore
    //         || (browser.options.capabilities?.platformName?.toLowerCase() === 'ios')
    //         // @ts-ignore
    //         || (browser.options.capabilities?.browserName === 'iPhone')
    //         || false
    // }
    //
    // static getBrowserFullVersion() {
    //     let version
    //     if (isAndroid() || isIos()) {
    //         // @ts-ignore
    //         version = browser.options?.capabilities['bstack:options']?.osVersion
    //             // @ts-ignore
    //             || browser.capabilities?.version
    //             // @ts-ignore
    //             || browser.options?.capabilities.platformVersion
    //     } else {
    //         // @ts-ignore
    //         version = browser.capabilities?.browserVersion || browser.capabilities?.version
    //     }
    //     if (!version) {
    //         // eslint-disable-next-line max-len
    //         throw new Error('Cannot get Browser Version, try to check "capabilities.version", "capabilities.platformVersion" or "capabilities.browserVersion"')
    //     }
    //     return version
    // }
    //
    // // return major version of browser
    // static getBrowserVersion() {
    //     const fullVersion = getBrowserFullVersion()
    //     if (!fullVersion.includes('.')) {
    //         return fullVersion
    //     }
    //     return fullVersion.split('.')[0]
    // }

    async startTestSession(params: SessionParams, apikey: string) {
        const $this = this
        try {
            if (!params.run || !params.runident || !params.test || !params.branch || !params.app) {
                throw new Error(`error startTestSession one of mandatory parameters aren't present (run, runident, branch, app  or test), params: '${JSON.stringify(params)}'`)
            }

            $this.params.ident = await $this.api.getIdent(apikey)

            if (params.suite) {
                $this.params.suite = params.suite || 'Unknown'
            }

            const os = params.os || await getOS()
            const viewport = params.viewport || await getViewport()
            const browserName = params.browserName || await getBrowserName()
            const browserVersion = params.browserVersion || await getBrowserVersion()
            const browserFullVersion = params.browserFullVersion || await getBrowserFullVersion()
            const testName = params.test

            Object.assign(
                $this.params,
                {
                    os: os,
                    viewport: viewport,
                    browserName: browserName,
                    browserVersion: browserVersion,
                    browserFullVersion: browserFullVersion,
                    app: params.app,
                    test: testName,
                    branch: params.branch,
                }
            )
            const respJson = await $this.api.startSession({
                name: testName,
                status: 'Running',
                viewport: viewport,
                browserName: browserName,
                browserVersion: browserVersion,
                os: os,
                app: params.app,
                run: params.run,
                suite: $this.params.suite,
                runident: params.runident,
                tags: params.tags,
                branch: params.branch,
            }, apikey)
            if (!respJson) {
                throw new Error(`response is empty, params: ${JSON.stringify(params, null, '\t')}`)
            }

            $this.params.testId = respJson._id

            return respJson
        } catch (e: any) {
            log.error(`Cannot start session, error: '${e}' \n '${e.stack || ''}'`)
            throw new Error(`Cannot start session, error: '${e}' \n '${e.stack || ''}'`)
        }
    }

    async stopTestSession(apikey: string) {
        const result = await this.api.stopSession(this.params.testId, apikey)
        log.info(`Session with testId: '${result._id}' was stopped`)
    }

    addMessageIfCheckFailed(result: any) {
        const $this = this
        const patchedResult = result
        if (patchedResult.status.includes('failed')) {
            const checkView = `'${$this.config.url}?checkId=${patchedResult._id}&modalIsOpen=true'`
            patchedResult.message = `To evaluate the results of the check, follow the link: '${checkView}'`
            // basically the links is useless - backward compatibility
            patchedResult.vrsGroupLink = checkView
            patchedResult.vrsDiffLink = checkView
        }
        return patchedResult
    }

    identArgsGuard(params: any) {
        this.params.ident.forEach((item: string) => {
            if (!params[item]) {
                throw new Error(`Wrong parameters for ident, the '${item}' property is empty`)
            }
        })
    }

    removeNonIdentProperties(params: any) {
        const opts = { ...params }

        for (const prop of Object.keys(opts)) {
            if (!(prop in this.params.ident)) delete opts[prop]
        }
        return opts
    }

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
        const $this = this
        const imgHash = hasha(imageBuffer)
        let opts = {
            name: name,
            viewport: params.viewport || await getViewport(),
            browserName: $this.params.browserName || await getBrowserVersion(),
            os: $this.params.os || await getOS(),
            app: $this.params.app,
            branch: $this.params.branch,
            imghash: imgHash,
        }

        this.identArgsGuard(opts)
        Object.assign(opts, this.removeNonIdentProperties(params))
        return $this.api.checkIfBaselineExist(opts, apikey)
    }

    async check(checkName: string, imageBuffer: Buffer, apikey: string, params: any, domDump: any) {
        const $this = this
        if ($this.params.testId === undefined) {
            throw new Error('The test id is empty, the session may not have started yet:'
                + `check name: '${checkName}', driver: '${JSON.stringify($this, null, '\t')}'`)
        }
        let opts = {}
        try {
            // ident:  ['name', 'viewport', 'browserName', 'os', 'app', 'branch'];
            opts = {
                testId: $this.params?.testId,
                suite: $this.params?.suite,
                name: checkName,
                viewport: params?.viewport || await getViewport(),
                browserName: $this.params?.browserName || await getBrowserVersion(),
                browserVersion: $this.params?.browserVersion || await getBrowserVersion(),
                browserFullVersion: $this.params?.browserFullVersion || await getBrowserFullVersion(),
                os: $this.params?.os || await getOS(),
                app: $this.params?.app,
                branch: $this.params?.branch,
                hashCode: hasha(imageBuffer),
                domDump: domDump,
            }
            Object.assign(
                opts,
                params,
            )
            return $this.coreCheck(imageBuffer, opts, apikey)
        } catch (e: any) {
            throw new Error(`cannot create check, parameters: '${JSON.stringify(opts)}, error: '${e.stack || e}'`)
        }
    }

    async coreCheck(imageBuffer: Buffer, params: any, apikey: string) {
        const $this = this
        let resultWithHash = await $this.api.createCheck(params, null, params.hashCode, apikey)
        resultWithHash = $this.addMessageIfCheckFailed(resultWithHash)

        log.info(`Check result Phase #1: ${prettyCheckResult(resultWithHash)}`)
        if (resultWithHash.status === 'requiredFileData') {
            let resultWithFile = await $this.api.createCheck(params, imageBuffer, params.hashCode, apikey)
            log.info(`Check result Phase #2: ${prettyCheckResult(resultWithFile)}`)
            resultWithFile = $this.addMessageIfCheckFailed(resultWithFile)
            return resultWithFile
        }
        return resultWithHash
    }
}

exports.SyngrisiDriver = WDIODriver
