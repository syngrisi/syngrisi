/**
 * Syngrisi Playwright SDK provides an integration between Playwright and the Syngrisi API for visual regression testing.
 * Contains methods to manage browser sessions, start and stop test sessions, and perform visual checks against baselines.
 *
 * @module PlaywrightDriver
 */
import { createHash } from 'node:crypto'
import { SyngrisiApi, SessionResponse, ErrorObject, SnapshotResponse, Snapshot, CheckResponse, DomNode } from '@syngrisi/core-api'
import { Browser, Page } from '@playwright/test'
import { ViewportSize } from 'playwright-core'
import { LogLevelDesc } from 'loglevel'

import {
    BaselineParams,
    BaselineParamsSchema,
} from './schemas/Baseline.schema'
import { CheckOptions, CheckOptionsSchema } from './schemas/Check.schema'
import { BrowserName, CheckParams, Config, Params } from '../types'
import { SessionParams, SessionParamsSchema } from './schemas/SessionParams.schema'
import { getBrowserFullVersion, getBrowserName, getBrowserVersion, getOS, getViewport } from './lib/pwHelpers'
import { paramsGuard } from './schemas/paramsGuard'
import { default as logger } from '@wdio/logger'
import { PlaywrightEntities } from './PlaywrightEntities'

const log = logger('syngrisi-playwright-sdk')
// 0 | 4 | 2 | 1 | 3 | 5 | "trace" | "debug" | "info" | "warn" | "error" |
if (process.env.SYNGRISI_LOG_LEVEL) {
    log.setLevel(process.env.SYNGRISI_LOG_LEVEL as LogLevelDesc)
}

/**
 * The `PlaywrightDriver` class is responsible for managing the interaction between the Playwright Framework and the Syngrisi server.
 * It provides methods to start and stop test sessions, retrieve baselines and snapshots, and perform visual checks.
 */
export class PlaywrightDriver {
    api: SyngrisiApi
    page: Page
    browser: Browser
    browserName: BrowserName
    viewport: ViewportSize
    params: Params
    private autoAccept: boolean

    /**
     * Constructs the PlaywrightDriver instance for interacting with Syngrisi API.
     * Initializes with Playwright's page object, Syngrisi API configuration, and default parameters setup.
     * @param {Config} config - The configuration object for setting up the Syngrisi API connection and Playwright integration.
     * @throws Will throw an error if the Playwright page object is not provided or if the Syngrisi API configuration is incomplete.
     * @example
     * // Example of creating a new PlaywrightDriver instance
     * const driver = new PlaywrightDriver({
     *   page: await browser.newPage(), // assuming 'browser' is a Playwright Browser instance
     *   url: 'your-syngrisi-url', // Syngrisi server URL
     *   apiKey: 'your-api-key', // API key for Syngrisi server authentication
     *   autoAccept: true // Automatically accept new baselines
     * });
     */
    constructor({ page, url, apiKey, autoAccept }: Config) {
        const pw = new PlaywrightEntities(page)
        this.page = pw.page
        this.browser = pw.browser
        this.browserName = pw.browserName
        this.viewport = pw.viewport

        this.api = new SyngrisiApi({ url, apiKey })
        this.params = {
            test: {}
        }
        this.autoAccept = autoAccept || false
    }

    /**
     * Starts a new test session with the given parameters.
     * If parameters [os, viewport, browserName, browserVersion, browserFullVersion] are not provided,
     * it defaults to the value obtained from the browser or OS environment.
     * @param {SessionParams} params - Parameters to start a test session including test details and environment info.
     * @param {boolean} [suppressErrors=false] - Whether to suppress errors and not throw exceptions.
     * @returns {Promise<SessionResponse | ErrorObject>} - The started test session data or an error object.
     * @example
     * const driver = new PlaywrightDriver({ page, url: 'http://syngrisi-server.com', apiKey: 'your-api-key' });
     * const session = await driver.startTestSession({
     *   params: {
     *     os: 'macOS',
     *     viewport: { width: 1200, height: 800 },
     *     browserName: 'chrome',
     *     browserVersion: '114',
     *     name: 'Homepage Test',
     *     app: 'MyProject',
     *     run: 'Run 123',
     *     runident: 'run-identifier',
     *     branch: 'main',
     *     suite: 'Smoke Tests',
     *     tags: ['tag1', 'tag2'],
     *     browserFullVersion: '90.0.4430.85'
     *   }
     * });
     */
    async startTestSession({ params, suppressErrors }: {
        params: SessionParams,
        suppressErrors?: boolean
    }): Promise<SessionResponse | ErrorObject> {
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

            // @ts-ignore
            const result = await this.api.startSession(this.params.test)
            if ((result as ErrorObject).error && !suppressErrors) {
                throw `❌ Start Test Session Error: ${JSON.stringify(result, null, '  ')}`
            }

            if (!result) {
                throw new Error(`response is empty, params: ${JSON.stringify(params, null, '\t')}`)
            }

            this.params.test.testId = (result as SessionResponse)._id
            return result
        } catch (e: any) {
            const eMsg = `Cannot start session, error: '${e}' \n '${e.stack}'`
            log.error(eMsg)
            throw new Error(eMsg)
        }
    }

    /**
     * Stops the currently running test session.
     * @param {boolean} [suppressErrors=false] - Flag to suppress thrown errors.
     * @returns {Promise<SessionResponse | ErrorObject>} The stop session response or an error object.
     * @example
     * driver.stopTestSession();
     */
    async stopTestSession({ suppressErrors = false }: {
        suppressErrors?: boolean
    } = {}) {
        try {
            const testId = this.params.test.testId
            this.params.test.testId = undefined
            // @ts-ignore
            const result: Test = await this.api.stopSession(testId)
            if ((result as ErrorObject).error && !suppressErrors) {
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

    /**
     * Fetches baselines matching the provided criteria.
     *
     * @param {BaselineParams} params - The parameters to identify the baseline images to retrieve.
     * @returns {Promise<SnapshotResponse | ErrorObject>} - The retrieved baseline images or an error object.
     * @example
     * // Assuming the Syngrisi driver instance has been initialized
     * const baselineParams = {
     *   name: 'Login Page',
     *   viewport: { width: 1024, height: 768 },
     *   browserName: 'chrome',
     *   os: 'windows',
     *   app: 'YourProject',
     *   branch: 'develop',
     * };
     * const baselines = await driver.getBaselines({ params: baselineParams });
     */
    async getBaselines({ params }: {
        params: BaselineParams
    }) {
        let opts: BaselineParams = {
            name: params.name,
            viewport: params.viewport || await getViewport(this.viewport),
            browserName: params.browserName || this.params.test.browser || getBrowserVersion(this.browser.version()),
            os: params.os || this.params.test.os || await getOS(this.page),
            app: params.app || this.params.test.app!,
            branch: params.branch || this.params.test.branch!,
        }
        paramsGuard(opts, 'getBaseline, opts', BaselineParamsSchema)

        const result = await this.api.getBaselines(opts)

        if ((result as ErrorObject).error) {
            throw `❌ Get baselines error: ${JSON.stringify(result, null, '  ')}`
        }
        return result
    }

    /**
     * Retrieves snapshots based on the given search criteria.
     * @param {Snapshot} params - The snapshot query parameters to retrieve test snapshots.
     * @returns {Promise<SnapshotResponse | ErrorObject>} - The retrieved snapshots or an error object.
     * @example
     * ```
     * // Assuming the Syngrisi driver instance has been initialized
     * const snapshotParams = {
     *   testId: 'unique-test-id',
     *   name: 'Main Page',
     *   // additional filter parameters if necessary
     * };
     * const snapshots = await driver.getSnapshots({ params: snapshotParams });
     * ```
     */
    async getSnapshots({ params }: {
        params: Snapshot
    }): Promise<SnapshotResponse | ErrorObject> {

        const result = await this.api.getSnapshots(params)

        if ((result as ErrorObject).error) {
            throw `❌ Get snapshots error: ${JSON.stringify(result, null, '  ')}`
        }
        return result
    }

    /**
     * Submits a check to Syngrisi with the provided image and associated test details.
     * @param {string} checkName - The name of the visual check being performed.
     * @param {Buffer} imageBuffer - The image data buffer of the current snapshot.
     * @param {CheckParams} params - Additional parameters for the check.
     * @param {any} [domDump] - An optional DOM dump to accompany the snapshot.
     * @param {boolean} [suppressErrors=false] - Whether to suppress errors and not throw exceptions.
     * @returns {Promise<SnapshotResponse | ErrorObject>} - The result of the visual comparison check.
     * @example
     * driver.check({
     *   checkName: 'Main Navigation Bar',
     *   imageBuffer: fs.readFileSync('navbar.png'),
     *   params: {
     *     viewport: '1200x800',
     *     browserName: 'chrome',
     *     os: 'Windows',
     *     app: 'MyProject',
     *     branch: 'develop',
     *     autoAccept: true // Auto-accept if no baseline exists
     *   },
     *   suppressErrors: false
     * });
     */
    async check({ checkName, imageBuffer, params, domDump, collectDom = false, suppressErrors = false }: {
        checkName: string,
        imageBuffer: Buffer,
        params: CheckParams,
        domDump?: DomNode,
        collectDom?: boolean,
        suppressErrors?: boolean
    }) {
        // console.log(params)
        if (this.params.test.testId === undefined) {
            throw new Error('The test id is empty, the session may not have started yet:'
                + `check name: '${checkName}', driver: '${JSON.stringify(this, null, '\t')}'`)
        }
        if (!Buffer.isBuffer(imageBuffer)) throw new Error('check - wrong imageBuffer')
        let opts: CheckOptions | null = null
        const hash = createHash('sha512').update(imageBuffer).digest('hex')

        // Auto-collect DOM if requested and not already provided
        let finalDomDump = domDump
        if (collectDom && !domDump) {
            try {
                const collected = await this.collectDomDump()
                finalDomDump = collected ?? undefined
            } catch (e) {
                log.warn(`Failed to collect DOM dump: ${e}`)
            }
        }

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
                domDump: finalDomDump,
            }
            paramsGuard(opts, 'check, opts', CheckOptionsSchema)

            // Remove autoAccept from params before sending to API (it's SDK-only)
            const { autoAccept: checkAutoAccept, ...apiParams } = params || {}
            Object.assign(
                // @ts-ignore
                opts,
                apiParams,
            )

            // @ts-ignore
            const result = await this.api.coreCheck(imageBuffer, opts)

            if ((result as ErrorObject).error && !suppressErrors) {
                throw `❌ Create Check error: ${JSON.stringify(result, null, '  ')}`
            }

            // Auto-accept new checks if enabled (check-level or driver-level)
            const shouldAutoAccept = checkAutoAccept ?? this.autoAccept
            if (shouldAutoAccept && !(result as ErrorObject).error) {
                const checkResult = result as CheckResponse
                const status = Array.isArray(checkResult.status)
                    ? checkResult.status[0]
                    : checkResult.status

                if (status === 'new') {
                    log.info(`Auto-accepting new check: '${checkName}' (id: ${checkResult._id})`)
                    const acceptResult = await this.acceptCheck({
                        checkId: checkResult._id,
                        baselineId: checkResult.actualSnapshotId,
                        suppressErrors
                    })

                    if ((acceptResult as ErrorObject).error && !suppressErrors) {
                        log.warn(`Failed to auto-accept check '${checkName}': ${JSON.stringify(acceptResult)}`)
                    } else {
                        log.debug(`Successfully auto-accepted check '${checkName}'`)
                        return acceptResult
                    }
                }
            }

            return result
        } catch (e: any) {
            log.error(`cannot create check, params: '${JSON.stringify(params)}' opts: '${JSON.stringify(opts)}, error: '${e.stack || e.toString()}'`)
            throw e
        }
    }

    /**
     * Collects DOM tree from the current page for RCA (Root Cause Analysis).
     * This method captures the DOM structure along with computed styles and bounding rectangles.
     *
     * @returns {Promise<DomNode | null>} - The collected DOM tree or null if collection fails.
     * @example
     * const driver = new PlaywrightDriver({ page, url: 'http://syngrisi-server.com', apiKey: 'your-api-key' });
     * const domDump = await driver.collectDomDump();
     * // Use with check:
     * await driver.check({
     *   checkName: 'Homepage',
     *   imageBuffer: screenshot,
     *   params: {},
     *   domDump: domDump
     * });
     * // Or use collectDom option:
     * await driver.check({
     *   checkName: 'Homepage',
     *   imageBuffer: screenshot,
     *   params: {},
     *   collectDom: true // Auto-collects DOM
     * });
     */
    async collectDomDump(): Promise<DomNode | null> {
        try {
            const domDump = await this.page.evaluate(() => {
                const MAX_DEPTH = 15
                const MAX_TEXT_LENGTH = 200
                const SKIP_TAGS = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'META', 'LINK', 'HEAD', 'SVG', 'PATH']
                const STYLES_TO_CAPTURE = [
                    'display', 'visibility', 'opacity',
                    'position', 'top', 'right', 'bottom', 'left',
                    'width', 'height', 'min-width', 'min-height', 'max-width', 'max-height',
                    'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
                    'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
                    'border', 'border-width', 'border-style', 'border-color', 'border-radius',
                    'background-color', 'color',
                    'font-family', 'font-size', 'font-weight', 'line-height', 'text-align',
                    'text-decoration', 'text-transform', 'letter-spacing',
                    'overflow', 'overflow-x', 'overflow-y',
                    'z-index', 'transform',
                    'flex', 'flex-direction', 'flex-wrap', 'justify-content', 'align-items', 'align-content', 'gap',
                    'grid-template-columns', 'grid-template-rows', 'grid-gap',
                    'box-shadow',
                ]

                function isVisible(el: Element): boolean {
                    const style = window.getComputedStyle(el)
                    if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0) {
                        return false
                    }
                    const rect = el.getBoundingClientRect()
                    return rect.width > 0 && rect.height > 0
                }

                function getAttributes(el: Element): Record<string, string> {
                    const attrs: Record<string, string> = {}
                    for (const attr of Array.from(el.attributes)) {
                        if (!attr.name.startsWith('data-') || attr.name === 'data-testid') {
                            attrs[attr.name] = attr.value
                        }
                    }
                    return attrs
                }

                function getComputedStyles(el: Element): Record<string, string> {
                    const computed = window.getComputedStyle(el)
                    const styles: Record<string, string> = {}
                    for (const prop of STYLES_TO_CAPTURE) {
                        const value = computed.getPropertyValue(prop)
                        if (value && value !== 'initial' && value !== 'none' && value !== 'normal' && value !== 'auto' && value !== '0px' && value !== 'rgba(0, 0, 0, 0)') {
                            const camelProp = prop.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
                            styles[camelProp] = value
                        }
                    }
                    return styles
                }

                function getDirectText(el: Element): string | undefined {
                    let text = ''
                    for (const child of Array.from(el.childNodes)) {
                        if (child.nodeType === Node.TEXT_NODE) {
                            text += child.textContent?.trim() || ''
                        }
                    }
                    const trimmed = text.trim()
                    if (!trimmed) return undefined
                    return trimmed.length > MAX_TEXT_LENGTH ? trimmed.substring(0, MAX_TEXT_LENGTH) + '...' : trimmed
                }

                function collectNode(el: Element, depth: number = 0): any {
                    if (depth > MAX_DEPTH) return null
                    if (!isVisible(el)) return null
                    if (SKIP_TAGS.includes(el.tagName)) return null

                    const rect = el.getBoundingClientRect()
                    const children: any[] = []
                    for (const child of Array.from(el.children)) {
                        const childNode = collectNode(child, depth + 1)
                        if (childNode) children.push(childNode)
                    }

                    return {
                        tagName: el.tagName.toLowerCase(),
                        attributes: getAttributes(el),
                        rect: {
                            x: Math.round(rect.x),
                            y: Math.round(rect.y),
                            width: Math.round(rect.width),
                            height: Math.round(rect.height),
                        },
                        computedStyles: getComputedStyles(el),
                        children,
                        text: getDirectText(el),
                    }
                }

                return collectNode(document.body)
            })

            return domDump as DomNode | null
        } catch (e: any) {
            log.warn(`Failed to collect DOM dump: ${e.message}`)
            return null
        }
    }

    /**
     * Accepts a check by setting a new baseline for it.
     * @param {string} checkId - The unique identifier of the check to accept.
     * @param {string} baselineId - The unique identifier of the baseline to set as the new accepted baseline.
     * @param {boolean} [suppressErrors=false] - Whether to suppress errors and not throw exceptions.
     * @returns {Promise<CheckResponse | ErrorObject>} - The result of the accept operation.
     * @example
     * const driver = new PlaywrightDriver({ page, url: 'http://syngrisi-server.com', apiKey: 'your-api-key' });
     * const result = await driver.acceptCheck({
     *   checkId: 'check-id-123',
     *   baselineId: 'baseline-id-456'
     * });
     */
    async acceptCheck({ checkId, baselineId, suppressErrors = false }: {
        checkId: string,
        baselineId: string,
        suppressErrors?: boolean
    }): Promise<CheckResponse | ErrorObject> {
        try {
            const result = await this.api.acceptCheck(checkId, baselineId)

            if ((result as ErrorObject).error && !suppressErrors) {
                throw `❌ Accept Check error: ${JSON.stringify(result, null, '  ')}`
            }
            return result
        } catch (e: any) {
            const eMsg = `Cannot accept check, checkId: '${checkId}', baselineId: '${baselineId}', error: '${e.stack || e.toString()}'`
            log.error(eMsg)
            throw e
        }
    }

    /**
     * Region to ignore during visual comparison.
     * Coordinates are in pixels relative to the image.
     */
    static Region = class {
        left: number
        top: number
        right: number
        bottom: number

        constructor(left: number, top: number, right: number, bottom: number) {
            this.left = left
            this.top = top
            this.right = right
            this.bottom = bottom
        }
    }

    /**
     * Sets ignore regions on a baseline. These regions will be excluded from visual comparison.
     * @param {string} baselineId - The unique identifier of the baseline.
     * @param {Array<{left: number, top: number, right: number, bottom: number}>} regions - Array of region objects.
     * @param {boolean} [suppressErrors=false] - Flag to suppress thrown errors.
     * @returns {Promise<any | ErrorObject>} The update result or an error object.
     * @example
     * // Set ignore regions on a baseline
     * await driver.setIgnoreRegions({
     *   baselineId: 'baseline-id-123',
     *   regions: [
     *     { left: 0, top: 0, right: 100, bottom: 50 },     // Top banner
     *     { left: 200, top: 300, right: 400, bottom: 350 } // Dynamic content area
     *   ]
     * });
     *
     * // Using Region helper class
     * await driver.setIgnoreRegions({
     *   baselineId: 'baseline-id-123',
     *   regions: [
     *     new PlaywrightDriver.Region(0, 0, 100, 50)
     *   ]
     * });
     */
    async setIgnoreRegions({ baselineId, regions, suppressErrors = false }: {
        baselineId: string,
        regions: Array<{ left: number, top: number, right: number, bottom: number }>,
        suppressErrors?: boolean
    }): Promise<any | ErrorObject> {
        try {
            if (!baselineId) {
                throw new Error('baselineId is required')
            }
            if (!Array.isArray(regions)) {
                throw new Error('regions must be an array')
            }

            // Validate region format
            for (const region of regions) {
                if (typeof region.left !== 'number' ||
                    typeof region.top !== 'number' ||
                    typeof region.right !== 'number' ||
                    typeof region.bottom !== 'number') {
                    throw new Error(`Invalid region format: ${JSON.stringify(region)}. Expected {left, top, right, bottom} as numbers.`)
                }
            }

            const ignoreRegions = JSON.stringify(regions)
            log.debug(`Setting ignore regions on baseline '${baselineId}': ${ignoreRegions}`)

            const result = await this.api.updateBaseline(baselineId, { ignoreRegions })

            if ((result as ErrorObject).error && !suppressErrors) {
                throw `❌ Set Ignore Regions error: ${JSON.stringify(result, null, '  ')}`
            }
            return result
        } catch (e: any) {
            const eMsg = `Cannot set ignore regions, baselineId: '${baselineId}', error: '${e.stack || e.toString()}'`
            log.error(eMsg)
            throw e
        }
    }
}
