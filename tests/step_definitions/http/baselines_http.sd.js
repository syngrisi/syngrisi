/* eslint-disable object-shorthand,no-console,func-names */
const { Then, When } = require('cucumber');
const YAML = require('yaml');
const fs = require('fs');
const { requestWithLastSessionSid, fillCommonPlaceholders } = require('../../src/utills/common');

Then(/^I expect via http (\d+) baselines$/, async function (num) {
    const baselines = (await requestWithLastSessionSid(
        `http://${browser.config.serverDomain}:${browser.config.serverPort}/baselines`,
        this
    )).json;

    expect(baselines.length)
        .toBe(parseInt(num, 10));
});

Then(/^I expect via http ([\d]+)st baseline with:$/, async function (num, yml) {
    const baselines = (await requestWithLastSessionSid(
        `http://${browser.config.serverDomain}:${browser.config.serverPort}/baselines`,
        this
    )).json;
    console.log({ baselines });

    const params = YAML.parse(yml);
    const baseline = baselines[parseInt(num, 10) - 1];
    baseline.markedByUsername = baseline.markedByUsername || '';
    baseline.markedAs = baseline.markedAs || '';
    expect(baseline)
        .toMatchObject(params);
});

When(/^I check if baseline exist:$/, async function (yml) {
    const params = YAML.parse(this.fillItemsPlaceHolders(fillCommonPlaceholders(yml)));
    const filePath = params.filePath || 'files/A.png';
    const imageBuffer = fs.readFileSync(`${browser.config.rootPath}/${filePath}`);
    delete params.filePath;
    const result = await browser.vDriver.checkIfBaselineExist(imageBuffer, params.name, this.getSavedItem('apiKey').value, params);
    console.log({ result });
    this.saveItem('checkedBaseline', result?.respStatus);
});
