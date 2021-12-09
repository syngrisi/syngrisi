/* eslint-disable object-shorthand,no-console,func-names */
const { Then, When } = require('cucumber');
const YAML = require('yaml');
const { requestWithLastSessionSid } = require('../lib/utils');

Then(/^I expect via http that "([^"]*)" (test|check) exist exactly "([^"]*)" times$/, async function (name, itemName, num) {
    const uri = `http://${browser.config.serverDomain}:${browser.config.serverPort}/`
        + `${itemName}s/byfilter?name=${name}`;
    console.log({ uri: uri });
    const items = (await requestWithLastSessionSid(
        uri,
        this
    )).json;
    expect(items.length)
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

When(/^I generate via http API key for the User$/, async function () {
    const uri = `http://${browser.config.serverDomain}:${browser.config.serverPort}/apikey`;
    const res = await requestWithLastSessionSid(uri, this);
    console.log({ respBodyJSON: res.json });
    const apiKey = res.json.apikey;
    console.log({ apiKey });
    this.saveItem('apiKey', apiKey);
});

Then(/^I expect via http (\d+) baselines$/, async function (num) {
    const baselines = (await requestWithLastSessionSid(
        `http://${browser.config.serverDomain}:${browser.config.serverPort}/baselines`,
        this
    )).json;

    expect(baselines.length)
        .toBe(parseInt(num, 10));
});
