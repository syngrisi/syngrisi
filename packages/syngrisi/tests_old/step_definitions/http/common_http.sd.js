/* eslint-disable object-shorthand,no-console,func-names */
const { Then, When } = require("@cucumber/cucumber");
const YAML = require('yaml');
const { requestWithLastSessionSid } = require('../../src/utills/common');

Then(/^I expect via http that "([^"]*)" (test|check|snapshot|run|suite) exist exactly "([^"]*)" times$/, async function (name, itemName, num) {
    const uri = `http://${browser.config.serverDomain}:${browser.config.serverPort}/`
        + `v1/${itemName}s?limit=0&filter={"$and":[{"name":{"$regex":"${name}","$options":"im"}}]}`;

    console.log('👉', { uri: uri });
    const items = (await requestWithLastSessionSid(
        uri,
        this
    )).json.results;
    console.log('✅', items)
    expect(items.length)
        .toBe(parseInt(num, 10));
});

Then(/^I expect via http ([\d]+)st (test|check|baseline) filtered as "([^"]*)" matched:$/, async function (num, itemName, filter, yml) {
    /**
     * Converts a string in the format "key=value" to a JSON string with a specific structure.
     *
     * @param {string} inputString - The input string in the format "key=value".
     * @returns {string} A JSON string with the converted structure.
     *
     * @example
     * // Example usage:
     * const inputString = "name=CheckName";
     * const convertedString = convertString(inputString);
     * console.log(convertedString);
     * // Output: '[{"name":{"$regex":"CheckName","$options":"im"}}]'
     */
    function convertQueryToMongoFilter(inputString) {
        // Split the input string into key and value
        const [key, value] = inputString.split('=');
        // Create an object with the desired structure
        const result = [{
            [key]: {
                $regex: `${value}`,
                $options: 'im',
            },
        }];
        return JSON.stringify(result);
    }

    const uri = `http://${browser.config.serverDomain}:${browser.config.serverPort}/`
        + `v1/${itemName}s?limit=0&filter={"$and":${convertQueryToMongoFilter(filter)}}`;

    console.log('👉', { uri: uri });
    const items = (await requestWithLastSessionSid(
        uri,
        this
    )).json.results;

    console.log('👉', { items: items });
    // console.log('👉', { items: JSON.stringify(items, null, '\t') });

    const params = YAML.parse(yml);
    const item = items[parseInt(num, 10) - 1];
    expect(item)
        .toMatchObject(params);
});

When(/^I debug$/, function () {
    browser.logToViewport('❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️')

    // throw new Error('!!!');
});
