/* eslint-disable func-names */
const { Then } = require('cucumber');
const { requestWithLastSessionSid } = require('../src/utills/common');

Then(/^I expect exact "([^"]*)" snapshot files$/, async function (num) {
    const uri = `http://${browser.config.serverDomain}:${browser.config.serverPort}/`
        + 'screenshots';
    console.log({ uri: uri });
    const items = (await requestWithLastSessionSid(
        uri,
        this
    )).json;
    // console.log(items);
    expect(items.length)
        .toBe(parseInt(num, 10));
});
