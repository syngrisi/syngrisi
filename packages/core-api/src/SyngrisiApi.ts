import FormData from 'form-data'
import got from 'got-cjs'
import hasha from 'hasha'
import logger from '@wdio/logger'
import { LogLevelDesc } from 'loglevel'
import { errorObject, paramsGuard, prettyCheckResult, printErrorResponseBody } from './utils'
import {
    BaselineParams,
    BaselineParamsSchema,
    BaselineResponse,
    CheckParams,
    CheckParamsSchema,
    CheckResponse,
    Snapshot,
    SnapshotResponse,
    SnapshotSchema,
    ApiSessionParams,
    ApiSessionParamsSchema,
    Config,
    ConfigSchema,
    SessionResponse, ConstructorParam, ErrorObject,
} from '../schemas/SyngrisiApi.schema'

const log = logger('core-api')
// 0 | 4 | 2 | 1 | 3 | 5 | "trace" | "debug" | "info" | "warn" | "error" |
if (process.env.SYNGRISI_LOG_LEVEL) {
    log.setLevel(process.env.SYNGRISI_LOG_LEVEL as LogLevelDesc)
}

/**
 * Represents the API client for the Syngrisi visual regression testing service.
 * It provides various methods to interact with the Syngrisi service, including
 * starting and stopping test sessions, creating checks, and retrieving information
 * about baselines and snapshots.
 * @class
 * @param {Config} cfg - The configuration object for the API client.
 * @property {Config} config - The internal configuration object for the API client.
 * @example
 * ```ts
 * const clientConfig = {
 *     url: 'http://<your-domain>/',
 *     apiKey: 'your-api-key'
 * };
 * const apiClient = new SyngrisiApi(clientConfig);
 * ```
 */
class SyngrisiApi {
    private config: Config

    constructor(cfg: ConstructorParam) {
        paramsGuard(cfg, 'SyngrisiApi, constructor, cfg', ConfigSchema)
        this.config = cfg
        this.config.apiHash = hasha(cfg.apiKey || '')
    }

    /**
     * Constructs the URL for the given item name by appending it to the API endpoint.
     * @param {string} itemName - The name of the API item to access.
     * @returns {string} The full URL for the API item.
     * @example
     * const url = apiClient.url('startSession');
     * // 'http://<your-domain>/v1/client/startSession'
     */
    private url(itemName: string) {
        return `${this.config.url}v1/client/${itemName}`
    }

    /**
     * Starts a new session with the Syngrisi service using provided parameters.
     * @param {ApiSessionParams} params - Parameters for starting a new session.
     * @returns {Promise<SessionResponse>} A promise that resolves with the session data or ErrorObject.
     * @example
     * const sessionParams = {
     *     run: 'run-id',
     *     suite: 'suite-name',
     *     runident: 'run-identifier',
     *     name: 'test-name',
     *     viewport: '1200x800',
     *     browser: 'chrome',
     *     browserVersion: '113',
     *     os: 'macOS',
     *     app: 'MyProject'
     * };
     * const response  apiClient.startSession(sessionParams)
     */
    public async startSession(params: ApiSessionParams): Promise<SessionResponse | ErrorObject> {
        paramsGuard(params, 'startSession, params', ApiSessionParamsSchema)

        const maxRetries = 3
        const retryDelayMs = 2000

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            const form = new FormData()
            const required = ['run', 'suite', 'runident', 'name', 'viewport', 'browser', 'browserVersion', 'os', 'app']
            // @ts-ignore
            required.forEach(param => form.append(param, params[param]))

            // optional
            if (params.tags) form.append('tags', JSON.stringify(params.tags))
            if (params.branch) form.append('branch', params.branch)

            try {
                const result = await got.post(this.url('startSession'), {
                    body: form,
                    headers: { apikey: this.config.apiHash },
                }).json() as SessionResponse
                return result
            } catch (e: any) {
                const is401 = e.response?.statusCode === 401
                const isLastAttempt = attempt === maxRetries

                if (is401 && !isLastAttempt) {
                    log.warn(`⚠️ 401 error on startSession, retrying in ${retryDelayMs}ms (attempt ${attempt}/${maxRetries})`)
                    await new Promise(resolve => setTimeout(resolve, retryDelayMs))
                    continue
                }

                log.error(`❌ Error posting start session data: '${e.stack || e}'`)
                if (e.response) printErrorResponseBody(e)
                return errorObject(e)
            }
        }

        // This should never be reached, but TypeScript needs it
        return errorObject(new Error('Max retries exceeded'))
    }

    /**
     * Stops the session associated with the given test ID.
     * @param {string} testId - The unique identifier of the test session to stop.
     * @returns {Promise<SessionResponse | ErrorObject>} A promise that resolves with the session data or ErrorObject.
     * @example
     * const result = await apiClient.stopSession('<test-id>')
     */
    public async stopSession(testId: string): Promise<SessionResponse | ErrorObject> {
        try {
            const form = new FormData()
            const response: SessionResponse = await got.post(`${this.url('stopSession')}/${testId}`, {
                body: form,
                headers: { apikey: this.config.apiHash },
            }).json()
            return response
        } catch (e: any) {
            log.error(`❌ Error posting stop session data for test: '${testId}', error: '${e.stack || e}'`)
            if (e.response) printErrorResponseBody(e)
            return errorObject(e)
        }
    }

    private addMessageIfCheckFailed(result: any) {
        const patchedResult = result
        // Skip if result is an error object or status is not a string
        if (patchedResult.error || typeof patchedResult.status !== 'string') {
            return patchedResult
        }
        if (patchedResult.status.includes('failed')) {
            const checkView = `'${this.config.url}?checkId=${patchedResult._id}&modalIsOpen=true'`
            patchedResult.message = `To evaluate the results of the check, follow the link: '${checkView}'`
            // basically the links is useless - backward compatibility
            patchedResult.vrsGroupLink = checkView
            patchedResult.vrsDiffLink = checkView
        }
        return patchedResult
    }

    /**
     * Performs a visual regression check by sending an image and associated parameters to the Syngrisi service.
     * If a baseline exists, it compares the image against the baseline; otherwise, it marks the image as new.
     *
     * @param {Buffer} imageBuffer - The image buffer of the screenshot for visual regression check.
     * @param {CheckParams} params - Parameters for the check which include identifiers like name, viewport, etc.
     * @returns {Promise<CheckResponse | ErrorObject>} A promise that resolves with the result of the check or ErrorObject.
     * @example
     * // Assume `imageBuffer` is a Buffer instance of a screenshot taken from the browser
     * // Syngrisi API client initialization with user provided configuration
     * const clientConfig = {
     *     url: 'http://<your-domain>/',
     *     apiKey: 'your-api-key'
     * };
     * const apiClient = new SyngrisiApi(clientConfig);
     *
     * // Starting a new test session before performing coreCheck
     * const startSessionParams = {
     *     run: 'run-id',
     *     suite: 'suite-name',
     *     runident: 'run-identifier',
     *     name: 'test-name',
     *     viewport: '1200x800',
     *     browser: 'chrome',
     *     browserVersion: '89.0',
     *     os: 'Windows',
     *     app: 'MyApp',
     *     branch: 'master'
     * };
     * const sessionResponse = await apiClient.startSession(startSessionParams);
     *
     * // Perform the coreCheck using testId from the start session response
     * const checkParams = {
     *     name: 'homepage', // name of the visual test
     *     viewport: '1200x800', // viewport size of the test
     *     browserName: 'chrome', // browser used for the test
     *     os: 'macOS', // operating system used for the test
     *     app: 'MyProject', // name of the application under test or project name
     *     branch: 'master', // the branch name in the version control
     *     testId: sessionResponse.testId, // testId returned by startSession
     *     suite: 'suite-name', // name of the suite this test belongs to
     *     browserVersion: '89', // version of the browser used
     *     browserFullVersion: '89.0.4389.82', // full version of the browser used
     *     hashCode: '<your-optional-hash-code>', // hashcode of image buffer (you can use hasha(`imageBuffer` for this)
     *                firstly the method try to send only hashcode without imageBuffer to speed up process
     *                if server response with `requiredFileData` status it send request with `imageBuffer` again
     * };
     * const checkResponse = await apiClient.coreCheck(imageBuffer, checkParams);
     *
     * // Once check is complete, stop the session using the testId from the start session response
     * await apiClient.stopSession(sessionResponse.testId);
     */
    public async coreCheck(imageBuffer: Buffer, params: CheckParams): Promise<CheckResponse | ErrorObject> {
        let resultWithHash = await this.performCheck(params, null, params.hashCode)
        resultWithHash = this.addMessageIfCheckFailed(resultWithHash)

        log.debug(`Check result Phase #1: ${prettyCheckResult(resultWithHash)}`)
        // @ts-ignore
        if (resultWithHash.status === 'requiredFileData') {
            let resultWithFile = await this.performCheck(params, imageBuffer, params.hashCode)
            log.debug(`Check result Phase #2: ${prettyCheckResult(resultWithFile)}`)
            resultWithFile = this.addMessageIfCheckFailed(resultWithFile)
            return resultWithFile
        }
        return resultWithHash
    }

    private async performCheck(params: CheckParams, imageBuffer: Buffer | null, hashCode: string | undefined): Promise<CheckResponse | ErrorObject> {
        paramsGuard(params, 'createCheck, params', CheckParamsSchema)

        const url = `${this.url('createCheck')}`
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

        const maxRetries = 3
        const retryDelayMs = 2000

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            const form = new FormData()

            Object.keys(fieldsMapping).forEach(key => {
                // @ts-ignore
                if (params[key]) {
                    // @ts-ignore
                    form.append(fieldsMapping[key], params[key])
                }
            })

            if (hashCode) form.append('hashcode', hashCode)
            if (imageBuffer) form.append('file', imageBuffer, 'file')

            try {
                const result: CheckResponse = await got.post(url, {
                    body: form,
                    headers: { apikey: this.config.apiHash },
                }).json()

                return result
            } catch (e: any) {
                const is401 = e.response?.statusCode === 401
                const isLastAttempt = attempt === maxRetries

                if (is401 && !isLastAttempt) {
                    log.warn(`⚠️ 401 error on createCheck, retrying in ${retryDelayMs}ms (attempt ${attempt}/${maxRetries})`)
                    await new Promise(resolve => setTimeout(resolve, retryDelayMs))
                    continue
                }

                log.error(`❌ Error posting create check data params: '${JSON.stringify(params)}', error: '${e.stack || e}'`)
                if (e.response) printErrorResponseBody(e)
                return errorObject(e)
            }
        }

        // This should never be reached, but TypeScript needs it
        return errorObject(new Error('Max retries exceeded'))
    }

    public async getIdent(): Promise<string[] | ErrorObject> {
        const url = `${this.url('getIdent')}?apikey=${this.config.apiHash}`
        try {
            const result: string[] = await got(url).json()
            return result
        } catch (e: any) {
            log.error(`❌ Error getting ident data, error: '${e.stack || e}'`)
            if (e.response) printErrorResponseBody(e)
            return errorObject(e)
        }
    }

    /**
     * Retrieves the baselines associated with given filter from the Syngrisi service.
     *
     * @param {BaselineParams} params - Parameters to find the baselines.
     * @returns {Promise<BaselineResponse | ErrorObject>} A promise that resolves with the baselines data or ErrorObject.
     * @example
     * const apiClient = new SyngrisiApi({
     *     url: 'http://<your-domain>/',
     *     apiKey: 'your-api-key'
     * });
     * const baselineParams = {
     *     name: 'test-name',
     *     app: 'MyApp',
     *     branch: 'main',
     *     // ... other optional baseline filters ...
     * };
     * const baselines = await apiClient.getBaselines(baselineParams);
     */
    public async getBaselines(params: BaselineParams): Promise<BaselineResponse | ErrorObject> {
        paramsGuard(params, 'getBaselines, params', BaselineParamsSchema)
        try {
            const filter = encodeURIComponent(JSON.stringify(params))

            const url = `${this.url('baselines')}?filter=${filter}&apikey=${this.config.apiHash}`
            const result: BaselineResponse = await got(url)
                .json()
            return result
        } catch (e: any) {
            log.error(`❌ Error getting baselines, params: '${JSON.stringify(params)}' data, error: '${e.stack || e}'`)
            if (e.response) printErrorResponseBody(e)
            return errorObject(e)
        }
    }

    /**
     * Fetches snapshots related to a specific test session from the Syngrisi service using provided parameters.
     *
     * @param {Snapshot} params - The parameters to query snapshots, including identifiers like testId, branch, etc.
     * @returns {Promise<SnapshotResponse | ErrorObject>} A promise that resolves with the fetched snapshots data or ErrorObject.
     * @example
     * const apiClient = new SyngrisiApi({
     *     url: 'http://<your-domain>/',
     *     apiKey: 'your-api-key'
     * });
     * const snapshotParams = {
     *     testId: 'your-test-id',
     *     // ... other identifiers ...
     * };
     * const snapshots = await apiClient.getSnapshots(snapshotParams);
     */

    public async getSnapshots(params: Snapshot): Promise<SnapshotResponse | ErrorObject> {
        try {
            paramsGuard(params, 'getSnapshots, params', SnapshotSchema)
            const filter = encodeURIComponent(JSON.stringify(params))

            const url = `${this.url('snapshots')}?filter=${filter}&apikey=${this.config.apiHash}`
            const result: SnapshotResponse = await got.get(url)
                .json()
            return result
        } catch (e: any) {
            log.error(`❌ Error getting snapshots, params: '${JSON.stringify(params)}' data, error: '${e.stack || e}'`)
            if (e.response) printErrorResponseBody(e)
            return errorObject(e)
        }
    }

    /**
     * Accepts a check by setting a new baseline for it.
     *
     * @param {string} checkId - The unique identifier of the check to accept.
     * @param {string} baselineId - The unique identifier of the baseline to set as the new accepted baseline.
     * @returns {Promise<CheckResponse | ErrorObject>} A promise that resolves with the updated check data or ErrorObject.
     * @example
     * const apiClient = new SyngrisiApi({
     *     url: 'http://<your-domain>/',
     *     apiKey: 'your-api-key'
     * });
     * const result = await apiClient.acceptCheck('check-id-123', 'baseline-id-456');
     */
    public async acceptCheck(checkId: string, baselineId: string): Promise<CheckResponse | ErrorObject> {
        try {
            if (!checkId) {
                throw new Error('checkId is required')
            }
            if (!baselineId) {
                throw new Error('baselineId is required')
            }

            const url = `${this.config.url}v1/checks/${checkId}/accept`
            const result: CheckResponse = await got.put(url, {
                json: { baselineId },
                headers: { apikey: this.config.apiHash },
            }).json()

            return result
        } catch (e: any) {
            log.error(`❌ Error accepting check, checkId: '${checkId}', baselineId: '${baselineId}', error: '${e.stack || e}'`)
            if (e.response) printErrorResponseBody(e)
            return errorObject(e)
        }
    }
}

export { SyngrisiApi }
export { transformOs } from './utils'
export * from '../schemas/SyngrisiApi.schema'
