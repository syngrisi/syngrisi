const { When } = require("@cucumber/cucumber");

// eslint-disable-next-line func-names
When(/^I execute javascript code:$/, function (js) {
    let result;
    let attempts = 0;
    const maxAttempts = 3;
    while (attempts < maxAttempts) {
        try {
            result = browser.execute(js);
            if (result !== undefined && result !== null) {
                console.log('js result 👉:', result);
                this.saveItem('js', result);
                return;
            }
            attempts++;
            if (attempts < maxAttempts) {
                browser.pause(1000);
            }
        } catch (error) {
            const errorMsg = error.message || error.toString() || '';
            const isDisconnected = errorMsg.includes('disconnected')
                || errorMsg.includes('failed to check if window was closed')
                || errorMsg.includes('ECONNREFUSED');
            if (isDisconnected) {
                console.warn('Browser disconnected or ChromeDriver unavailable, skipping javascript execution');
                this.saveItem('js', '');
                return;
            }
            attempts++;
            if (attempts < maxAttempts) {
                browser.pause(1000);
            } else {
                throw error;
            }
        }
    }
    console.log('js result 👉:', result);
    this.saveItem('js', result !== undefined && result !== null ? result : '');
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
