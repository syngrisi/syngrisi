/* eslint-disable object-shorthand,require-jsdoc,no-underscore-dangle,prefer-destructuring */
const hasha = require('hasha');
const { default: logger } = require('@wdio/logger');
const { getDomDump } = require('./lib/getDomDump');
const utils = require('./lib/utils');

const log = logger('syngrisi-wdio-sdk');
module.exports.getDomDump = getDomDump;

class SyngrisiDriver {
    constructor(cfg) {
        this.api = new (require('./lib/api').SyngrisiApi)(cfg);
        this.config = cfg;
        this.params = {};
    }

    static async getViewport() {
        if (SyngrisiDriver.isAndroid()) {
            return browser.capabilities.deviceScreenSize;
        }
        const viewport = await browser.getWindowSize();
        if (viewport && viewport.width && viewport.height) {
            return `${viewport.width}x${viewport.height}`;
        }
        return '0x0';
    }

    static transformOs(platform) {
        const lowercasePlatform = platform.toLowerCase();
        const transform = {
            win32: 'WINDOWS',
            windows: 'WINDOWS',
            macintel: 'macOS',
        };
        return transform[lowercasePlatform] || platform;
    }

    // not really os but more wide therm 'platform'
    static async getOS() {
        let platform;
        if (SyngrisiDriver.isAndroid() || SyngrisiDriver.isIos()) {
            platform = browser.options?.capabilities['bstack:options']?.deviceName
                || browser.options?.capabilities['appium:deviceName']
                || browser.options?.capabilities?.deviceName;
            if (!platform) {
                throw new Error(`Cannot get the platform of your device: ${JSON.stringify(browser.options?.capabilities)}`);
            }
        } else {
            let navPlatform;
            for (let x = 0; x < 5; x++) {
                try {
                    navPlatform = await browser.execute(() => navigator.platform);
                    if (navPlatform) break;
                } catch (e) {
                    log.error(`Error - cannot get the platform #${x}: '${e}'`);
                    await browser.pause(500);
                    navPlatform = await browser.execute(() => navigator.platform);
                }
            }

            platform = browser.capabilities.platform || navPlatform;
        }

        if (process.env.ENV_POSTFIX) {
            return `${platform}_${process.env.ENV_POSTFIX}`;
        }
        return SyngrisiDriver.transformOs(platform);
    }

    static getBrowserName() {
        let { browserName } = browser.capabilities;
        const chromeOpts = browser.options.capabilities['goog:chromeOptions'];
        if (chromeOpts && chromeOpts.args && chromeOpts.args.includes('--headless')) {
            browserName += ' [HEADLESS]';
        }
        return browserName;
    }

    static isAndroid() {
        return (
            browser.isAndroid
            || (browser.options.capabilities.browserName === 'Android')
            || (browser.options.capabilities.platformName === 'Android')
        );
    }

    static isIos() {
        return browser.isIOS
            || (browser.execute(() => navigator.platform) === 'iPhone')
            || (browser.options.capabilities?.platformName?.toLowerCase() === 'ios')
            || (browser.options.capabilities?.browserName === 'iPhone')
            || false;
    }

    static getBrowserFullVersion() {
        let version;
        if (SyngrisiDriver.isAndroid() || SyngrisiDriver.isIos()) {
            version = browser.options?.capabilities['bstack:options']?.osVersion
                || browser.capabilities?.version
                || browser.options?.capabilities.platformVersion;
        } else {
            version = browser.capabilities?.browserVersion || browser.capabilities?.version;
        }
        if (!version) {
            // eslint-disable-next-line max-len
            throw new Error('Cannot get Browser Version, try to check "capabilities.version", "capabilities.platformVersion" or "capabilities.browserVersion"');
        }
        return version;
    }

    // return major version of browser
    static getBrowserVersion() {
        const fullVersion = SyngrisiDriver.getBrowserFullVersion();
        if (!fullVersion.includes('.')) {
            return fullVersion;
        }
        return fullVersion.split('.')[0];
    }

    async startTestSession(params, apikey) {
        const $this = this;
        try {
            if (!params.run || !params.runident || !params.test || !params.branch || !params.app) {
                throw new Error(`error startTestSession one of mandatory parameters aren't present (run, runident, branch, app  or test), params: '${JSON.stringify(params)}'`);
            }

            $this.params.ident = await $this.api.getIdent(apikey);

            if (params.suite) {
                $this.params.suite = params.suite || 'Others';
            }

            const os = params.os || await SyngrisiDriver.getOS();
            const viewport = params.viewport || await SyngrisiDriver.getViewport();
            const browserName = params.browserName || await SyngrisiDriver.getBrowserName();
            const browserVersion = params.browserVersion || await SyngrisiDriver.getBrowserVersion();
            const browserFullVersion = params.browserFullVersion || await SyngrisiDriver.getBrowserFullVersion();
            const testName = params.test;

            Object.assign(
                $this.params,
                {
                    os: os,
                    viewport: viewport,
                    browserName: browserName,
                    browserVersion: browserVersion,
                    browserFullVersion: browserFullVersion,
                    app: params.app,
                    test: testName,
                    branch: params.branch,
                }
            );
            const respJson = await $this.api.startSession({
                name: testName,
                status: 'Running',
                viewport: viewport,
                browserName: browserName,
                browserVersion: browserVersion,
                os: os,
                app: params.app,
                run: params.run,
                suite: params.suite,
                runident: params.runident,
                tags: params.tags,
                branch: params.branch,
            }, apikey);
            if (!respJson) {
                throw new Error(`response is empty, params: ${JSON.stringify(params, null, '\t')}`);
            }

            $this.params.testId = respJson._id;

            return respJson;
        } catch (e) {
            log.error(`Cannot start session, error: '${e}' \n '${e.stack || ''}'`);
            throw new Error(`Cannot start session, error: '${e}' \n '${e.stack || ''}'`);
        }
    }

    async stopTestSession(apikey) {
        const result = await this.api.stopSession(this.params.testId, apikey);
        log.info(`Session with testId: '${result._id}' was stopped`);
    }

    addMessageIfCheckFailed(result) {
        const $this = this;
        const patchedResult = result;
        if (patchedResult.status.includes('failed')) {
            const checkView = `'${$this.config.url}?checkId=${patchedResult._id}&modalIsOpen=true'`;
            patchedResult.message = `To evaluate the results of the check, follow the link: '${checkView}'`;
            // basically the links is useless - backward compatibility
            patchedResult.vrsGroupLink = checkView;
            patchedResult.vrsDiffLink = checkView;
        }
        return patchedResult;
    }

    identArgsGuard(params) {
        this.params.ident.forEach((item) => {
            if (!params[item]) {
                throw new Error(`Wrong parameters for ident, the '${item}' property is empty`);
            }
        });
    }

    removeNonIdentProperties(params) {
        const opts = { ...params };

        for (const prop of Object.keys(opts)) {
            if (!(prop in this.params.ident)) delete opts[prop];
        }
        return opts;
    }

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
        const $this = this;
        const imgHash = hasha(imageBuffer);
        let opts = {
            name: name,
            viewport: params.viewport || await SyngrisiDriver.getViewport(),
            browserName: $this.params.browserName || await SyngrisiDriver.getBrowserVersion(),
            os: $this.params.os || await SyngrisiDriver.getOS(),
            app: $this.params.app,
            branch: $this.params.branch,
            imghash: imgHash,
        };

        this.identArgsGuard(opts);
        Object.assign(opts, this.removeNonIdentProperties(params));
        return $this.api.checkIfBaselineExist(opts, apikey);
    }

    async check(checkName, imageBuffer, apikey, params, domDump) {
        const $this = this;
        if ($this.params.testId === undefined) {
            throw new Error('The test id is empty, the session may not have started yet:'
                + `check name: '${checkName}', driver: '${JSON.stringify($this, null, '\t')}'`);
        }
        let opts = {};
        try {
            // ident:  ['name', 'viewport', 'browserName', 'os', 'app', 'branch'];
            opts = {
                testId: $this.params?.testId,
                suite: $this.params?.suite,
                name: checkName,
                viewport: params?.viewport || await SyngrisiDriver.getViewport(),
                browserName: $this.params?.browserName || await SyngrisiDriver.getBrowserVersion(),
                browserVersion: $this.params?.browserVersion || await SyngrisiDriver.getBrowserVersion(),
                browserFullVersion: $this.params?.browserFullVersion || await SyngrisiDriver.getBrowserFullVersion(),
                os: $this.params?.os || await SyngrisiDriver.getOS(),
                app: $this.params?.app,
                branch: $this.params?.branch,
                hashCode: hasha(imageBuffer),
                domDump: domDump,
            };
            Object.assign(
                opts,
                params,
            );
            return $this.coreCheck(imageBuffer, opts, apikey);
        } catch (e) {
            throw new Error(`cannot create check, parameters: '${JSON.stringify(opts)}, error: '${e.stack || e}'`);
        }
    }

    async coreCheck(imageBuffer, params, apikey) {
        const $this = this;
        let resultWithHash = await $this.api.createCheck(params, false, params.hashCode, apikey);
        resultWithHash = $this.addMessageIfCheckFailed(resultWithHash);

        log.info(`Check result Phase #1: ${utils.prettyCheckResult(resultWithHash)}`);
        if (resultWithHash.status === 'requiredFileData') {
            let resultWithFile = await $this.api.createCheck(params, imageBuffer, params.hashCode, apikey);
            log.info(`Check result Phase #2: ${utils.prettyCheckResult(resultWithFile)}`);
            resultWithFile = $this.addMessageIfCheckFailed(resultWithFile);
            return resultWithFile;
        }
        return resultWithHash;
    }
}

exports.SyngrisiDriver = SyngrisiDriver;
