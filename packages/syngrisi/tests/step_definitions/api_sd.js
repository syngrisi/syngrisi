/* eslint-disable prefer-arrow-callback,func-names,no-console */
const frisby = require('frisby');
const { When, Then } = require('cucumber');
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
    // const response = await browser.vDriver[methodName](opts, browser.config.apiKey);
    let response;
    try {
        if (methodName === 'check') {
            const imageBuffer = fs.readFileSync(`${browser.config.rootPath}/${opts.filePath}`);
            response = await browser.vDriver.check({
                checkName: opts.checkName,
                imageBuffer,
                params: opts.params,
            });
        } else if (methodName === 'checkIfBaselineExist') {
            const imageBuffer = fs.readFileSync(`${browser.config.rootPath}/${opts.filePath}`);
            response = await browser.vDriver.checkIfBaselineExist({
                params: opts.params,
                imageBuffer,
            });
        } else {
            response = await browser.vDriver[methodName](opts);
        }
        console.log(methodName, '💛💛💛', JSON.stringify(response, null, '    '));
        await this.saveItem(methodName, response);
    } catch (e) {
        console.error(chalk.magentaBright(`❌❌❌  ${e}`));
        response = e.toString();
        await this.saveItem(`${methodName}_error`, response);
    }
});

Then(/^I expect WDIODriver "([^"]*)" return value match object:$/, async function (methodName, params) {
    const value = await this.getSavedItem(methodName);
    const opts = JSON.parse(
        this.fillItemsPlaceHolders(fillCommonPlaceholders(params))
    );
    expect(value).toMatchObject(opts);
});

Then(/^I expect WDIODriver "([^"]*)" method throws ane error containing:$/, async function (methodName, expectedMessage) {
    const errMsg = await this.getSavedItem(`${methodName}_error`);
    console.log('💥', errMsg);
    expect(errMsg).toContain(expectedMessage.trim());
});
