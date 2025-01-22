/* eslint-disable no-unused-vars */
const path = require('path');
const WdioScreenshot = require('wdio-screenshot-v5');
const hasha = require('hasha');

const { hooks } = require('./src/support/hooks');

const streams = process.env.DOCKER === '1' ? 1 : (parseInt(process.env.STREAMS, 10) || 3);
exports.config = {
    rootPath: process.cwd(),
    testPlatform: process.env.TEST_PLATFORM || 'macOS',
    serverPort: 3001,
    serverDomain: 'localhost',
    testScreenshotsFolder: '',
    apiKey: process.env.SYNGRISI_API_KEY ? hasha(process.env.SYNGRISI_API_KEY) : '123',
    runner: 'local',
    specs: [
        // './src/features/**/*.feature',
    ],
    exclude: [
        './features/debug/debug.feature',
    ],
    maxInstances: streams,
    capabilities: [{
        maxInstances: streams,
        browserName: 'chrome',
        'goog:chromeOptions': {
            args: process.env.HL === '1' ? ['--headless', '--enable-automation', '--disable-gpu'] : ['--enable-automation'],
            binary: path.resolve(__dirname, './chrome/chrome/mac_arm-118.0.5993.70/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'),
            prefs: {
                credentials_enable_service: false,
                download: {
                    prompt_for_download: false,
                    directory_upgrade: true,
                    default_directory: '/tmp',
                },
            },
        },
    }],
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    logLevel: 'warn',
    // outputDir: path.join(__dirname, '/logs'),
    //
    // Set specific log levels per logger
    // loggers:
    // - webdriver, webdriverio
    // - @wdio/applitools-service, @wdio/browserstack-service,
    //   @wdio/devtools-service, @wdio/sauce-service
    // - @wdio/mocha-framework, @wdio/jasmine-framework
    // - @wdio/local-runner, @wdio/lambda-runner
    // - @wdio/sumologic-reporter
    // - @wdio/cli, @wdio/config, @wdio/sync, @wdio/utils
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    // logLevels: {
    //     webdriver: 'info',
    //     '@wdio/applitools-service': 'info'
    // },
    //
    bail: 0,
    baseUrl: 'http://localhost:3000',
    waitforTimeout: 5000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,
    services: [
        ['cucumber-viewport-logger', { enabled: false }],
        [WdioScreenshot], 'shared-store', ['chromedriver',
            {
                port: 7777,
            }]],
    framework: 'cucumber',
    reporters: ['spec',
        [
            'allure',
            {
                outputDir: 'allure-results',
                disableWebdriverStepsReporting: true,
                disableWebdriverScreenshotsReporting: true,
            },
        ],
    ],
    cucumberOpts: {
        scenarioLevelReporter: true,
        retry: parseInt(process.env.RETRY, 10) || 0,
        backtrace: false,
        requireModule: ['@babel/register'],
        failAmbiguousDefinitions: true,
        failFast: false,
        ignoreUndefinedDefinitions: false,
        name: [],
        snippets: true,
        source: true,
        profile: [],
        require: [
            './step_definitions/**/*.js',
            './src/support/world.js',
        ],
        snippetSyntax: undefined,
        strict: true,
        tagExpression: 'not @Pending',
        tagsInTitle: false,
        timeout: process.env.DBG === '1' ? 600000 : 60000,
    },

    beforeStep({ uri, feature, step }, context) {
        if (process.env.LOG === '1' || process.env.DBG === '1') {
            // eslint-disable-next-line no-console
            console.log(`🧩 STEP BEFORE: ${step.step.keyword} ${step.step.text}: ${step.sourceLocation.uri.split(path.sep)
                .join(path.posix.sep)}:${step.step.location.line}, ${step.step.location.column}`);
        }
    },

    ...hooks,
};
