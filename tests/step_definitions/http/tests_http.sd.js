/* eslint-disable no-underscore-dangle,object-shorthand,no-console,func-names */
const { When, Given } = require('cucumber');
const YAML = require('yaml');
const frisby = require('frisby');
const fs = require('fs');
const hasha = require('hasha');
const { fillCommonPlaceholders } = require('../../src/utills/common');
const { requestWithLastSessionSid } = require('../../src/utills/common');

When(/^I update via http test with params:$/, async function (str) {
    const params = YAML.parse(this.fillItemsPlaceHolders(fillCommonPlaceholders(str)));
    const testId = this.STATE.check.test;

    const uri = `http://${browser.config.serverDomain}:${browser.config.serverPort}/`
        + `tests/${testId}`;
    const result = (await requestWithLastSessionSid(
        uri,
        this,
        {
            method: 'PUT',
            form: params,
        },
    )).json;
    // console.log({ result });
});

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

When(/^I remove via http the (\d+)st test with name "([^"]*)"$/, async function (num, name) {
    const testUri = `http://${browser.config.serverDomain}:${browser.config.serverPort}/`
        + `tests/byfilter?name=${name}`;
    // console.log({ uri: testUri });
    const test = (await requestWithLastSessionSid(
        testUri,
        this
    )).json[num - 1];
    console.log({ test });
    const id = test._id;

    const removeTestUri = `http://${browser.config.serverDomain}:${browser.config.serverPort}/`
        + `tests/${id}`;
    // console.log({ uri: removeTestUri });
    const result = (await requestWithLastSessionSid(
        removeTestUri,
        this,
        {
            method: 'DELETE',
            form: { id: id },
        }
    )).json;
    // console.log({ result });
});

When(/^I create via http new VRS Test with:$/, async function (yml) {
    const params = YAML.parse(yml);

    const form = frisby.formData();
    for (const key in params.params) {
        form.append(key, params.params[key]);
    }
    const response = await frisby.post(params.url, { body: form });
    console.log(response.json);
    this.saveItem('VRSTestResponse', response);
});

Given(/^I create via http new VRS Check with:$/, async function (yml) {
    const params = YAML.parse(yml);
    const form = frisby.formData();
    for (const key in params.params) {
        form.append(key, params.params[key]);
    }
    const testResp = await this.getSavedItem('VRSTestResponse');
    console.log(testResp);
    form.append('testid', testResp.json._id);

    const imageData = fs.readFileSync(params.hashFilePath);
    form.append('hashcode', hasha(imageData));

    if (params.file) {
        form.append('file', fs.createReadStream(params.file));
    }

    const response = await frisby.post(params.url, { body: form });
    const resp = response.json;
    resp.statusCode = response.status;
    this.saveItem('VRSCheck', resp);
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
