/* eslint-disable prefer-arrow-callback,no-console,func-names */
const { When, Then } = require('cucumber');
// const { got } = require('got-cjs');
const { fillCommonPlaceholders } = require('../../src/utills/common');

When(/^I accept the "([^"]*)" check$/, (checkName) => {
    const icon = $(`[data-test='check-accept-icon'][data-accept-icon-name='${checkName}']`);
    icon.waitForDisplayed();
    icon.click();

    const confirmButton = $(`[data-confirm-button-name='${checkName}']`);
    confirmButton.waitForDisplayed();
    confirmButton.click();

    // expect($(`.//div[contains(normalize-space(.), '${checkName}')]/../..`))
    //     .toBeExisting();
    //
    // // eslint-disable-next-line max-len
    // $(`.//div[contains(normalize-space(.), '${checkName}') and @name='check-name']/../../../..//a[contains(@class, 'accept-button')]`)
    //     .click();
    // browser.pause(200);
    // $(`.//div[contains(normalize-space(.), '${checkName}') and @name='check-name']/../div[@name='check-buttons']//a[contains(@class, 'accept-option')]`)
    //     .click();
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

Then(/^I expect that "([^"]*)" check preview tooltip "([^"]*)" field equal to "([^"]*)"$/, function (checkNum, field, value) {
    const value2 = fillCommonPlaceholders(value);
    const checkTitle = $(`(//canvas[contains(@class, 'snapshoot-canvas')])[${checkNum}]`)
        .getAttribute('title');
    // console.log({ checkTitle });
    const regex = new RegExp(`${field}: (.+?)[<]`, 'gm');
    // console.log({ regex });
    const match = regex.exec(checkTitle);
    // console.log({ match });
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

When(/^I remove the "([^"]*)" check$/, function (name) {
    const removeIcon = $(`[data-check='${name}'] [data-test='check-remove-icon']`);
    removeIcon.waitForDisplayed();
    removeIcon.click();
    const confirmButton = $(`[data-test="check-remove-icon-confirm"][data-confirm-button-name="${name}"]`);
    confirmButton.waitForDisplayed();
    browser.pause(500);
    confirmButton.click();
});
