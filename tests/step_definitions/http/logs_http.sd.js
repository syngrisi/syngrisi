/* eslint-disable */
const { When } = require('cucumber');
const YAML = require('yaml');
const { got } = require('got-cjs');

When(/^I create "([^"]*)" log messages with params:$/, async function (num, json) {
    const params = YAML.parse(json);
    const uri = `http://${browser.config.serverDomain}:${browser.config.serverPort}/v1/logs`;
    const result = [];
    for (const i of (Array.from(new Array(Number(num)).keys()))) {
        // console.log(`log message #${i}`);
        result.push(got.post(
            uri,
            {
                json: { ...params, message: params.message.replace(/[$]/g, i) },
            }
        ).json());
    }
    const out = await Promise.all(result);
    // console.log({ out });
});
