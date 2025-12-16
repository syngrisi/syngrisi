/* eslint-disable object-shorthand,no-console,func-names */
const { Then, When } = require("@cucumber/cucumber");
const YAML = require('yaml');
const fs = require('fs');
const { requestWithLastSessionSid, fillCommonPlaceholders } = require('../../src/utills/common');

Then(/^I expect via http (\d+) baselines$/, async function (num) {
    const baselines = (await requestWithLastSessionSid(
        `http://${browser.config.serverDomain}:${browser.config.serverPort}/v1/baselines?limit=0&filter={}`,
        this
    ))
        .json
        .results;

    expect(baselines.length)
        .toBe(parseInt(num, 10));
});

When(/^I check if baseline exist:$/, async function (yml) {
    const params = YAML.parse(this.fillItemsPlaceHolders(fillCommonPlaceholders(yml)));
    const filePath = params.filePath || 'files/A.png';
    const imageBuffer = fs.readFileSync(`${browser.config.rootPath}/${filePath}`);
    delete params.filePath;
    const result = await browser.vDriver.checkIfBaselineExist(
        {
            name: params.name,
            imageBuffer: imageBuffer,
            params: params,
        }
    );
    console.log({ result });
    this.saveItem('checkedBaseline', result?.snapshotFound);
});
