/* eslint-disable */
const { When } = require('cucumber');
const { requestWithLastSessionSid, fillCommonPlaceholders } = require('../../src/utills/common');
const fs = require('fs');
const { default: checkVRS } = require('../../src/support/check/checkVrs');
const YAML = require('yaml');
const { error } = require('winston');

When(/^I remove via http (\d+)st check with name "([^"]*)"$/, async function (num, name) {
    const testUri = `http://${browser.config.serverDomain}:${browser.config.serverPort}/`
        + `checks/byfilter?name=${name}`;
    // console.log({ uri: testUri });
    const check = (await requestWithLastSessionSid(
        testUri,
        this
    )).json[num - 1];
    // console.log({ check });
    const id = check._id;

    const removeCheckUri = `http://${browser.config.serverDomain}:${browser.config.serverPort}/`
        + `checks/${id}`;
    // console.log({ uri: removeCheckUri });
    const result = (await requestWithLastSessionSid(
        removeCheckUri,
        this,
        {
            method: 'DELETE',
            form: { id: id }
        }
    )).json;
    // console.log({ result });
});

When(/^I accept via http the (\d+)st check with name "([^"]*)"$/, async function (num, name) {

    const checkUri = `http://${browser.config.serverDomain}:${browser.config.serverPort}/`
        + `checks/byfilter?name=${name}`;
    // console.log({ uri: checkUri });
    const checks = (await requestWithLastSessionSid(
        checkUri,
        this
    )).json;
    const check = checks[num - 1];
    // console.log(JSON.stringify(checks, null, '\t'));
    const checkId = check._id;
    const checkAcceptUri = `http://${browser.config.serverDomain}:${browser.config.serverPort}/`
        + `acceptChecks/${checkId}`;

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

When(/^I parse via http "([^"]*)" snapshot for (\d)st check with name "([^"]*)"$/, async function (type, num, name) {
    const checkUri = `http://${browser.config.serverDomain}:${browser.config.serverPort}/`
        + `checks/byfilter?name=${name}`;
    // console.log({ uri: checkUri });
    const check = (await requestWithLastSessionSid(
        checkUri,
        this
    )).json[num - 1];
    const transformType = {
        actual: 'baselineId',
        baseline: 'actualSnapshotId'
    };
    // console.log({ check });

    const snapshotId = check[transformType[type]];
    console.log({ snapshotId });
    const snapshotUri = `http://${browser.config.serverDomain}:${browser.config.serverPort}/`
        + `snapshot/${snapshotId}`;
    console.log({ snapshotUri: snapshotUri });
    const snapshot = (await requestWithLastSessionSid(
        snapshotUri,
        this
    )).json;
    console.log({ snapshot: snapshot });

    this.saveItem('snapshot', snapshot);
});

When(/^I check image with path: "([^"]*)" as "([^"]*)"$/, async function (filePath, checkName) {
    browser.pause(300);
    const imageBuffer = fs.readFileSync(`${browser.config.rootPath}/${filePath}`);
    const checkResult = await checkVRS(checkName, imageBuffer);
    // console.log({ checkResult });
    this.STATE.check = checkResult;
});

When(/^I check image with path: "([^"]*)" as "([^"]*)" and suppress exceptions$/, async function (filePath, checkName) {
    try {
        browser.pause(300);
        const imageBuffer = fs.readFileSync(browser.config.rootPath + '/' + filePath);
        const checkResult = await checkVRS(checkName, imageBuffer);
        this.STATE.check = checkResult;
    } catch (e) {
        this.STATE.check = { error: e };
        this.saveItem('error', e.message);
    }
});

When(/^I update via http last "([^"]*)" checks with params:$/, async function (num, str) {
    const params = YAML.parse(this.fillItemsPlaceHolders(fillCommonPlaceholders(str)));

    const checkUri = `http://${browser.config.serverDomain}:${browser.config.serverPort}/`
        + `checks/byfilter?name=${params.name}`;

    const checks = (await requestWithLastSessionSid(
        checkUri,
        this
    )).json;

    const lastChecks = checks.slice(num * -1, checks.length);

    for (const check of lastChecks) {
        const uri = `http://${browser.config.serverDomain}:${browser.config.serverPort}/`
            + `checksupdate/${check._id}`;

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
    console.log('!!!!!!!!!!');
    console.log(this.STATE.check);
    const checkId = this.STATE.check._id;

    const uri = `http://${browser.config.serverDomain}:${browser.config.serverPort}/`
        + `checksupdate/${checkId}`;
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

