"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prettyCheckResult = exports.printErrorResponseBody = void 0;
var logger_1 = __importDefault(require("@wdio/logger"));
var log = (0, logger_1.default)('wdio-syngrisi-cucumber-service');
var printErrorResponseBody = function (e) {
    if (e.response && e.response.body) {
        log.error("ERROR RESPONSE BODY: ".concat(e.response.body));
    }
};
exports.printErrorResponseBody = printErrorResponseBody;
var prettyCheckResult = function (result) {
    if (!result.domDump) {
        return JSON.stringify(result);
    }
    var dump = JSON.parse(result.domDump);
    var resObs = __assign({}, result);
    delete resObs.domDump;
    resObs.domDump = "".concat(JSON.stringify(dump)
        .substr(0, 20), "... and about ").concat(dump.length, " items]");
    return JSON.stringify(resObs);
};
exports.prettyCheckResult = prettyCheckResult;
