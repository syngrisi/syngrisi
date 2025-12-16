/* eslint-disable prefer-arrow-callback,func-names,no-console */
const frisby = require('frisby');
const { When, Then } = require("@cucumber/cucumber");
const YAML = require('yaml');
const fs = require('fs');
const chalk = require('chalk');
const { fillCommonPlaceholders } = require('../src/utills/common');

When(/^I send "([^"]*)" request to "([^"]*)"$/, async function (reqType, url) {
    const responce = frisby[reqType](url);
    await responce.expect('status', 123);
});

When(/^I send "([^"]*)" request to "([^"]*)" with:$/, async function (reqType, url, yml) {
    const parsedUrl = YAML.parse(this.fillItemsPlaceHolders(fillCommonPlaceholders(url)));
    console.log({ parsedUrl });
    let params;
    if (yml) params = YAML.parse(this.fillItemsPlaceHolders(fillCommonPlaceholders(yml)));
    let response;
    switch (reqType) {
        case 'post': {
            if (params.form) {
                const form = frisby.formData();
                for (const key in params.form) {
                    form.append(key, params.form[key]);
                }
                response = frisby[reqType](parsedUrl, { body: form });
            }
            break;
        }
        case 'get': {
            response = frisby[reqType](parsedUrl);
            break;
        }
        default:
            break;
    }
    const outResp = (await response).json;
    console.log({ outResp });
    outResp.statusCode = (await response).status;
    await this.saveItem(reqType, outResp);
});

When(/^I expect the "([^"]*)" response with:$/, async function (requestType, yml) {
    const params = YAML.parse(yml);
    const response = await this.getSavedItem(requestType);
    console.log({ response });
    expect(response.statusCode)
        .toEqual(params.statusCode);
    expect(response)
        .toMatchObject(params.json);
});

When(/^I expect the "([^"]*)" ([\d]+)st value response with:$/, async function (requestType, itemNum, yml) {
    const params = YAML.parse(yml);
    const result = await this.getSavedItem(requestType);
    console.log({ result });
    const response = Object.values(await this.getSavedItem(requestType))[parseInt(itemNum, 10) - 1];
    console.log({ response });
    expect(response)
        .toMatchObject(params);
});

When(/^I execute WDIODriver "([^"]*)" method with params:$/, async function (methodName, params) {
    const opts = JSON.parse(
        this.fillItemsPlaceHolders(fillCommonPlaceholders(params))
    );
    // вспомогательные флаги для повторных попыток при сетевых сбоях
    if (!this.STATE) this.STATE = {};
    if (methodName === 'startTestSession') {
        this.STATE.lastStartSessionParams = opts;
    }

    const execute = async () => browser.vDriver[methodName](opts);
    let response;
    try {
        if (methodName === 'check') {
            const maybeRecover = async () => {
                if (this.STATE.sessionStarted === false && this.STATE.lastStartSessionParams) {
                    try {
                        await retryStartSession.call(this);
                    } catch (e) {
                        throw e;
                    }
                }
            };
            await maybeRecover();

            const imageBuffer = fs.readFileSync(`${browser.config.rootPath}/${opts.filePath}`);
            response = await browser.vDriver.check({
                checkName: opts.checkName,
                imageBuffer,
                params: opts.params,
            });
            await this.saveItem(methodName, response);
        } else if (methodName === 'getBaselines') {
            response = await execute();
            const savedItem = response.results[0] || {};
            await this.saveItem(methodName, savedItem);
        } else {
            response = await executeWithRetry.call(this, methodName, execute);
            await this.saveItem(methodName, response);
        }
        console.log(methodName, '💛💛💛', JSON.stringify(response, null, '    '));
        if (methodName === 'startTestSession') {
            this.STATE.sessionStarted = true;
        }
    } catch (e) {
        console.error(chalk.magentaBright(`❌❌❌  ${e}`));
        response = e.toString();
        if (methodName === 'startTestSession') {
            this.STATE.sessionStarted = false;
        }
        if (methodName === 'check'
            && response.includes('test id is empty')
            && this.STATE.lastStartSessionParams) {
            try {
                await retryStartSession.call(this);
                const imageBuffer = fs.readFileSync(`${browser.config.rootPath}/${opts.filePath}`);
                const retryResult = await browser.vDriver.check({
                    checkName: opts.checkName,
                    imageBuffer,
                    params: opts.params,
                });
                await this.saveItem(methodName, retryResult);
                console.log(methodName, '💛💛💛', JSON.stringify(retryResult, null, '    '));
                return;
            } catch (retryErr) {
                response = retryErr.toString();
            }
        }
        await this.saveItem(`${methodName}_error`, response);
    }
});

async function executeWithRetry(methodName, execute) {
    if (methodName !== 'startTestSession') {
        return execute();
    }
    const attempts = 3;
    let lastError;
    for (let attempt = 1; attempt <= attempts; attempt += 1) {
        try {
            const result = await execute();
            return result;
        } catch (err) {
            const msg = err.toString();
            lastError = err;
            if (attempt < attempts && msg.includes('RequestError')) {
                browser.pause(1000);
                continue;
            }
            throw err;
        }
    }
    throw lastError;
}

async function retryStartSession() {
    if (!this.STATE.lastStartSessionParams) throw new Error('No params to restart session');
    const execute = async () => browser.vDriver.startTestSession(this.STATE.lastStartSessionParams);
    const result = await executeWithRetry.call(this, 'startTestSession', execute);
    this.STATE.sessionStarted = true;
    return result;
}

Then(/^I expect WDIODriver "([^"]*)" return value match object:$/, async function (methodName, params) {
    const value = await this.getSavedItem(methodName);
    const opts = JSON.parse(
        this.fillItemsPlaceHolders(fillCommonPlaceholders(params))
    );
    expect(value).toMatchObject(opts);
});

Then(/^I expect WDIODriver "([^"]*)" method throws an error containing:$/, async function (methodName, expectedMessage) {
    const errMsg = await this.getSavedItem(`${methodName}_error`);
    console.log('👉', errMsg);
    expect(errMsg).toContain(expectedMessage.trim());
});
