/* eslint-disable require-jsdoc */
import logger from '@wdio/logger';

const log = logger('wdio-syngrisi-cucumber-service');

// eslint-disable-next-line require-jsdoc
// noinspection JSUnusedLocalSymbols
export default class SyngrisiCucumberService {
    // eslint-disable-next-line no-unused-vars
    // noinspection JSUnusedLocalSymbols
    // eslint-disable-next-line no-unused-vars
    constructor(serviceOptions, capabilities, config) {
        log.trace('service initialization start');
        this.options = serviceOptions;
        log.debug(`init the syngrisi driver with options: ${JSON.stringify(this.options)}`);
        const syngrisi = require('@syngrisi/syngrisi-wdio-sdk');
        this.vDriver = new syngrisi.SyngrisiDriver({ url: this.options.endpoint });
        log.trace('service initialization end');
    }

    // eslint-disable-next-line valid-jsdoc
    /**
     * this browser object is passed in here for the first time
     */
    before(config, spec, browser) {
        this.browser = browser;
    }

    // eslint-disable-next-line class-methods-use-this,no-unused-vars
    after(exitCode, config, capabilities) {
    }

    // eslint-disable-next-line class-methods-use-this,no-unused-vars
    beforeTest(test, context) {
    }

    async beforeScenario(...args) {
        try {
            log.debug('beforeScenario hook START');
            // console.log({ args });
            let uri;
            let feature;
            let scenario;
            let sourceLocation;
            if (!args[0]?.gherkinDocument) { // < WDIO v7
                // eslint-disable-next-line no-unused-vars
                [uri, feature, scenario, sourceLocation] = args;
            } else { // >= WDIO v7
                feature = args[0]?.gherkinDocument.feature;
                scenario = args[0]?.pickle;
            }

            if (this.options.excludeTag && scenario.tags.map((x) => x.name)
                .includes(this.options.excludeTag)) {
                log.debug(`beforeScenario: the option excludeTag for visual scenario is not empty (${this.options.excludeTag}), scenario will be excluded`);
                return;
            }

            if (this.options.tag && !scenario.tags.map((x) => x.name)
                .includes(this.options.tag)) {
                log.debug(`beforeScenario: the option tag for visual scenario is not empty (${this.options.tag}), but scenario is not contains such tags`);
                return;
            }
            const params = {
                app: this.options.app || this.options.project,
                branch: this.options.branch,
                tags: scenario.tags ? scenario.tags.map((x) => x.name) : [],
                test: scenario.name,
                suite: feature.name,
                run: this.options?.runname || process.env.SYNGRISY_RUN_NAME,
                runident: this.options.runident || process.env.SYNGRISY_RUN_INDENT,
            };
            log.debug(`start syngrisi session with params: '${JSON.stringify(params)}', apikey: ${this.options.apikey}`);

            await this.vDriver.startTestSession(params, this.options.apikey);

            const $this = this;
            browser.addCommand(
                'syngrisiCheck',
                // eslint-disable-next-line arrow-body-style
                async (checkName, imageBuffer, opts, domDump = null) => {
                    return $this.vDriver.check(checkName, imageBuffer, $this.options.apikey, opts, domDump);
                }
            );
            browser.addCommand(
                'syngrisiIsBaselineExist',
                // eslint-disable-next-line arrow-body-style
                async (name, imageBuffer) => {
                    return $this.vDriver.checkIfBaselineExist(name, imageBuffer, $this.options.apikey, params);
                }
            );
            log.trace('beforeScenario hook END');
        } catch (e) {
            const errMsg = 'error in Syngrisi Cucumber service, maybe Syngrisi is not started,\n'
                + ` beforeScenario hook: '${e + (e.trace || '')}' read the logs`;
            const errMockFn = () => {
                log.error(errMsg);
                throw new Error(errMsg);
            };

            browser.addCommand(
                'syngrisiCheck',
                // eslint-disable-next-line arrow-body-style
                errMockFn
            );

            browser.addCommand(
                'syngrisiIsBaselineExist',
                errMockFn
            );
            log.error(errMsg);
            throw new Error(errMsg);
        }
    }

    async afterScenario(...args) {
        try {
            log.trace('afterScenario hook START');
            let uri;
            let feature;
            let scenario;
            let result;
            let sourceLocation;
            log.trace({ args });
            if (!args[0]?.gherkinDocument) { // < WDIO v7
                // eslint-disable-next-line no-unused-vars
                [uri, feature, scenario, result, sourceLocation] = args;
            } else { // WDIO v7
                scenario = args[0].pickle;
            }
            if (this.options.excludeTag && scenario.tags.map((x) => x.name)
                .includes(this.options.excludeTag)) {
                log.debug(`beforeScenario: the option excludeTag for visual scenario is not empty (${this.options.excludeTag}), scenario will be excluded`);
                return;
            }

            if (this.options.tag && !scenario.tags.map((x) => x.name)
                .includes(this.options.tag)) {
                log.debug(`afterScenario: the option tag for visual scenario is not empty (${this.options.tag}), but scenario is not contains such tags`);
                return;
            }
            log.debug(`stop session with api key: '${this.options.apikey}'`);
            await this.vDriver.stopTestSession(this.options.apikey);
            log.trace('afterScenario hook END');
        } catch (e) {
            throw new Error(`error in Syngrisi Cucumber service afterScenario hook: '${e + (e.trace || '')}'`);
        }
    }
}
