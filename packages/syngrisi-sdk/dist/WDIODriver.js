"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDomDump = void 0;
const hasha_1 = __importDefault(require("hasha"));
const logger_1 = __importDefault(require("@wdio/logger"));
const getDomDump_1 = require("./lib/getDomDump");
Object.defineProperty(exports, "getDomDump", { enumerable: true, get: function () { return getDomDump_1.getDomDump; } });
// @ts-ignore
const core_api_1 = require("@syngrisi/core-api");
const Baseline_schema_1 = require("./schemas/Baseline.schema");
const Check_schema_1 = require("./schemas/Check.schema");
const SessionParams_schema_1 = require("./schemas/SessionParams.schema");
const wdioHelpers_1 = require("./lib/wdioHelpers");
const paramsGuard_1 = require("./schemas/paramsGuard");
const log = (0, logger_1.default)('syngrisi-wdio-sdk');
class WDIODriver {
    constructor(cfg) {
        this.api = new core_api_1.SyngrisiApi(cfg);
        this.params = {
            test: {}
        };
    }
    async startTestSession({ params, suppressErrors = false }) {
        try {
            (0, paramsGuard_1.paramsGuard)(params, 'startTestSession, params', SessionParams_schema_1.SessionParamsSchema);
            if (params.suite) {
                this.params.suite = params.suite || 'Unknown';
            }
            this.params.test = {
                os: params.os || await (0, wdioHelpers_1.getOS)(),
                viewport: params.viewport || await (0, wdioHelpers_1.getViewport)(),
                browser: params.browserName || await (0, wdioHelpers_1.getBrowserName)(),
                browserVersion: params.browserVersion || await (0, wdioHelpers_1.getBrowserVersion)(),
                name: params.test,
                app: params.app,
                run: params.run,
                branch: params.branch,
                runident: params.runident,
                suite: params.suite,
                tags: params.tags,
                browserFullVersion: params.browserFullVersion || await (0, wdioHelpers_1.getBrowserFullVersion)()
            };
            const result = await this.api.startSession(this.params.test);
            if (result.error && !suppressErrors) {
                throw `❌ Start Test Session Error: ${JSON.stringify(result, null, '  ')}`;
            }
            if (!result) {
                throw new Error(`response is empty, params: ${JSON.stringify(params, null, '\t')}`);
            }
            this.params.test.testId = result._id;
            return result;
        }
        catch (e) {
            const eMsg = `Cannot start session, error: '${e}' \n '${e.stack}'`;
            log.error(eMsg);
            throw new Error(eMsg);
        }
    }
    async stopTestSession({ suppressErrors = false } = {}) {
        try {
            const testId = this.params.test.testId;
            this.params.test.testId = undefined;
            const result = await this.api.stopSession(testId);
            if (result.error && !suppressErrors) {
                throw `❌ Start Test Session Error: ${JSON.stringify(result, null, '  ')}`;
            }
            log.debug(`Session with testId: '${result._id}' was stopped`);
            return result;
        }
        catch (e) {
            const eMsg = `Cannot stop session, error: '${e}' \n '${e.stack}'`;
            log.error(eMsg);
            throw e;
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
    // // ident:  ['name', 'viewport', 'browserName', 'os', 'app', 'branch'];
    // async checkIfBaselineExist({ params, imageBuffer, suppressErrors = false }
    //                                : {
    //     name: string,
    //     imageBuffer: Buffer,
    //     params: BaselineParams,
    //     suppressErrors?: boolean
    // }) {
    //     if (!Buffer.isBuffer(imageBuffer)) throw new Error('checkIfBaselineExist - wrong imageBuffer')
    //     paramsGuard(params, 'checkIfBaselineExist, params', BaselineParamsSchema)
    //     const imgHash = hasha(imageBuffer)
    //
    //     let opts: RequiredIdentOptions = {
    //         name: params.name,
    //         viewport: params.viewport || await getViewport(),
    //         browserName: params.browserName || this.params.test.browser || await getBrowserVersion(),
    //         os: params.os || this.params.test.os || await getOS(),
    //         app: params.app || this.params.test.app,
    //         branch: params.branch || this.params.test.branch,
    //         imghash: imgHash,
    //     }
    //
    //     paramsGuard(opts, 'checkIfBaselineExist, opts', RequiredIdentOptionsSchema)
    //
    //     const result = await this.api.checkIfBaselineExist(opts)
    //
    //     if (result.error && !suppressErrors) {
    //         throw `❌ Check If Baseline With certain snapshot hashcode error: ${JSON.stringify(result, null, '  ')}`
    //     }
    //     return result
    // }
    // ident:  ['name', 'viewport', 'browserName', 'os', 'app', 'branch'];
    async getBaselines({ params }) {
        let opts = {
            name: params.name,
            viewport: params.viewport || await (0, wdioHelpers_1.getViewport)(),
            browserName: params.browserName || this.params.test.browser || await (0, wdioHelpers_1.getBrowserVersion)(),
            os: params.os || this.params.test.os || await (0, wdioHelpers_1.getOS)(),
            app: params.app || this.params.test.app,
            branch: params.branch || this.params.test.branch,
        };
        (0, paramsGuard_1.paramsGuard)(opts, 'getBaseline, opts', Baseline_schema_1.BaselineParamsSchema);
        const result = await this.api.getBaselines(opts);
        if (result.error) {
            throw `❌ Get baselines error: ${JSON.stringify(result, null, '  ')}`;
        }
        return result;
    }
    async getSnapshots({ params }) {
        const result = await this.api.getSnapshots(params);
        if (result.error) {
            throw `❌ Get snapshots error: ${JSON.stringify(result, null, '  ')}`;
        }
        return result;
    }
    async check({ checkName, imageBuffer, params, domDump, suppressErrors = false }) {
        if (this.params.test.testId === undefined) {
            throw new Error('The test id is empty, the session may not have started yet:'
                + `check name: '${checkName}', driver: '${JSON.stringify(this, null, '\t')}'`);
        }
        if (!Buffer.isBuffer(imageBuffer))
            throw new Error('check - wrong imageBuffer');
        let opts = null;
        try {
            opts = {
                // ident:  ['name', 'viewport', 'browserName', 'os', 'app', 'branch'];
                name: checkName,
                viewport: params?.viewport || await (0, wdioHelpers_1.getViewport)(),
                browserName: this.params.test.browser,
                os: this.params.test.os,
                app: this.params.test.app,
                branch: this.params.test.branch,
                // ['name', 'viewport', 'browserName', 'os', 'app', 'branch', 'testId', 'suite', 'browserVersion', 'browserFullVersion' ];
                testId: this.params.test.testId,
                suite: this.params.test.suite,
                browserVersion: this.params.test.browserVersion,
                browserFullVersion: this.params.test.browserFullVersion,
                hashCode: (0, hasha_1.default)(imageBuffer),
                domDump: domDump,
            };
            (0, paramsGuard_1.paramsGuard)(opts, 'check, opts', Check_schema_1.CheckOptionsSchema);
            Object.assign(opts, params);
            const result = this.api.coreCheck(imageBuffer, opts);
            if (result.error && !suppressErrors) {
                throw `❌ Create Check error: ${JSON.stringify(result, null, '  ')}`;
            }
            return result;
        }
        catch (e) {
            log.error(`cannot create check, params: '${JSON.stringify(params)}' opts: '${JSON.stringify(opts)}, error: '${e.stack || e.toString()}'`);
            throw e;
        }
    }
}
exports.SyngrisiDriver = WDIODriver;
