/* eslint-disable */
const { When } = require('cucumber');
const { requestWithLastSessionSid, fillCommonPlaceholders } = require('../../src/utills/common');
const fs = require('fs');
const { default: checkVRS } = require('../../src/support/check/checkVrs');
const YAML = require('yaml');
const { error } = require('winston');

When(/^I accept via http the (\d+)st check with name "([^"]*)"$/, async function (num, name) {

    const uri = `http://${browser.config.serverDomain}:${browser.config.serverPort}/`
        + `v1/checks?limit=0&filter={"$and":[{"name":{"$regex":"${name}","$options":"im"}}]}`;

    console.log('💥👉', { uri: uri });
    const checks = (await requestWithLastSessionSid(
        uri,
        this
    )).json.results;

    console.log('👉', { checks: checks });

    const check = checks[num - 1];
    const checkId = check._id;
    const checkAcceptUri = `http://${browser.config.serverDomain}:${browser.config.serverPort}/v1/checks/`
        + `accept/${checkId}`;

    const result = await (await requestWithLastSessionSid(
        checkAcceptUri,
        this,
        {
            method: 'PUT',
            json: {
                baselineId: check.actualSnapshotId,
            }
        }
    )).json;
});

When(/^I check image with path: "([^"]*)" as "([^"]*)"$/, async function (filePath, checkName) {
    browser.pause(300);
    const imageBuffer = fs.readFileSync(`${browser.config.rootPath}/${filePath}`);
    const checkResult = await checkVRS(checkName, imageBuffer);
    // console.log({ checkResult });
    this.STATE.currentCheck = checkResult;
});

When(/^I check image with path: "([^"]*)" as "([^"]*)" and suppress exceptions$/, async function (filePath, checkName) {
    try {
        browser.pause(300);
        const imageBuffer = fs.readFileSync(browser.config.rootPath + '/' + filePath);
        const checkResult = await checkVRS(checkName, imageBuffer);
        this.STATE.currentCheck = checkResult;
    } catch (e) {
        this.STATE.currentCheck = { error: e };
        this.saveItem('error', e.message);
    }
});

When(/^I update via http last "([^"]*)" checks with params:$/, async function (num, str) {
    const params = YAML.parse(this.fillItemsPlaceHolders(fillCommonPlaceholders(str)));


    const uri = `http://${browser.config.serverDomain}:${browser.config.serverPort}/`
        + `v1/checks?limit=0&filter={"name": "${params.name}"}`;

    console.log('💥👉', { uri: uri });
    const checks = (await requestWithLastSessionSid(
        uri,
        this
    )).json.results;

    const lastChecks = checks.slice(num * -1, checks.length);

    for (const check of lastChecks) {
        const uri = `http://${browser.config.serverDomain}:${browser.config.serverPort}/v1/checks/${check._id}`;
        const result = (await requestWithLastSessionSid(
            uri,
            this,
            {
                method: 'PUT',
                form: params,
            },
        )).json;
    }
});

When(/^I update via http check with params:$/, async function (str) {
    const params = YAML.parse(this.fillItemsPlaceHolders(fillCommonPlaceholders(str)));
    const checkId = this.STATE.currentCheck._id;

    const uri = `http://${browser.config.serverDomain}:${browser.config.serverPort}/v1/checks/${checkId}`
    try {
        const result = (await requestWithLastSessionSid(
            uri,
            this,
            {
                method: 'PUT',
                form: params,
            },
        )).json;
    } catch (e) {
        console.log(e.stack || e);
        throw e;
    }
});

