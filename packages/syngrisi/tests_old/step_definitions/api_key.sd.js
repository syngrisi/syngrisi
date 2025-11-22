/* eslint-disable func-names,prefer-arrow-callback */
const { When } = require("@cucumber/cucumber");

When(/^I parse the API key$/, function () {
    const apiKey = $('[data-test=api-key]')
        .getValue();
    this.saveItem('apiKey', { value: apiKey });
});

When(/^I set the API key in config$/, function () {
    browser.config.apiKey = this.getSavedItem('apiKey').value;
});

When(/^I set API key: "([^"]*)" in config$/, function (apiKey) {
    browser.config.apiKey = apiKey;
});
