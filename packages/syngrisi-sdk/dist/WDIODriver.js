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
exports.getDomDump = void 0;
var hasha_1 = __importDefault(require("hasha"));
var logger_1 = __importDefault(require("@wdio/logger"));
var getDomDump_1 = require("./lib/getDomDump");
Object.defineProperty(exports, "getDomDump", { enumerable: true, get: function () { return getDomDump_1.getDomDump; } });
var utils_1 = require("./lib/utils");
var api_1 = require("./lib/api");
var wdioHelpers_1 = require("./lib/wdioHelpers");
var log = (0, logger_1.default)('syngrisi-wdio-sdk');
var WDIODriver = /** @class */ (function () {
    function WDIODriver(cfg) {
        this.api = new api_1.SyngrisiApi(cfg);
        this.config = cfg;
        this.params = {};
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
    WDIODriver.prototype.startTestSession = function (params, apikey) {
        return __awaiter(this, void 0, void 0, function () {
            var $this, _a, os, _b, viewport, _c, browserName, _d, browserVersion, _e, browserFullVersion, _f, testName, respJson, e_1;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        $this = this;
                        _g.label = 1;
                    case 1:
                        _g.trys.push([1, 14, , 15]);
                        if (!params.run || !params.runident || !params.test || !params.branch || !params.app) {
                            throw new Error("error startTestSession one of mandatory parameters aren't present (run, runident, branch, app  or test), params: '".concat(JSON.stringify(params), "'"));
                        }
                        _a = $this.params;
                        return [4 /*yield*/, $this.api.getIdent(apikey)];
                    case 2:
                        _a.ident = _g.sent();
                        if (params.suite) {
                            $this.params.suite = params.suite || 'Unknown';
                        }
                        _b = params.os;
                        if (_b) return [3 /*break*/, 4];
                        return [4 /*yield*/, (0, wdioHelpers_1.getOS)()];
                    case 3:
                        _b = (_g.sent());
                        _g.label = 4;
                    case 4:
                        os = _b;
                        _c = params.viewport;
                        if (_c) return [3 /*break*/, 6];
                        return [4 /*yield*/, (0, wdioHelpers_1.getViewport)()];
                    case 5:
                        _c = (_g.sent());
                        _g.label = 6;
                    case 6:
                        viewport = _c;
                        _d = params.browserName;
                        if (_d) return [3 /*break*/, 8];
                        return [4 /*yield*/, (0, wdioHelpers_1.getBrowserName)()];
                    case 7:
                        _d = (_g.sent());
                        _g.label = 8;
                    case 8:
                        browserName = _d;
                        _e = params.browserVersion;
                        if (_e) return [3 /*break*/, 10];
                        return [4 /*yield*/, (0, wdioHelpers_1.getBrowserVersion)()];
                    case 9:
                        _e = (_g.sent());
                        _g.label = 10;
                    case 10:
                        browserVersion = _e;
                        _f = params.browserFullVersion;
                        if (_f) return [3 /*break*/, 12];
                        return [4 /*yield*/, (0, wdioHelpers_1.getBrowserFullVersion)()];
                    case 11:
                        _f = (_g.sent());
                        _g.label = 12;
                    case 12:
                        browserFullVersion = _f;
                        testName = params.test;
                        Object.assign($this.params, {
                            os: os,
                            viewport: viewport,
                            browserName: browserName,
                            browserVersion: browserVersion,
                            browserFullVersion: browserFullVersion,
                            app: params.app,
                            test: testName,
                            branch: params.branch,
                        });
                        return [4 /*yield*/, $this.api.startSession({
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
                            }, apikey)];
                    case 13:
                        respJson = _g.sent();
                        if (!respJson) {
                            throw new Error("response is empty, params: ".concat(JSON.stringify(params, null, '\t')));
                        }
                        $this.params.testId = respJson._id;
                        return [2 /*return*/, respJson];
                    case 14:
                        e_1 = _g.sent();
                        log.error("Cannot start session, error: '".concat(e_1, "' \n '").concat(e_1.stack || '', "'"));
                        throw new Error("Cannot start session, error: '".concat(e_1, "' \n '").concat(e_1.stack || '', "'"));
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    WDIODriver.prototype.stopTestSession = function (apikey) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.api.stopSession(this.params.testId, apikey)];
                    case 1:
                        result = _a.sent();
                        log.info("Session with testId: '".concat(result._id, "' was stopped"));
                        return [2 /*return*/];
                }
            });
        });
    };
    WDIODriver.prototype.addMessageIfCheckFailed = function (result) {
        var $this = this;
        var patchedResult = result;
        if (patchedResult.status.includes('failed')) {
            var checkView = "'".concat($this.config.url, "?checkId=").concat(patchedResult._id, "&modalIsOpen=true'");
            patchedResult.message = "To evaluate the results of the check, follow the link: '".concat(checkView, "'");
            // basically the links is useless - backward compatibility
            patchedResult.vrsGroupLink = checkView;
            patchedResult.vrsDiffLink = checkView;
        }
        return patchedResult;
    };
    WDIODriver.prototype.identArgsGuard = function (params) {
        this.params.ident.forEach(function (item) {
            if (!params[item]) {
                throw new Error("Wrong parameters for ident, the '".concat(item, "' property is empty"));
            }
        });
    };
    WDIODriver.prototype.removeNonIdentProperties = function (params) {
        var opts = __assign({}, params);
        for (var _i = 0, _a = Object.keys(opts); _i < _a.length; _i++) {
            var prop = _a[_i];
            if (!(prop in this.params.ident))
                delete opts[prop];
        }
        return opts;
    };
    /**
     * Check if the baseline exist with specific ident and specific hashcode
     * @param {Buffer} imageBuffer  image buffer
     * @param {string} name         name of check
     * @param {Object} params       object that must be related to ident array
     * @param {string} apikey       apikey
     * @returns {Promise<Object>}
     */
    // ident:  ['name', 'viewport', 'browserName', 'os', 'app', 'branch'];
    WDIODriver.prototype.checkIfBaselineExist = function (name, imageBuffer, apikey, params) {
        return __awaiter(this, void 0, void 0, function () {
            var $this, imgHash, opts, _a, _b, _c;
            var _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        $this = this;
                        imgHash = (0, hasha_1.default)(imageBuffer);
                        _d = {
                            name: name
                        };
                        _a = params.viewport;
                        if (_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, wdioHelpers_1.getViewport)()];
                    case 1:
                        _a = (_e.sent());
                        _e.label = 2;
                    case 2:
                        _d.viewport = _a;
                        _b = $this.params.browserName;
                        if (_b) return [3 /*break*/, 4];
                        return [4 /*yield*/, (0, wdioHelpers_1.getBrowserVersion)()];
                    case 3:
                        _b = (_e.sent());
                        _e.label = 4;
                    case 4:
                        _d.browserName = _b;
                        _c = $this.params.os;
                        if (_c) return [3 /*break*/, 6];
                        return [4 /*yield*/, (0, wdioHelpers_1.getOS)()];
                    case 5:
                        _c = (_e.sent());
                        _e.label = 6;
                    case 6:
                        opts = (_d.os = _c,
                            _d.app = $this.params.app,
                            _d.branch = $this.params.branch,
                            _d.imghash = imgHash,
                            _d);
                        this.identArgsGuard(opts);
                        Object.assign(opts, this.removeNonIdentProperties(params));
                        return [2 /*return*/, $this.api.checkIfBaselineExist(opts, apikey)];
                }
            });
        });
    };
    WDIODriver.prototype.check = function (checkName, imageBuffer, apikey, params, domDump) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return __awaiter(this, void 0, void 0, function () {
            var $this, opts, _j, _k, _l, _m, _o, e_2;
            var _p;
            return __generator(this, function (_q) {
                switch (_q.label) {
                    case 0:
                        $this = this;
                        if ($this.params.testId === undefined) {
                            throw new Error('The test id is empty, the session may not have started yet:'
                                + "check name: '".concat(checkName, "', driver: '").concat(JSON.stringify($this, null, '\t'), "'"));
                        }
                        opts = {};
                        _q.label = 1;
                    case 1:
                        _q.trys.push([1, 12, , 13]);
                        _p = {
                            testId: (_a = $this.params) === null || _a === void 0 ? void 0 : _a.testId,
                            suite: (_b = $this.params) === null || _b === void 0 ? void 0 : _b.suite,
                            name: checkName
                        };
                        _j = (params === null || params === void 0 ? void 0 : params.viewport);
                        if (_j) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, wdioHelpers_1.getViewport)()];
                    case 2:
                        _j = (_q.sent());
                        _q.label = 3;
                    case 3:
                        _p.viewport = _j;
                        _k = ((_c = $this.params) === null || _c === void 0 ? void 0 : _c.browserName);
                        if (_k) return [3 /*break*/, 5];
                        return [4 /*yield*/, (0, wdioHelpers_1.getBrowserVersion)()];
                    case 4:
                        _k = (_q.sent());
                        _q.label = 5;
                    case 5:
                        _p.browserName = _k;
                        _l = ((_d = $this.params) === null || _d === void 0 ? void 0 : _d.browserVersion);
                        if (_l) return [3 /*break*/, 7];
                        return [4 /*yield*/, (0, wdioHelpers_1.getBrowserVersion)()];
                    case 6:
                        _l = (_q.sent());
                        _q.label = 7;
                    case 7:
                        _p.browserVersion = _l;
                        _m = ((_e = $this.params) === null || _e === void 0 ? void 0 : _e.browserFullVersion);
                        if (_m) return [3 /*break*/, 9];
                        return [4 /*yield*/, (0, wdioHelpers_1.getBrowserFullVersion)()];
                    case 8:
                        _m = (_q.sent());
                        _q.label = 9;
                    case 9:
                        _p.browserFullVersion = _m;
                        _o = ((_f = $this.params) === null || _f === void 0 ? void 0 : _f.os);
                        if (_o) return [3 /*break*/, 11];
                        return [4 /*yield*/, (0, wdioHelpers_1.getOS)()];
                    case 10:
                        _o = (_q.sent());
                        _q.label = 11;
                    case 11:
                        // ident:  ['name', 'viewport', 'browserName', 'os', 'app', 'branch'];
                        opts = (_p.os = _o,
                            _p.app = (_g = $this.params) === null || _g === void 0 ? void 0 : _g.app,
                            _p.branch = (_h = $this.params) === null || _h === void 0 ? void 0 : _h.branch,
                            _p.hashCode = (0, hasha_1.default)(imageBuffer),
                            _p.domDump = domDump,
                            _p);
                        Object.assign(opts, params);
                        return [2 /*return*/, $this.coreCheck(imageBuffer, opts, apikey)];
                    case 12:
                        e_2 = _q.sent();
                        throw new Error("cannot create check, parameters: '".concat(JSON.stringify(opts), ", error: '").concat(e_2.stack || e_2, "'"));
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    WDIODriver.prototype.coreCheck = function (imageBuffer, params, apikey) {
        return __awaiter(this, void 0, void 0, function () {
            var $this, resultWithHash, resultWithFile;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        $this = this;
                        return [4 /*yield*/, $this.api.createCheck(params, null, params.hashCode, apikey)];
                    case 1:
                        resultWithHash = _a.sent();
                        resultWithHash = $this.addMessageIfCheckFailed(resultWithHash);
                        log.info("Check result Phase #1: ".concat((0, utils_1.prettyCheckResult)(resultWithHash)));
                        if (!(resultWithHash.status === 'requiredFileData')) return [3 /*break*/, 3];
                        return [4 /*yield*/, $this.api.createCheck(params, imageBuffer, params.hashCode, apikey)];
                    case 2:
                        resultWithFile = _a.sent();
                        log.info("Check result Phase #2: ".concat((0, utils_1.prettyCheckResult)(resultWithFile)));
                        resultWithFile = $this.addMessageIfCheckFailed(resultWithFile);
                        return [2 /*return*/, resultWithFile];
                    case 3: return [2 /*return*/, resultWithHash];
                }
            });
        });
    };
    return WDIODriver;
}());
exports.SyngrisiDriver = WDIODriver;
