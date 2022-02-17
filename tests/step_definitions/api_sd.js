/* eslint-disable prefer-arrow-callback,func-names,no-console */
const frisby = require('frisby');
const { When } = require('cucumber');
const YAML = require('yaml');
const { fillCommonPlaceholders } = require('../src/utills/common');

When(/^I send "([^"]*)" request to "([^"]*)"$/, async function (reqType, url) {
    const responce = frisby[reqType](url);
    await responce.expect('status', 123);
});

When(/^I send "([^"]*)" request to "([^"]*)" with:$/, async function (reqType, url, yml) {
    url = YAML.parse(this.fillItemsPlaceHolders(fillCommonPlaceholders(url)));
    let params;
    if (yml) params = YAML.parse(this.fillItemsPlaceHolders(fillCommonPlaceholders(yml)));
    let response;
    switch (reqType) {
        case 'post': {
            if (params.form) {
                const form = frisby.formData();
                for (const key in params.form) {
                    form.append(key, params.form[key]);
                }
                response = frisby[reqType](url, { body: form });
            }
            break;
        }
        case 'get': {
            response = frisby[reqType](url);
            break;
        }
        default:
            break;
    }
    const outResp = (await response).json;
    console.log({ outResp });
    outResp.statusCode = (await response).status;
    await this.saveItem(reqType, outResp);
});

When(/^I expect the "([^"]*)" response with:$/, async function (requestType, yml) {
    const params = YAML.parse(yml);
    const response = await this.getSavedItem(requestType);
    console.log({ response });
    expect(response.statusCode)
        .toEqual(params.statusCode);
    expect(response)
        .toMatchObject(params.json);
});

When(/^I expect the "([^"]*)" ([\d]+)st value response with:$/, async function (requestType, itemNum, yml) {
    const params = YAML.parse(yml);
    const TMP = await this.getSavedItem(requestType);
    console.log({ TMP });
    const response = Object.values(await this.getSavedItem(requestType))[parseInt(itemNum, 10) - 1];
    console.log({ response });
    expect(response)
        .toMatchObject(params);
});
