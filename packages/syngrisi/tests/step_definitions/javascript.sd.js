const { When } = require('cucumber');

// eslint-disable-next-line func-names
When(/^I execute javascript code:$/, function (js) {
    try {
        const result = browser.execute(js);
        console.log('js result 👉:', result);
        this.saveItem('js', result);
    } catch (error) {
        const errorMsg = error.message || error.toString() || '';
        const isDisconnected = errorMsg.includes('disconnected')
            || errorMsg.includes('failed to check if window was closed')
            || errorMsg.includes('ECONNREFUSED');
        if (isDisconnected) {
            console.warn('Browser disconnected or ChromeDriver unavailable, skipping javascript execution');
            this.saveItem('js', null);
        } else {
            throw error;
        }
    }
});

// eslint-disable-next-line func-names
When(/^I execute javascript code and save as "([^"]*)":$/, function (itemName, js) {
    try {
        const result = browser.execute(js);
        // console.log({ result });
        this.saveItem(itemName, result);
    } catch (error) {
        const errorMsg = error.message || error.toString() || '';
        const isDisconnected = errorMsg.includes('disconnected')
            || errorMsg.includes('failed to check if window was closed')
            || errorMsg.includes('ECONNREFUSED');
        if (isDisconnected) {
            console.warn('Browser disconnected or ChromeDriver unavailable, skipping javascript execution');
            this.saveItem(itemName, null);
        } else {
            throw error;
        }
    }
});
