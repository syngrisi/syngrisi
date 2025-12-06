/* eslint-disable require-jsdoc,func-names */
const { Then } = require("@cucumber/cucumber");
const YAML = require('yaml');

Then(/^I expect that the "([^"]*)" saved value equal the "([^"]*)" saved value$/, function (first, second) {
    const firstItem = this.getSavedItem(first);
    const secondItem = this.getSavedItem(second);
    const firstStr = firstItem !== null && firstItem !== undefined ? firstItem.toString() : '';
    const secondStr = secondItem !== null && secondItem !== undefined ? secondItem.toString() : '';
    expect(firstStr)
        .toBe(secondStr);
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

    const expectedStr = expected ? expected.toString().trim() : '';
    const itemValueStr = itemValue !== null && itemValue !== undefined ? itemValue.toString().trim() : '';

    // eslint-disable-next-line no-console
    console.log('Expect:', expectedStr);
    // eslint-disable-next-line no-console
    console.log('Stored:', itemValueStr);
    if (condition === ' not') {
        expect(itemValueStr)
            .not[assertMethod](expectedStr);
    } else {
        expect(itemValueStr)[assertMethod](expectedStr);
    }
});
