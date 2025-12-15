import { createHash } from 'node:crypto'
import { LogLevelDesc } from 'loglevel'

import logger from './lib/logger'
import { getDomDump } from './lib/getDomDump'

import {
    SyngrisiApi,
    SessionResponse,
    ErrorObject,
    CheckParamsSchema as CheckOptsSchema,
    CheckParams as CheckOpts,
    Snapshot,
    BaselineParams,
    BaselineResponse,
    SnapshotResponse,
    CheckResponse
} from '@syngrisi/core-api'
import {
    BaselineParamsSchema,
    SessionParams, SessionParamsSchema, DriverParams
} from './schemas/WDIODriver'
import { CheckParams, Config } from './types'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getBrowserFullVersion, getBrowserName, getBrowserVersion, getOS, getViewport } from './lib/wdioHelpers'
import { paramsGuard } from './lib/paramsGuard'

const log = logger('syngrisi-wdio-sdk')
// 0 | 4 | 2 | 1 | 3 | 5 | "trace" | "debug" | "info" | "warn" | "error" |
if (process.env.SYNGRISI_LOG_LEVEL) {
    log.setLevel(process.env.SYNGRISI_LOG_LEVEL as LogLevelDesc)
}

export { getDomDump }

/**
 * The `WDIODriver` class is responsible for managing the interaction between WebdriverIO and the Syngrisi server.
 * It provides methods to start and stop test sessions, retrieve baselines and snapshots, and perform visual checks.
 */
export class WDIODriver {
    api: SyngrisiApi
    params: DriverParams
    private autoAccept: boolean

    /**
     * Creates an instance of the WDIODriver.
     * @param {Config} cfg - Configuration object for the Syngrisi API.
     * @example
     * const driver = new WDIODriver({
     *   url: '<your-syngrisi-url>',
     *   apiKey: 'your-api-key',
     *   autoAccept: true // Automatically accept new baselines
     * });
     */
    constructor(cfg: Config) {
        this.api = new SyngrisiApi(cfg)
        this.params = {
            // @ts-ignore
            test: {}
        }
        this.autoAccept = cfg.autoAccept || false
    }

    /**
     * Starts a new test session with the provided parameters.
     * @param {SessionParams} params - Parameters for the test session.
     * @param {boolean} [suppressErrors=false] - Flag to suppress thrown errors.
     * @returns {Promise<SessionResponse | ErrorObject>} The session response or an error object.
     * @example
     * driver.startTestSession({
     *   params: {
     *     os: 'Windows',
     *     browserName: 'chrome',
     *     test: 'Main Page Test',
     *     app: 'MyProject',
     *     run: 'run-123',
     *     branch: 'master',
     *     runident: 'run-identification-string',
     *     tags: ['tag1', 'tag2']
     *   },
     *   suppressErrors: true
     * });
     */
    public async startTestSession({ params, suppressErrors = false }: {
        params: SessionParams,
        suppressErrors?: boolean
    }): Promise<SessionResponse | ErrorObject> {
        try {
            paramsGuard(params, 'startTestSession, params', SessionParamsSchema)

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
                suite: params.suite || 'Unknown',
                tags: params.tags,

                browserFullVersion: params.browserFullVersion || await getBrowserFullVersion()
            }

            // noinspection DuplicatedCode
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
    } = {}): Promise<SessionResponse | ErrorObject> {
        try {
            const testId = this.params.test.testId
            if (!testId) {
                throw `❌ Stop Test Session Error: testId id empty, driver params: '${JSON.stringify(this.params)}'`
            }

            this.params.test.testId = undefined
            const result = await this.api.stopSession(testId)
            if ((result as ErrorObject).error && !suppressErrors) {
                throw `❌ Stop Test Session Error: ${JSON.stringify(result, null, '  ')}`
            }
            log.debug(`Session with testId: '${(result as SessionResponse)._id}' was stopped`)
            return result
        } catch (e: any) {
            const eMsg = `Cannot stop session, error: '${e}' \n '${e.stack}'`
            log.error(eMsg)
            throw e
        }
    }

    /**
     * Fetches baselines matching the provided criteria.
     * @param {BaselineParams} params - Baseline search parameters.
     * @returns {Promise<BaselineResponse | ErrorObject>} The baseline response or an error object.
     * @example
     * driver.getBaselines({
     *   params: {
     *     name: 'Main Page',
     *     viewport: '1200x800',
     *     browserName: 'chrome',
     *     os: 'Windows',
     *     app: 'MyProject',
     *     branch: 'master'
     *   }
     * });
     */
    async getBaselines({ params }: {
        params: BaselineParams
    }): Promise<BaselineResponse | ErrorObject> {
        // ident:  ['name', 'viewport', 'browserName', 'os', 'app', 'branch'];
        let opts: BaselineParams = {
            name: params.name,
            viewport: params.viewport || await getViewport(),
            browserName: params.browserName || this.params.test.browser || await getBrowserVersion(),
            os: params.os || this.params.test.os || await getOS(),
            app: params.app || this.params.test.app,
            branch: params.branch || this.params.test.branch,
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
     * @param {Snapshot} params - Snapshot search parameters.
     * @returns {Promise<SnapshotResponse | ErrorObject>} The snapshot response or an error object.
     * @example
     * driver.getSnapshots({
     *   params: {
     *     name: 'Checkout Page',
     *     viewport: '1200x800',
     *     browserName: 'firefox',
     *     os: 'macOS',
     *     app: 'E-commerce Platform',
     *     branch: 'feature-xyz'
     *   }
     * });
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
     * @param {string} checkName - Name of the check.
     * @param {Buffer} imageBuffer - Buffer containing image data for the check.
     * @param {CheckParams} params - Additional check parameters.
     * @param {any} domDump - Serialized DOM dump associated with the image check.
     * @param {boolean} [suppressErrors=false] - Flag to suppress thrown errors.
     * @returns {Promise<CheckResponse | ErrorObject>} The check response or an error object.
     * @example
     * driver.check({
     *   checkName: 'Main Navigation Bar',
     *   imageBuffer: fs.readFileSync('navbar.png'),
     *   params: {
     *     viewport: '1200x800',
     *     browserName: 'chrome',
     *     os: 'Windows',
     *     app: 'MyApp',
     *     branch: 'develop',
     *     autoAccept: true // Auto-accept if no baseline exists
     *   },
     *   suppressErrors: false
     * });
     */
    async check({ checkName, imageBuffer, params, domDump, suppressErrors = false }: {
        checkName: string,
        imageBuffer: Buffer,
        params: CheckParams,
        domDump: any,
        suppressErrors?: boolean
    }): Promise<CheckResponse | ErrorObject> {
        if (this.params.test.testId === undefined) {
            throw new Error('The test id is empty, the session may not have started yet:'
                + `check name: '${checkName}', driver: '${JSON.stringify(this, null, '\t')}'`)
        }
        if (!Buffer.isBuffer(imageBuffer)) throw new Error('check - wrong imageBuffer')
        let opts: CheckOpts | null = null

        // Check if DOM data should be skipped (via env var or option)
        // Default: skipDomData is true (disabled) unless explicitly enabled via env var or params
        const skipDomData = params?.skipDomData ?? (process.env.SYNGRISI_DISABLE_DOM_DATA !== 'false')

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

                hashCode: createHash('sha512').update(imageBuffer).digest('hex'),
                domDump: skipDomData ? undefined : domDump,
                skipDomData: skipDomData || undefined,
            }
            paramsGuard(opts, 'check, opts', CheckOptsSchema)

            // Remove autoAccept from params before sending to API (it's SDK-only)
            const { autoAccept: checkAutoAccept, ...apiParams } = params || {}
            Object.assign(
                opts,
                apiParams,
            )
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
     * Accepts a check by setting a new baseline for it.
     * @param {string} checkId - The unique identifier of the check to accept.
     * @param {string} baselineId - The unique identifier of the baseline to set as the new accepted baseline.
     * @param {boolean} [suppressErrors=false] - Flag to suppress thrown errors.
     * @returns {Promise<CheckResponse | ErrorObject>} The accept check response or an error object.
     * @example
     * const driver = new WDIODriver({ url: 'http://syngrisi-server.com', apiKey: 'your-api-key' });
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
     *     new WDIODriver.Region(0, 0, 100, 50)
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

exports.SyngrisiDriver = WDIODriver
