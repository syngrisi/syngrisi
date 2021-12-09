/* eslint-disable no-console */
const { When } = require('cucumber');
const { execSync } = require('child_process');
const { killServer } = require('../../src/utills/common');
const { startServer } = require('./lib/utils');

When(/^I stop the Syngrisi server$/, () => {
    try {
        console.log(`THE SYNGRISI SERVER PID: '${browser.syngrisiServer.pid}'`);
        if (process.platform === 'win32') {
            killServer(browser.config.serverPort);
            return;
        }
        if (browser.syngrisiServer) {
            browser.syngrisiServer.kill();
        }
    } catch (e) {
        console.log('WARNING: cannot stop te Syngrisi server via child, try to kill process');
        killServer(browser.config.serverPort);
    }
});

When(/^I kill process which used port: "([^"]*)"$/, (port) => {
    killServer(port);
});

When(/^I start VRS server with parameters:$/, { timeout: 600000 }, (params) => {
    startServer(params);
});

When(/^I start VRS server$/, { timeout: 600000 }, () => {
    startServer('');
});

When(/^I clear test VRS database$/, () => {
    // const cmdPath = browser.config.rootPath + '/vrs/';
    const cmdPath = '../';
    const result = execSync('npm run clear_test', { cwd: cmdPath })
        .toString('utf8');
    console.log({ result });
});
