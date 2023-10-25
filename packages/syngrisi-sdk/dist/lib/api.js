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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyngrisiApi = void 0;
var form_data_1 = __importDefault(require("form-data"));
var got_cjs_1 = __importDefault(require("got-cjs"));
var hasha_1 = __importDefault(require("hasha"));
var logger_1 = __importDefault(require("@wdio/logger"));
var utils_1 = require("./utils");
var log = (0, logger_1.default)('syngrisi-wdio-sdk');
var SyngrisiApi = /** @class */ (function () {
    function SyngrisiApi(cfg) {
        this.config = cfg;
    }
    SyngrisiApi.prototype.objectToSearch = function (obj) {
        var str = [];
        for (var p in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, p)) {
                str.push("".concat(encodeURIComponent(p), "=").concat(encodeURIComponent(obj[p])));
            }
        }
        return str.join('&');
    };
    SyngrisiApi.prototype.startSession = function (params, apikey) {
        return __awaiter(this, void 0, void 0, function () {
            var apiHash, form, response, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        apiHash = (0, hasha_1.default)(apikey);
                        form = new form_data_1.default();
                        form.append('run', params.run);
                        form.append('suite', params.suite);
                        form.append('runident', params.runident);
                        if (params.tags)
                            form.append('tags', JSON.stringify(params.tags));
                        if (params.branch)
                            form.append('branch', params.branch);
                        form.append('name', params.name);
                        form.append('status', params.status);
                        form.append('viewport', params.viewport);
                        form.append('browser', params.browserName);
                        form.append('browserVersion', params.browserVersion);
                        form.append('os', params.os);
                        form.append('app', params.app);
                        return [4 /*yield*/, got_cjs_1.default.post("".concat(this.config.url, "v1/client/startSession"), {
                                body: form,
                                headers: { apikey: apiHash },
                            }).json()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 2:
                        e_1 = _a.sent();
                        log.info("Cannot createTest with params: '".concat(JSON.stringify(params), "', error: '").concat(e_1, "'"));
                        (0, utils_1.printErrorResponseBody)(e_1);
                        throw new Error(e_1 + e_1.stack);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SyngrisiApi.prototype.stopSession = function (testId, apikey) {
        return __awaiter(this, void 0, void 0, function () {
            var apiHash, form, response, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        apiHash = (0, hasha_1.default)(apikey);
                        form = new form_data_1.default();
                        return [4 /*yield*/, got_cjs_1.default.post("".concat(this.config.url, "v1/client/stopSession/").concat(testId), {
                                body: form,
                                headers: { apikey: apiHash },
                            }).json()];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 2:
                        e_2 = _a.sent();
                        throw new Error("Cannot stop the test session with id: '".concat(testId, "', error: '").concat(e_2, "'"));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SyngrisiApi.prototype.createCheck = function (params, imageBuffer, hashCode, apikey) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var apiHash, url, form, result, e_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        apiHash = (0, hasha_1.default)(apikey);
                        url = "".concat(this.config.url, "v1/client/createCheck");
                        form = new form_data_1.default();
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        if (params.branch)
                            form.append('branch', params.branch);
                        if (params.app)
                            form.append('appName', params.app);
                        if (params.suite)
                            form.append('suitename', params.suite);
                        if (params.domDump)
                            form.append('domdump', params.domDump || '');
                        if (hashCode)
                            form.append('hashcode', hashCode);
                        if (imageBuffer)
                            form.append('file', imageBuffer, 'file');
                        if (params.vShifting)
                            form.append('vShifting', params.vShifting);
                        form.append('testid', params.testId);
                        form.append('name', params.name);
                        form.append('viewport', params.viewport);
                        form.append('browserName', params.browserName);
                        form.append('browserVersion', params.browserVersion);
                        form.append('browserFullVersion', params.browserFullVersion);
                        form.append('os', params.os);
                        return [4 /*yield*/, got_cjs_1.default.post(url, {
                                body: form,
                                headers: { apikey: apiHash },
                            }).json()];
                    case 2:
                        result = _b.sent();
                        return [2 /*return*/, result];
                    case 3:
                        e_3 = _b.sent();
                        (0, utils_1.printErrorResponseBody)(e_3);
                        throw new Error("fait to post data, response body: ".concat((_a = e_3.response) === null || _a === void 0 ? void 0 : _a.body, " \n '").concat(e_3.stack || e_3, "'"));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SyngrisiApi.prototype.getIdent = function (apiKey) {
        return __awaiter(this, void 0, void 0, function () {
            var url, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = "".concat(this.config.url, "v1/client/getIdent?apikey=").concat((0, hasha_1.default)(apiKey));
                        return [4 /*yield*/, got_cjs_1.default.get(url).json()];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    SyngrisiApi.prototype.checkIfBaselineExist = function (params, apikey) {
        return __awaiter(this, void 0, void 0, function () {
            var searchString, url, result;
            return __generator(this, function (_a) {
                try {
                    searchString = this.objectToSearch(__assign(__assign({}, params), { apikey: (0, hasha_1.default)(apikey) }));
                    url = "".concat(this.config.url, "v1/client/checkIfScreenshotHasBaselines?").concat(searchString);
                    result = got_cjs_1.default.get(url, { throwHttpErrors: false })
                        .json();
                    return [2 /*return*/, result];
                }
                catch (e) {
                    throw new Error(e + e.stack);
                }
                return [2 /*return*/];
            });
        });
    };
    return SyngrisiApi;
}());
exports.SyngrisiApi = SyngrisiApi;
