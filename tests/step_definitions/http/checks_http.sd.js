/* eslint-disable */
const { When } = require('cucumber');
const { requestWithLastSessionSid } =  require('../../src/utills/common');
const fs = require('fs');
const { default: checkVRS } = require('../../src/support/check/checkVrs');

When(/^I remove via http (\d+)st check with name "([^"]*)"$/, async function (num, name) {
    const testUri = `http://${browser.config.serverDomain}:${browser.config.serverPort}/`
        + `checks/byfilter?name=${name}`;
    console.log({ uri: testUri });
    const check = (await requestWithLastSessionSid(
        testUri,
        this
    )).json[num - 1];
    console.log({ check });
    const id = check._id;

    const removeCheckUri = `http://${browser.config.serverDomain}:${browser.config.serverPort}/`
        + `checks/${id}`;
    console.log({ uri: removeCheckUri });
    const result = (await requestWithLastSessionSid(
        removeCheckUri,
        this,
        {
            method: 'DELETE',
            form: { id: id }
        }
    )).json;
    console.log({ result });
});

When(/^I accept via http the (\d+)st check with name "([^"]*)"$/, async function (num, name) {

    const checkUri = `http://${browser.config.serverDomain}:${browser.config.serverPort}/`
        + `checks/byfilter?name=${name}`;
    console.log({ uri: checkUri });
    const check = (await requestWithLastSessionSid(
        checkUri,
        this
    )).json[num - 1];
    console.log({ check });
    const checkId = check._id;
    const checkAcceptUri = `http://${browser.config.serverDomain}:${browser.config.serverPort}/`
        + `checks/${checkId}`;

    const result = (await requestWithLastSessionSid(
        checkAcceptUri,
        this,
        {
            method: 'PUT',
            form: {
                id: checkId,
                baselineId: check.baselineId,
                status: 'new',
                accept: 'true',
            }
        }
    )).json;
    console.log({ result });
});

When(/^I parse via http "([^"]*)" snapshot for (\d)st check with name "([^"]*)"$/, async function (type, num, name) {
    const checkUri = `http://${browser.config.serverDomain}:${browser.config.serverPort}/`
        + `checks/byfilter?name=${name}`;
    console.log({ uri: checkUri });
    const check = (await requestWithLastSessionSid(
        checkUri,
        this
    )).json[num - 1];
    const transformType = {
        actual: 'baselineId',
        baseline: 'actualSnapshotId'
    };
    console.log({ check });

    const snapshotId = check[transformType[type]];
    console.log({ snapshotId });
    const snapshootUri = `http://${browser.config.serverDomain}:${browser.config.serverPort}/`
        + `snapshot/${snapshotId}`;
    console.log({ snapshootUri });
    const snapshoot = (await requestWithLastSessionSid(
        snapshootUri,
        this
    )).json;
    console.log({ snapshoot });

    this.saveItem('snapshot', snapshoot);
});

When(/^I check image with path: "([^"]*)" as "([^"]*)"$/, async function (filePath, checkName) {
    browser.pause(300);
    const imageBuffer = fs.readFileSync(`${browser.config.rootPath}/${filePath}`);
    const checkResult = await checkVRS(checkName, imageBuffer);
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
