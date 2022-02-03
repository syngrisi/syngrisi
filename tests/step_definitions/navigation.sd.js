const { When, Then, Given } = require('cucumber');
When(/^I go to "([^"]*)" page$/, function (str) {
    if (str === 'main') {
        browser.url(`http://${browser.config.serverDomain}:${browser.config.serverPort}/`);
        return;
    }
    const pages = {
        admin: {
            users: `http://${browser.config.serverDomain}:${browser.config.serverPort}/admin?task=users`,
        },
    };

    const page = str.split('>')[0];
    const subPage = str.split('>')[1];
    browser.url(pages[page][subPage]);
});

When(/^I refresh page$/, () => {
    browser.refresh();
});

Then(/^the current url contains "([^"]*)"$/, (url) => {
    const windowHandles = browser.getWindowHandles();
    const lastWindowHanle = windowHandles[windowHandles.length - 1];
    browser.switchToWindow(lastWindowHanle);
    expect(browser)
        .toHaveUrl(url, { containing: true });
});

Given(/^I open the app$/, () => {
    browser.url(browser.config.syngrisiUrl);
    browser.pause(2000);
});

When(/^I open "([^"]*)" view$/, function (name) {
    browser.waitUntil(
        () => {
            let state = true;
            try {
                $(`[name='${name}']`)
                    .click();
            } catch (e) {
                if (e.message.includes('not interactable')) {
                    state = false;
                }
            }
            return state;
        },
        {
            timeout: 5000,
        }
    );
});
