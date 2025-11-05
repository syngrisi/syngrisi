/* eslint-disable no-console */
const { When, Given } = require('cucumber');
const YAML = require('yaml');
const {
    startServer, stopServer, clearDatabase, startDriver, startSession, clearScreenshotsFolder,
} = require('../src/utills/common');

When(/^I start Server with parameters:$/, { timeout: 600000 }, (params) => {
    startServer(params);
});

When(/^I start Server$/, { timeout: 600000 }, () => {
    startServer('');
});

When(/^I start Driver$/, { timeout: 600000 }, () => {
    startDriver('');
});


When(/^I start Server and start Driver$/, { timeout: 600000 }, () => {
    startServer('');
    startDriver('');
});

When(/^I stop the Syngrisi server|I stop Server$/, () => {
    stopServer();
});

When(/^I clear database$/, () => {
    clearDatabase(false);
});

When(/^I clear local storage$/, async () => {
    try {
        await browser.execute('localStorage.clear()');
    } catch (error) {
        const errorMsg = error.message || error.toString() || '';
        if (errorMsg.includes('disconnected') || errorMsg.includes('failed to check if window was closed') || errorMsg.includes('ECONNREFUSED')) {
            console.warn('Browser disconnected or ChromeDriver unavailable, skipping clear local storage');
        } else {
            throw error;
        }
    }
});

When(/^I clear screenshots folder$/, () => {
    clearScreenshotsFolder();
});

When(/^I clear Database and stop Server$/, () => {
    try {
        stopServer();
        clearDatabase();
    } catch (error) {
        const errorMsg = error.message || error.toString() || '';
        if (errorMsg.includes('disconnected') || errorMsg.includes('failed to check if window was closed') || errorMsg.includes('ECONNREFUSED')) {
            console.warn('Browser disconnected or ChromeDriver unavailable, skipping clear database and stop server');
        } else {
            throw error;
        }
    }
});

When(/^I set env variables:$/, (yml) => {
    const params = YAML.parse(yml);
    Object.keys(params)
        .forEach((key) => {
            process.env[key] = params[key];
        });
});

Given(/^I stop session$/, async () => {
    await browser.vDriver.stopTestSession();
});

Given(/^I setup driver with parameters:$/, async (params) => {
    startDriver(params);
});

Given(/^I setup driver$/, async () => {
    startDriver('');
});

Given(/^I start session with parameters:$/, async (params) => {
    const sessOpts = YAML.parse(params);
    if (!sessOpts.suiteName) sessOpts.suiteName = 'Int suite';
    await startSession(sessOpts);
});
