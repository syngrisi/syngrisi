/* eslint-disable prefer-arrow-callback,no-console,func-names */
const { When, Then } = require('cucumber');
const got = require('got');
const { fillCommonPlaceholders } = require('../../src/utills/common');

When(/^I accept the "([^"]*)" check$/, (checkName) => {
    expect($(`.//div[contains(normalize-space(.), '${checkName}')]/../..`))
        .toBeExisting();

    // eslint-disable-next-line max-len
    $(`.//div[contains(normalize-space(.), '${checkName}') and @name='check-name']/../../../..//a[contains(@class, 'accept-button')]`)
        .click();
    browser.pause(200);
    $(`.//div[contains(normalize-space(.), '${checkName}') and @name='check-name']/../div[@name='check-buttons']//a[contains(@class, 'accept-option')]`)
        .click();
});

When(/^I delete the "([^"]*)" check$/, (checkName) => {
    expect($(`.//div[contains(normalize-space(.), '${checkName}')]/../..`))
        .toBeExisting();

    // eslint-disable-next-line max-len
    browser.pause(1000);
    $(`.//div[contains(normalize-space(.), '${checkName}') and @name='check-name']/../../../..//a[contains(@class, 'remove-button')]`)
        .click();
    browser.pause(200);
    $(`.//div[contains(normalize-space(.), '${checkName}') and @name='check-name']/../div[@name='check-buttons']//a[contains(@class, 'remove-option')]`)
        .click();
});

When(/^I expect the(:? (\d)th)? "([^"]*)" check has "([^"]*)" acceptance status$/, (number, checkName, acceptStatus) => {
    number = number || 1;
    const acceptStatusMap = {
        accept: 'accepted-button-icon',
        'previously accept': 'prev-accepted-button-icon',
        'not accept': 'not-accepted-button-icon',
    };

    const icon = $(`(.//div[contains(normalize-space(.), '${checkName}') and @name='check-name']/../../../..//a[contains(@class, 'accept-button')]/i)[${number}]`);

    const classesList = icon
        .getAttribute('class')
        .split(' ');

    expect(classesList)
        .toContain(
            acceptStatusMap[acceptStatus]
        );

    const wrongStatuses = Object.keys(acceptStatusMap)
        .filter((x) => x !== acceptStatus);
    console.log({ wrongStatuses });

    // eslint-disable-next-line no-restricted-syntax
    for (const wrongStatus of wrongStatuses) {
        expect(classesList)
            .not
            .toContain(
                acceptStatusMap[wrongStatus]
            );
    }
});

// eslint-disable-next-line max-len
Then(/^I expect that last "([^"]*)" checks with ident contains "([^"]*)" has (not |)the same "([^"]*)"$/, async function (num, ident, negative, prop) {
    const checksGroups = JSON.parse((await got('http://vrs:3001/checks')).body);
    console.log({ checksGroups });
    const checks = Object.values(checksGroups)
        .map((x) => {
            const identKey = Object.keys(x)
                .filter((key) => key.startsWith('ident'))[0];
            console.log({ x });
            console.log({ identKey });
            const identParts = identKey.split('.');
            identParts.pop();
            const cuttedIdent = identParts.join('.');
            // eslint-disable-next-line no-param-reassign
            x[cuttedIdent] = x[identKey];
            return x;
        });
    console.log({ checks });
    const values = checks.map((x) => x[ident].checks)
        .flat()
        .slice(0, num)
        .map((x) => x[prop]);
    expect(values.length)
        .toBeGreaterThan(0);
    console.log({ values });
    if (negative) {
        console.log('NEGATIVE');
        expect(values.every((val, i, arr) => (val) === arr[0]))
            .toBe(false);
        return;
    }
    expect(values.every((val, i, arr) => (val) === arr[0]))
        .toBe(true);
});

Then(/^I expect that "([^"]*)" check preview tooltip "([^"]*)" field equal to "([^"]*)"$/, function (checkNum, field, value) {
    const value2 = fillCommonPlaceholders(value);
    const checkTitle = $(`(//canvas[contains(@class, 'snapshoot-canvas')])[${checkNum}]`)
        .getAttribute('title');
    console.log({ checkTitle });
    const regex = new RegExp(`${field}: (.+?)[<]`, 'gm');
    console.log({ regex });
    const match = regex.exec(checkTitle);
    console.log({ match });
    expect(match[0])
        .toContain(value2);
});

Then(/^I expect that(:? (\d)th)? VRS check "([^"]*)" has "([^"]*)" status$/, (number, checkName, expectedStatus) => {
    number = number || 1;
    expect($(`(.//div[contains(normalize-space(.), '${checkName}')]/../..)[${number}]`))
        .toBeExisting();

    const border = $(`.//div[contains(normalize-space(.), '${checkName}') and @name='check-name']/../../../..//div[@name='check-status']`);
    // "/../../../..//div[@name='check-status']\"/"
    const classStatuses = {
        New: 'bg-item-new',
        Passed: 'bg-item-passed',
        Failed: 'bg-item-failed',
        Blinking: 'bg-warning',
    };
    expect(border)
        .toHaveAttrContaining('class', classStatuses[expectedStatus]);
});
