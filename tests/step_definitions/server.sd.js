/* eslint-disable no-console */
const { When, Given } = require('cucumber');
const YAML = require('yaml');
const {
    startServer, stopServer, clearDatabase, startDriver, startSession,
} = require('../src/utills/common');

When(/^I start VRS server with parameters:$/, { timeout: 600000 }, (params) => {
    startServer(params);
});

When(/^(?:I start VRS server|I start Server)$/, { timeout: 600000 }, () => {
    startServer('');
});

When(/^I start Server and start Driver$/, { timeout: 600000 }, () => {
    startServer('');
    startDriver('');
});

When(/^I stop the Syngrisi server|I stop Server$/, () => {
    stopServer();
});

When(/^I clear test VRS database$/, () => {
    clearDatabase();
});

When(/^I clear Database and stop Server$/, () => {
    clearDatabase();
    stopServer();
});

When(/^I set env variables:$/, (yml) => {
    const params = YAML.parse(yml);
    for (const key in params) {
        process.env[key] = params[key];
    }
});

Given(/^I stop VRS session$/, async () => {
    await browser.vDriver.stopTestSession(browser.config.apiKey);
});

Given(/^I setup VRS driver with parameters:$/, async (params) => {
    startDriver(params);
});

Given(/^I setup VRS driver$/, async () => {
    startDriver('');
});

Given(/^I start VRS session with parameters:$/, async (params) => {
    const sessOpts = YAML.parse(params);
    await startSession(sessOpts);
});
