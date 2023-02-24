/* eslint-disable */
const { When, Then, Given } = require('cucumber');
const { fillCommonPlaceholders } = require('../src/utills/common');

When(/^I go to "([^"]*)" page$/, (str) => {
    const pages = {
        main: `http://${browser.config.serverDomain}:${browser.config.serverPort}/`,
        first_run: `http://${browser.config.serverDomain}:${browser.config.serverPort}/auth/change?first_run=true`,
        runs: `http://${browser.config.serverDomain}:${browser.config.serverPort}/runs`,
        change_password: `http://${browser.config.serverDomain}:${browser.config.serverPort}/auth/change`,
        logout: `http://${browser.config.serverDomain}:${browser.config.serverPort}/auth/logout`,
        admin2: `http://${browser.config.serverDomain}:${browser.config.serverPort}/admin`,
        logs: `http://${browser.config.serverDomain}:${browser.config.serverPort}/admin/logs`,
        settings: `http://${browser.config.serverDomain}:${browser.config.serverPort}/admin/settings`,
        admin: {
            users: `http://${browser.config.serverDomain}:${browser.config.serverPort}/admin?task=users`,
            tasks: `http://${browser.config.serverDomain}:${browser.config.serverPort}/admin?task=tasks`,
        },
    };
    if (str.includes('>')) {
        const page = str.split('>')[0];
        const subPage = str.split('>')[1];
        browser.url(pages[page][subPage]);
        return;
    }
    browser.url(pages[str]);
});

When(/^I refresh page$/, () => {
    browser.refresh();
});

Then(/^the current url contains "([^"]*)"$/, function (url) {
    const url2 = this.fillItemsPlaceHolders(fillCommonPlaceholders(url));
    const windowHandles = browser.getWindowHandles();
    const lastWindowHandle = windowHandles[windowHandles.length - 1];
    browser.switchToWindow(lastWindowHandle);
    expect(browser)
        .toHaveUrl(url2, { containing: true });
});

Given(/^I open the app$/, () => {
    browser.url(`http://${browser.config.serverDomain}:${browser.config.serverPort}/`);
    browser.pause(2000);
});

When(/^I open "([^"]*)" view$/, (name) => {
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
