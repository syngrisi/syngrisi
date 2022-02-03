const { When } = require('cucumber');
When(/^I execute javascript code:$/, function (js) {
    const result = browser.execute(js);
    console.log({ result });
    this.saveItem('js', result);
});

When(/^I execute javascript code and save as "([^"]*)":$/, function (itemName, js) {
    const result = browser.execute(js);
    console.log({ result });
    this.saveItem(itemName, result);
});
