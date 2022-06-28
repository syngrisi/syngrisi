/* eslint-disable object-shorthand,no-console,func-names */
const { Then, When } = require('cucumber');
const YAML = require('yaml');
const { requestWithLastSessionSid } = require('../../src/utills/common');

Then(/^I expect via http that "([^"]*)" (test|check) exist exactly "([^"]*)" times$/, async function (name, itemName, num) {
    const uri = `http://${browser.config.serverDomain}:${browser.config.serverPort}/`
        + `${itemName}s/byfilter?name=${name}`;
    // console.log({ uri: uri });
    const items = (await requestWithLastSessionSid(
        uri,
        this
    )).json;
    expect(items.length)
        .toBe(parseInt(num, 10));
});

Then(/^I expect via http ([\d]+)st (test|check) filtered as "([^"]*)" matched:$/, async function (num, itemName, filter, yml) {
    const url = encodeURI(`http://${browser.config.serverDomain}:${browser.config.serverPort}/${itemName}s/byfilter?${filter}`);
    // console.log({ url });
    const items = (await requestWithLastSessionSid(
        url,
        this
    )).json;
    // console.log({ items });
    const params = YAML.parse(yml);
    const item = items[parseInt(num, 10) - 1];
    expect(item)
        .toMatchObject(params);
});

When(/^I debug$/, function () {
    browser.logToViewport('❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️')

    // throw new Error('!!!');
});
