const { SyngrisiDriver } = require('@syngrisi/wdio-sdk');

const getVDriver = () => {
    if (!browser.vDriver) {
        browser.vDriver = new SyngrisiDriver({
            url: `http://${browser.config.serverDomain}:${browser.config.serverPort}/`,
            apiKey: browser.config.apiKey,
        });
    }
    return browser.vDriver;
};

module.exports = { getVDriver };








