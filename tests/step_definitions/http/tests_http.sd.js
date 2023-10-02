/* eslint-disable no-underscore-dangle,object-shorthand,no-console,func-names */
const { When, Given } = require('cucumber');
const YAML = require('yaml');
const frisby = require('frisby');
const fs = require('fs');
const hasha = require('hasha');
const { fillCommonPlaceholders } = require('../../src/utills/common');
const { requestWithLastSessionSid } = require('../../src/utills/common');

When(/^I remove via http checks that older than "([^"]*)" days$/, async function (days) {
    const uri = `http://${browser.config.serverDomain}:${browser.config.serverPort}`
        + `/task_handle_old_checks?days=${days}&remove=true`;
    const result = (await requestWithLastSessionSid(
        uri,
        this,
    ));
    console.log({ STATUS: result.raw.statusCode });
    expect(result.raw.statusCode)
        .toBe(200);
});

When(/^I remove via http Inconsistent items$/, async function () {
    const uri = `http://${browser.config.serverDomain}:${browser.config.serverPort}`
        + '/task_handle_database_consistency?clean=true';
    console.log('👉', { uri: uri });

    const result = (await requestWithLastSessionSid(
        uri,
        this,
    ));
    // console.log({ STATUS: result.raw.statusCode });
    await expect(result.raw.statusCode)
        .toBe(200);
});
