"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBrowserVersion = exports.getBrowserFullVersion = exports.isIos = exports.isAndroid = exports.getBrowserName = exports.getOS = exports.getViewport = void 0;
const logger_1 = __importDefault(require("@wdio/logger"));
const log = (0, logger_1.default)('syngrisi-wdio-sdk');
// @ts-ignore
const core_api_1 = require("@syngrisi/core-api");
const getViewport = async () => {
    if ((0, exports.isAndroid)()) {
        // @ts-ignore
        return browser.capabilities.deviceScreenSize;
    }
    const viewport = await browser.getWindowSize();
    if (viewport && viewport.width && viewport.height) {
        return `${viewport.width}x${viewport.height}`;
    }
    return '0x0';
};
exports.getViewport = getViewport;
const getOS = async () => {
    let platform;
    if ((0, exports.isAndroid)() || (0, exports.isIos)()) {
        // @ts-ignore
        platform = browser.options?.capabilities['bstack:options']?.deviceName
            // @ts-ignore
            || browser.options?.capabilities['appium:deviceName']
            // @ts-ignore
            || browser.options?.capabilities?.deviceName;
        if (!platform) {
            throw new Error(`Cannot get the platform of your device: ${JSON.stringify(browser.options?.capabilities)}`);
        }
    }
    else {
        let navPlatform;
        for (let x = 0; x < 5; x++) {
            try {
                navPlatform = await browser.execute(() => navigator.platform);
                if (navPlatform)
                    break;
            }
            catch (e) {
                log.error(`Error - cannot get the platform #${x}: '${e}'`);
                await browser.pause(500);
                navPlatform = await browser.execute(() => navigator.platform);
            }
        }
        // @ts-ignore
        platform = browser.capabilities.platform || navPlatform;
    }
    if (process.env.ENV_POSTFIX) {
        return `${platform}_${process.env.ENV_POSTFIX}`;
    }
    return (0, core_api_1.transformOs)(platform);
};
exports.getOS = getOS;
const getBrowserName = () => {
    // @ts-ignore
    let { browserName } = browser.capabilities;
    // @ts-ignore
    const chromeOpts = browser.options.capabilities['goog:chromeOptions'];
    if (chromeOpts && chromeOpts.args && chromeOpts.args.includes('--headless')) {
        browserName += ' [HEADLESS]';
    }
    return browserName;
};
exports.getBrowserName = getBrowserName;
const isAndroid = () => {
    return (browser.isAndroid
        // @ts-ignore
        || (browser.options.capabilities.browserName === 'Android')
        // @ts-ignore
        || (browser.options.capabilities.platformName === 'Android'));
};
exports.isAndroid = isAndroid;
const isIos = () => {
    return browser.isIOS
        // @ts-ignore
        || (browser.execute(() => navigator.platform) === 'iPhone')
        // @ts-ignore
        || (browser.options.capabilities?.platformName?.toLowerCase() === 'ios')
        // @ts-ignore
        || (browser.options.capabilities?.browserName === 'iPhone')
        || false;
};
exports.isIos = isIos;
const getBrowserFullVersion = () => {
    let version;
    if ((0, exports.isAndroid)() || (0, exports.isIos)()) {
        // @ts-ignore
        version = browser.options?.capabilities['bstack:options']?.osVersion
            // @ts-ignore
            || browser.capabilities?.version
            // @ts-ignore
            || browser.options?.capabilities.platformVersion;
    }
    else {
        // @ts-ignore
        version = browser.capabilities?.browserVersion || browser.capabilities?.version;
    }
    if (!version) {
        // eslint-disable-next-line max-len
        throw new Error('Cannot get Browser Version, try to check "capabilities.version", "capabilities.platformVersion" or "capabilities.browserVersion"');
    }
    return version;
};
exports.getBrowserFullVersion = getBrowserFullVersion;
const getBrowserVersion = () => {
    const fullVersion = (0, exports.getBrowserFullVersion)();
    if (!fullVersion.includes('.')) {
        return fullVersion;
    }
    return fullVersion.split('.')[0];
};
exports.getBrowserVersion = getBrowserVersion;
