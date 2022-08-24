const { When, Then, Given } = require('cucumber');
When(/^I go to "([^"]*)" page$/, function (str) {
    const pages = {
        main: `http://${browser.config.serverDomain}:${browser.config.serverPort}/`,
        first_run: `http://${browser.config.serverDomain}:${browser.config.serverPort}/auth/change?first_run=true`,
        runs: `http://${browser.config.serverDomain}:${browser.config.serverPort}/runs`,
        change_password: `http://${browser.config.serverDomain}:${browser.config.serverPort}/auth/change`,
        logout: `http://${browser.config.serverDomain}:${browser.config.serverPort}/auth/logout`,
        admin2: `http://${browser.config.serverDomain}:${browser.config.serverPort}/admin2`,
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

Then(/^the current url contains "([^"]*)"$/, (url) => {
    const windowHandles = browser.getWindowHandles();
    const lastWindowHanle = windowHandles[windowHandles.length - 1];
    browser.switchToWindow(lastWindowHanle);
    expect(browser)
        .toHaveUrl(url, { containing: true });
});

Given(/^I open the app$/, () => {
    browser.url(`http://${browser.config.serverDomain}:${browser.config.serverPort}/`);
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
