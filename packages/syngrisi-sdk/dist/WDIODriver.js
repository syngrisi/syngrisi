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
const api_1 = require("./lib/api");
const wdioHelpers_1 = require("./lib/wdioHelpers");
const log = (0, logger_1.default)('syngrisi-wdio-sdk');
class WDIODriver {
    constructor(cfg) {
        this.api = new api_1.SyngrisiApi(cfg);
        this.params = {
            test: {}
        };
    }
    async startTestSession(params, apikey) {
        try {
            WDIODriver.sessionParamsGuard(params);
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
            const respJson = await this.api.startSession(this.params.test, apikey);
            if (!respJson) {
                throw new Error(`response is empty, params: ${JSON.stringify(params, null, '\t')}`);
            }
            this.params.test.testId = respJson._id;
            return respJson;
        }
        catch (e) {
            const eMsg = `Cannot start session, error: '${e}' \n '${e.stack}'`;
            log.error(eMsg);
            throw new Error(eMsg);
        }
    }
    async stopTestSession(apikey) {
        const result = await this.api.stopSession(this.params.test.testId, apikey);
        log.info(`Session with testId: '${result._id}' was stopped`);
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
    async checkIfBaselineExist(name, imageBuffer, apikey, params) {
        const imgHash = (0, hasha_1.default)(imageBuffer);
        // this.params.ident = await this.api.getIdent(apikey)
        let opts = {
            name: name,
            viewport: params.viewport || await (0, wdioHelpers_1.getViewport)(),
            browserName: this.params.browser || await (0, wdioHelpers_1.getBrowserVersion)(),
            os: this.params.os || await (0, wdioHelpers_1.getOS)(),
            app: this.params.app,
            branch: this.params.branch,
            imghash: imgHash,
        };
        return this.api.checkIfBaselineExist(opts, apikey);
    }
    async check(checkName, imageBuffer, apikey, params, domDump) {
        if (this.params.test.testId === undefined) {
            throw new Error('The test id is empty, the session may not have started yet:'
                + `check name: '${checkName}', driver: '${JSON.stringify(this, null, '\t')}'`);
        }
        let opts = null;
        try {
            // ident:  ['name', 'viewport', 'browserName', 'os', 'app', 'branch'];
            opts = {
                testId: this.params.test.testId,
                suite: this.params.test.suite,
                name: checkName,
                viewport: params?.viewport || await (0, wdioHelpers_1.getViewport)(),
                hashCode: (0, hasha_1.default)(imageBuffer),
                domDump: domDump,
                browserName: this.params.test.browser,
                browserVersion: this.params.test.browserVersion,
                browserFullVersion: this.params.test.browserFullVersion,
                os: this.params.test.os,
                app: this.params.test.app,
                branch: this.params.test.branch,
            };
            Object.assign(opts, params);
            return this.api.coreCheck(imageBuffer, opts, apikey);
        }
        catch (e) {
            log.error(`cannot create check, params: '${JSON.stringify(params)}' opts: '${JSON.stringify(opts)}, error: '${e.stack || e.toString()}'`);
            throw e;
        }
    }
}
WDIODriver.sessionParamsGuard = (params) => {
    const requiredParams = ['run', 'runident', 'test', 'branch', 'app'];
    for (const param of requiredParams) {
        if (!params[param]) {
            throw new Error(`error startTestSession: Mandatory parameter '${param}' is missing. Params: '${JSON.stringify(params)}'`);
        }
    }
};
exports.SyngrisiDriver = WDIODriver;
