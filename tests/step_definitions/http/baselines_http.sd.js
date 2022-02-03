/* eslint-disable object-shorthand,no-console,func-names */
const { Then, When } = require('cucumber');
const YAML = require('yaml');
const { requestWithLastSessionSid } = require('../../src/utills/common');

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
