const frisby = require('frisby');
var {When} = require('cucumber');
const YAML = require('yaml');

When(/^I send "([^"]*)" request to "([^"]*)"$/, async function (reqType, url) {
    const responce = frisby[reqType](url)
    await responce.expect('status', 123)
});

When(/^I send "([^"]*)" request to "([^"]*)" with:$/, async function (reqType, url, yml) {
    url = YAML.parse(this.fillItemsPlaceHolders(url))
    const params = YAML.parse(this.fillItemsPlaceHolders(yml))
    let response;
    switch (reqType) {
        case 'post': {
            if (params.form) {
                let form = frisby.formData();
                for (const key in params.form) {
                    form.append(key, params.form[key]);
                }
                response = frisby[reqType](url, {body: form})
            }
        }
    }
    let outResp = (await response).json;
    outResp.statusCode = (await response).status;
    await this.saveItem(reqType, outResp)
});

When(/^I expect the "([^"]*)" response with:$/, async function (requestType, yml) {
    const params = YAML.parse(yml)
    const response = await this.getSavedItem(requestType);
    console.log({response})
    expect(response.statusCode).toEqual(params.statusCode)
    expect(response).toMatchObject(params.json)
});
