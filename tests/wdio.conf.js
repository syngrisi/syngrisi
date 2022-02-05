/* eslint-disable no-unused-vars */
const path = require('path');
const WdioScreenshot = require('wdio-screenshot-v5');
const hasha = require('hasha');
const { hooks } = require('./src/support/hooks');

exports.config = {
    rootPath: process.cwd(),
    testPlatform: process.env.TEST_PLATFORM || 'macOS',
    serverPort: 3001,
    serverDomain: 'vrs',
    syngrisiUrl: 'http://vrs:3001/',
    apiKey: process.env.SYNGRISI_API_KEY ? hasha(process.env.SYNGRISI_API_KEY) : '123',
    runner: 'local',
    specs: [
        './src/features/**/*.feature',
    ],
    exclude: [],
    maxInstances: 1,
    capabilities: [{
        maxInstances: 1,
        browserName: 'chrome',
        'goog:chromeOptions': {
            args: process.env.HL === '1' ? ['--headless', '--enable-automation'] : ['--enable-automation'],
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
    baseUrl: 'http://vrs:3000',
    waitforTimeout: 5000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,
    services: [
        [WdioScreenshot], ['chromedriver',
            {
                port: 7777,
            }]],
    framework: 'cucumber',
    reporters: ['spec'],
    cucumberOpts: {
        scenarioLevelReporter: true,
        retry: process.env.RETRY || 0,
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
            console.log(`STEP BEFORE: ${step.step.text}: ${step.sourceLocation.uri.split(path.sep)
                .join(path.posix.sep)}:${step.step.location.line}, ${step.step.location.column}`);
        }
    },

    ...hooks,
};
