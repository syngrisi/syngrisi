/* eslint-disable func-names */
const { Then } = require('cucumber');
const path = require('path');
const fs = require('fs');
const { requestWithLastSessionSid } = require('../src/utills/common');

Then(/^I expect that the snapshoot filename is (not exists|exists)$/, function (condition) {
    const snapshot = this.getSavedItem('snapshot');
    const filePath = path.join(path.resolve(__dirname, '../../baselinesTest'),
        snapshot.filename);
    console.log({ filePath });
    if (condition === 'exists') {
        expect(fs.existsSync(filePath))
            .toBe(true);
        return;
    }
    expect(fs.existsSync(filePath))
        .toBe(false);
});

Then(/^I expect exact "([^"]*)" snapshoot files$/, async function (num) {
    const uri = `http://${browser.config.serverDomain}:${browser.config.serverPort}/`
        + 'screenshots';
    console.log({ uri: uri });
    const items = (await requestWithLastSessionSid(
        uri,
        this
    )).json;
    console.log(items);
    expect(items.length)
        .toBe(parseInt(num, 10));
});
