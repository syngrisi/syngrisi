"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyngrisiApi = void 0;
const form_data_1 = __importDefault(require("form-data"));
const got_cjs_1 = __importDefault(require("got-cjs"));
const hasha_1 = __importDefault(require("hasha"));
const logger_1 = __importDefault(require("@wdio/logger"));
const utils_1 = require("./utils");
const log = (0, logger_1.default)('syngrisi-wdio-sdk');
class SyngrisiApi {
    constructor(cfg) {
        this.config = cfg;
    }
    objectToSearch(obj) {
        const str = [];
        for (const p in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, p)) {
                str.push(`${encodeURIComponent(p)}=${encodeURIComponent(obj[p])}`);
            }
        }
        return str.join('&');
    }
    async startSession(params) {
        const apiHash = (0, hasha_1.default)(this.config.apiKey);
        const form = new form_data_1.default();
        const required = ['run', 'suite', 'runident', 'name', 'viewport', 'browser', 'browserVersion', 'os', 'app'];
        required.forEach(param => form.append(param, params[param]));
        // optional
        if (params.tags)
            form.append('tags', JSON.stringify(params.tags));
        if (params.branch)
            form.append('branch', params.branch);
        const response = await got_cjs_1.default.post(`${this.config.url}v1/client/startSession`, {
            body: form,
            headers: { apikey: apiHash },
        }).json();
        return response;
    }
    async stopSession(testId) {
        try {
            const apiHash = (0, hasha_1.default)(this.config.apiKey);
            const form = new form_data_1.default();
            const response = await got_cjs_1.default.post(`${this.config.url}v1/client/stopSession/${testId}`, {
                body: form,
                headers: { apikey: apiHash },
            }).json();
            return response;
        }
        catch (e) {
            throw new Error(`Cannot stop the test session with id: '${testId}', error: '${e}'`);
        }
    }
    addMessageIfCheckFailed(result) {
        const patchedResult = result;
        if (patchedResult.status.includes('failed')) {
            const checkView = `'${this.config.url}?checkId=${patchedResult._id}&modalIsOpen=true'`;
            patchedResult.message = `To evaluate the results of the check, follow the link: '${checkView}'`;
            // basically the links is useless - backward compatibility
            patchedResult.vrsGroupLink = checkView;
            patchedResult.vrsDiffLink = checkView;
        }
        return patchedResult;
    }
    async coreCheck(imageBuffer, params) {
        let resultWithHash = await this.createCheck(params, null, params.hashCode);
        resultWithHash = this.addMessageIfCheckFailed(resultWithHash);
        log.info(`Check result Phase #1: ${(0, utils_1.prettyCheckResult)(resultWithHash)}`);
        if (resultWithHash.status === 'requiredFileData') {
            let resultWithFile = await this.createCheck(params, imageBuffer, params.hashCode);
            log.info(`Check result Phase #2: ${(0, utils_1.prettyCheckResult)(resultWithFile)}`);
            resultWithFile = this.addMessageIfCheckFailed(resultWithFile);
            return resultWithFile;
        }
        return resultWithHash;
    }
    async createCheck(params, imageBuffer, hashCode) {
        const apiHash = (0, hasha_1.default)(this.config.apiKey);
        const url = `${this.config.url}v1/client/createCheck`;
        const form = new form_data_1.default();
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
        };
        try {
            Object.keys(fieldsMapping).forEach(key => {
                if (params[key]) { // @ts-ignore
                    form.append(fieldsMapping[key], params[key]);
                }
            });
            if (hashCode)
                form.append('hashcode', hashCode);
            if (imageBuffer)
                form.append('file', imageBuffer, 'file');
            const result = await got_cjs_1.default.post(url, {
                body: form,
                headers: { apikey: apiHash },
            }).json();
            return result;
        }
        catch (e) {
            log.error('❌ createCheck error create check vi API' + e.stack || e.toString());
            log.error('👉 Params:', params);
            if (e.response)
                (0, utils_1.printErrorResponseBody)(e);
            throw e;
        }
    }
    async getIdent(apiKey) {
        const url = `${this.config.url}v1/client/getIdent?apikey=${(0, hasha_1.default)(apiKey)}`;
        const result = await got_cjs_1.default.get(url).json();
        return result;
    }
    async checkIfBaselineExist(params) {
        try {
            const searchString = this.objectToSearch({
                ...params, ...{ apikey: (0, hasha_1.default)(this.config.apiKey) },
            });
            const url = `${this.config.url}v1/client/checkIfScreenshotHasBaselines?${searchString}`;
            // console.log({ url });
            const result = got_cjs_1.default.get(url, { throwHttpErrors: false })
                .json();
            return result;
        }
        catch (e) {
            throw new Error(e.toString() + e.stack);
        }
    }
}
exports.SyngrisiApi = SyngrisiApi;
