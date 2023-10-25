"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prettyCheckResult = exports.printErrorResponseBody = void 0;
const logger_1 = __importDefault(require("@wdio/logger"));
const log = (0, logger_1.default)('wdio-syngrisi-cucumber-service');
const printErrorResponseBody = (e) => {
    if (e.response && e.response?.body) {
        log.error(`ERROR RESPONSE BODY: ${e.response?.body}`);
    }
};
exports.printErrorResponseBody = printErrorResponseBody;
const prettyCheckResult = (result) => {
    if (!result.domDump) {
        return JSON.stringify(result);
    }
    const dump = JSON.parse(result.domDump);
    const resObs = { ...result };
    delete resObs.domDump;
    resObs.domDump = `${JSON.stringify(dump)
        .substr(0, 20)}... and about ${dump.length} items]`;
    return JSON.stringify(resObs);
};
exports.prettyCheckResult = prettyCheckResult;
