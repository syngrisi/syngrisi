/* eslint-disable dot-notation,no-unused-vars */
//
// =====
// Hooks
// =====
// WebdriverIO provides a several hooks you can use to interfere the test process in order to
// enhance it and build services around it. You can either apply a single function to it or
// an array of methods. If one of them returns with a promise,
// WebdriverIO will wait until that promise is resolved to continue.
//
const child = require('child_process');
const chalk = require('chalk');
const { getCid } = require('../utills/common');

exports.hooks = {
    /**
     * Gets executed once before all workers get launched.
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     */
    onPrepare: function (config, capabilities) {
        const result = child.execSync('rm -f ./logs/*');
        child.execSync('rm -rf ../coverage');
        // Kill any existing ChromeDriver processes on port 7777
        try {
            child.execSync('lsof -ti:7777 | xargs kill -9 2>/dev/null || true', { stdio: 'ignore' });
        } catch (e) {
            // Ignore errors if no process found
        }
        // console.log({ logsRemove: result.toString() });
    },
    /**
     * Gets executed before a worker process is spawned & can be used to initialize specific service
     * for that worker as well as modify runtime environments in an async fashion.
     * @param  {String} cid    capability id (e.g 0-0)
     * @param  {[type]} caps   object containing capabilities for session
     * @param  {[type]} specs  specs to be run in the worker process
     * @param  {[type]} args   object that will be merged with the main
     *                         configuration once worker is initialized
     * @param  {[type]} execArgv list of string arguments passed to the worker process
     */
    // onWorkerStart: function (cid, caps, specs, args, execArgv) {
    // },
    /**
     * Gets executed just before initializing the webdriver session and test framework.
     * It allows you to manipulate configurations depending on the capability or spec.
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that are to be run
     */
    // beforeSession: function (config, capabilities, specs) {
    // },
    /**
     * Gets executed before test execution begins. At this point you can access to all global
     * variables like `browser`. It is the perfect place to define custom commands.
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that are to be run
     */
    before: function (capabilities, specs) {
        console.error = ((msg) => console.log(chalk.red(msg)));
        console.warn = ((msg) => console.log(chalk.yellow(msg)));
    },
    /**
     * Gets executed before the suite starts.
     * @param {Object} suite suite details
     */
    // beforeSuite: function (suite) {
    // },
    /**
     * This hook gets executed _before_ every hook within the suite starts.
     * (For example, this runs before calling `before`, `beforeEach`, `after`)
     *
     * (`stepData` and `world` are Cucumber-specific.)
     *
     */
    // beforeHook: function (test, context, stepData, world) {
    // },
    /**
     * Hook that gets executed _after_ every hook within the suite ends.
     * (For example, this runs after calling `before`, `beforeEach`, `after`, `afterEach` in Mocha.)
     *
     * (`stepData` and `world` are Cucumber-specific.)
     */
    // afterHook:function(test,context,{error, result, duration, passed, retries}, stepData,world) {
    // },
    /**
     * Function to be executed before a test (in Mocha/Jasmine) starts.
     */
    // beforeTest: function (test, context) {
    // },
    /**
     * Runs before a WebdriverIO command is executed.
     * @param {String} commandName hook command name
     * @param {Array} args arguments that the command would receive
     */
    // beforeCommand: function (commandName, args) {
    // },
    /**
     * Runs after a WebdriverIO command gets executed
     * @param {String} commandName hook command name
     * @param {Array} args arguments that command would receive
     * @param {Number} result 0 - command success, 1 - command error
     * @param {Object} error error object, if any
     */
    // afterCommand: function (commandName, args, result, error) {
    // },
    /**
     * Function to be executed after a test (in Mocha/Jasmine)
     */
    // afterTest: function (test, context, {error, result, duration, passed, retries}) {
    // },
    /**
     * Hook that gets executed after the suite has ended.
     * @param {Object} suite suite details
     */
    // afterSuite: function (suite) {
    // },
    /**
     * Gets executed after all tests are done. You still have access to all global variables from
     * the test.
     * @param {Number} result 0 - test pass, 1 - test fail
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that ran
     */
    // after: function (result, capabilities, specs) {
    // },
    /**
     * Gets executed right after terminating the webdriver session.
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that ran
     */
    // afterSession: function (config, capabilities, specs) {
    // },
    /**
     * Gets executed after all workers have shut down and the process is about to exit.
     * An error thrown in the `onComplete` hook will result in the test run failing.
     * @param {Object} exitCode 0 - success, 1 - fail
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {<Object>} results object containing test results
     */
    // onComplete: function (exitCode, config, capabilities, results) {
    // },
    /**
     * Gets executed when a refresh happens.
     * @param {String} oldSessionId session ID of the old session
     * @param {String} newSessionId session ID of the new session
     */
    // onReload: function (oldSessionId, newSessionId) {
    // },
    /**
     * Cucumber-specific hooks
     */
    beforeFeature: function (uri, feature) {
        const cid = getCid();
        console.log(`[${cid}] ========== BEFORE FEATURE: ${feature.name} (${uri}) ==========`);
    },
    beforeScenario: async function (world, context) {
        const cid = getCid();
        const scenarioName = context?.pickle?.name || world?.pickle?.name || 'unknown';
        console.log(`[${cid}] ===== BEFORE SCENARIO: ${scenarioName} =====`);
        require('../utills/addCommands');
        await browser.setWindowSize(1366, 768);
    },
    beforeStep: function (step, scenario, context) {
        const allureReporter = require('@wdio/allure-reporter').default;
        allureReporter.addStep(`${step.keyword}${step.text}`);
    },
    afterStep: async function (step, scenario, context, result) {
        // console.log({ step });
        if (result.passed === false) {
            const cid = getCid();
            const scenarioName = scenario?.pickle?.name || context?.pickle?.name || scenario?.name || 'unknown';
            const stepText = step?.text || 'unknown';
            const stepKeyword = step?.keyword || '';
            const text = `${cid}_${stepKeyword.toLowerCase()}_${scenarioName} -- ${stepText}`.toLowerCase();
            const baseFileName = `./logs/${text.replace(/\s/g, '_')
                .replace(/"/g, '@')
                .replace(/:/g, '')
                .replace(/\//g, '_')
                }`;
            try {
                await browser.saveScreenshot(`${baseFileName}.png`);
            } catch (screenshotError) {
                const errorMsg = screenshotError.message || screenshotError.toString() || '';
                if (errorMsg.includes('disconnected') || errorMsg.includes('failed to check if window was closed') || errorMsg.includes('ECONNREFUSED')) {
                    console.warn('Browser disconnected or ChromeDriver unavailable, skipping screenshot');
                } else {
                    console.warn('Failed to save screenshot:', screenshotError.message);
                }
            }
            const uri = scenario?.uri || context?.pickle?.uri || scenario?.pickle?.uri || 'unknown';
            const line = step?.location?.line || 'unknown';
            const column = step?.location?.column || 'unknown';
            const errMsg = `${cid}# error in: /${stepText}:${uri}:${line}, ${column}\n`
                + result.error + '\n'
                + result.error?.stack;
            const fs = require('fs');
            fs.writeFileSync(`${baseFileName}.log`, errMsg);
            console.error(errMsg);

            if (process.env['DBG'] === '1') {
                if (result.error.stack) {
                    console.error(result.error.stack);
                }
                try {
                    await browser.debug();
                } catch (debugError) {
                    const errorMsg = debugError.message || debugError.toString() || '';
                    if (errorMsg.includes('disconnected') || errorMsg.includes('failed to check if window was closed')) {
                        console.warn('Browser disconnected, skipping debug');
                    }
                }
            }
        }
    },
    afterScenario: async function (world, context, result) {
        const cid = getCid();
        const scenarioName = context?.pickle?.name || world?.pickle?.name || 'unknown';
        console.log(`[${cid}] ===== AFTER SCENARIO: ${scenarioName} =====`);
        console.log(`[${cid}] Scenario result: ${result?.status || result?.willBeRetried || 'completed'}`);
        if (browser.syngrisiServer) {
            try {
                const serverProcess = browser.syngrisiServer;
                if (serverProcess && !serverProcess.killed) {
                    serverProcess.kill('SIGINT');
                    // Wait max 1 second for graceful shutdown
                    await Promise.race([
                        new Promise((resolve) => {
                            if (serverProcess.killed) {
                                resolve();
                                return;
                            }
                            const exitHandler = () => {
                                serverProcess.removeListener('exit', exitHandler);
                                resolve();
                            };
                            serverProcess.once('exit', exitHandler);
                        }),
                        new Promise(resolve => setTimeout(resolve, 1000))
                    ]);

                    // Force kill if still running
                    if (!serverProcess.killed) {
                        try {
                            serverProcess.kill('SIGKILL');
                        } catch (e) {
                            // Ignore
                        }
                    }
                }
            } catch (e) {
                // Ignore errors when killing server
            }
            browser.syngrisiServer = null;
        }
        // await browser.execute('localStorage.clear()');
    },
    afterFeature: function (uri, feature, scenarios) {
        const cid = getCid();
        console.log(`[${cid}] ========== AFTER FEATURE: ${feature.name} (${uri}) ==========`);
    },
    onComplete: async function (exitCode, config, capabilities, results) {
        // Force cleanup of any remaining processes
        try {
            // Kill all Syngrisi test servers gracefully
            try {
                child.execSync('pkill -SIGINT -f "syngrisi_test_server_" || true', { stdio: 'ignore', timeout: 5000 });
            } catch (e) {
                // Ignore
            }
            // Wait a bit for graceful shutdown
            await new Promise(resolve => setTimeout(resolve, 2000));
            // Force kill if still running
            try {
                child.execSync('pkill -9 -f "syngrisi_test_server_" || true', { stdio: 'ignore', timeout: 2000 });
            } catch (e) {
                // Ignore
            }
            // Kill any remaining ChromeDriver processes
            try {
                child.execSync('lsof -ti:7777 | xargs kill -9 2>/dev/null || true', { stdio: 'ignore' });
            } catch (e) {
                // Ignore
            }
        } catch (e) {
            // Ignore cleanup errors
        }
    },
};
