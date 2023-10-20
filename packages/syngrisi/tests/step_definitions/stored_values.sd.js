/* eslint-disable require-jsdoc,func-names */
const { Then } = require('cucumber');
const YAML = require('yaml');

Then(/^I expect that the "([^"]*)" saved value equal the "([^"]*)" saved value$/, function (first, second) {
    const firstItem = this.getSavedItem(first);
    const secondItem = this.getSavedItem(second);
    expect(firstItem.toString())
        .toBe(secondItem.toString());
});

Then(/^I expect "([^"]*)" saved object:$/, function (itemName, yml) {
    const params = YAML.parse(yml);
    const item = this.getSavedItem(itemName);
    if (item.result) Object.assign(item, JSON.parse(item.result));
    expect(item)
        .toMatchObject(params);
});

Then(/^I expect the stored "([^"]*)" string is( not|) (equal|contain):$/, function (itemName, condition, type, expected) {
    const itemValue = this.getSavedItem(itemName);

    // up first letter in string
    function capitalize(s) {
        return s[0].toUpperCase() + s.slice(1);
    }

    const assertMethod = `to${capitalize(type)}`;
    // console.log({ assertMethod });

    // eslint-disable-next-line no-console
    console.log('Expect:', expected.toString().trim());
    // eslint-disable-next-line no-console
    console.log('Stored:', itemValue.toString().trim());
    if (condition === ' not') {
        expect(itemValue.trim())
            .not[assertMethod](expected.toString().trim());
    } else {
        expect(itemValue.toString().trim())[assertMethod](expected.trim());
    }
});
