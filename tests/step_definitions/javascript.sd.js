const { When } = require('cucumber');

// eslint-disable-next-line func-names
When(/^I execute javascript code:$/, function (js) {
    const result = browser.execute(js);
    this.saveItem('js', result);
});

// eslint-disable-next-line func-names
When(/^I execute javascript code and save as "([^"]*)":$/, function (itemName, js) {
    const result = browser.execute(js);
    // console.log({ result });
    this.saveItem(itemName, result);
});
