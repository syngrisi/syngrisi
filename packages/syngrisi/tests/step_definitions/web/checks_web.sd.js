const { When, Then } = require("@cucumber/cucumber");
const { fillCommonPlaceholders } = require('../../src/utills/common');

When(/^I accept the "([^"]*)" check$/, async (checkName) => {
    const icon = await $(`[data-test='check-accept-icon'][data-popover-icon-name='${checkName}']`);
    await icon.waitForDisplayed();
    await icon.scrollIntoView({ block: 'center', inline: 'center' });
    await icon.waitForClickable({ timeout: 5000 });
    await icon.click();

    const confirmButton = await $(`[data-confirm-button-name='${checkName}']`);
    await confirmButton.waitForDisplayed();
    await confirmButton.waitForClickable({ timeout: 5000 });
    await confirmButton.click();

    await browser.waitUntil(async () => {
        const svgIcon = await $(`[data-test='check-accept-icon'][data-popover-icon-name='${checkName}'] svg`);
        if (!await svgIcon.isExisting()) {
            return false;
        }
        const typeAttr = await svgIcon.getAttribute('data-test-icon-type');
        if (typeAttr !== 'fill') {
            return false;
        }
        const color = await svgIcon.getCSSProperty('color');
        return color?.value === 'rgba(64,192,87,1)';
    }, { timeout: 10000, timeoutMsg: `Accept icon for "${checkName}" did not reach accepted state` });
});

When(/^I delete the "([^"]*)" check$/, async (checkName) => {
    try {
        const icon = await $(`[data-test='check-remove-icon'][data-popover-icon-name='${checkName}']`);
        await icon.waitForDisplayed();
        await icon.click();

        const confirmButton = await $(`[data-test='check-remove-icon-confirm'][data-confirm-button-name='${checkName}']`);
        await confirmButton.waitForDisplayed();
        await confirmButton.click();
    } catch (error) {
        const errorMsg = error.message || error.toString() || '';
        const isDisconnected = errorMsg.includes('disconnected')
            || errorMsg.includes('failed to check if window was closed')
            || errorMsg.includes('ECONNREFUSED');
        if (isDisconnected) {
            console.warn('Browser disconnected or ChromeDriver unavailable, skipping check deletion');
            return;
        }
        throw error;
    }
});

When(/^I expect the(:? (\d)th)? "([^"]*)" check has "([^"]*)" acceptance status$/, async (number, checkName, acceptStatus) => {
    number = number || 1;
    const acceptStatusMap = {
        accept: 'accepted-button-icon',
        'previously accept': 'prev-accepted-button-icon',
        'not accept': 'not-accepted-button-icon',
    };

    const icon = await $(`(.//div[contains(normalize-space(.), '${checkName}') and @name='check-name']/../../../..//a[contains(@class, 'accept-button')]/i)[${number}]`);
    const classesAttr = await icon.getAttribute('class');
    const classesList = classesAttr.split(' ');

    expect(classesList)
        .toContain(
            acceptStatusMap[acceptStatus]
        );

    const wrongStatuses = Object.keys(acceptStatusMap)
        .filter((x) => x !== acceptStatus);
    console.log({ wrongStatuses });

    for (const wrongStatus of wrongStatuses) {
        expect(classesList)
            .not
            .toContain(
                acceptStatusMap[wrongStatus]
            );
    }
});

Then(/^I expect that "([^"]*)" check preview tooltip "([^"]*)" field equal to "([^"]*)"$/, async function (checkNum, field, value) {
    const value2 = fillCommonPlaceholders(value);
    const canvas = await $(`(//canvas[contains(@class, 'snapshoot-canvas')])[${checkNum}]`);
    const checkTitle = await canvas.getAttribute('title');
    const regex = new RegExp(`${field}: (.+?)[<]`, 'gm');
    const match = regex.exec(checkTitle);
    expect(match[0])
        .toContain(value2);
});

Then(/^I expect that(:? (\d)th)? VRS check "([^"]*)" has "([^"]*)" status$/, async (number, checkName, expectedStatus) => {
    number = number || 1;
    await expect($(`(.//div[contains(normalize-space(.), '${checkName}')]/../..)[${number}]`))
        .toBeExisting();

    const border = await $(`.//div[contains(normalize-space(.), '${checkName}') and @name='check-name']/../../../..//div[@name='check-status']`);
    const classStatuses = {
        New: 'bg-item-new',
        Passed: 'bg-item-passed',
        Failed: 'bg-item-failed',
        Blinking: 'bg-warning',
    };
    await expect(border)
        .toHaveAttrContaining('class', classStatuses[expectedStatus]);
});

When(/^I remove the "([^"]*)" check$/, async function (name) {
    const removeIcon = await $(`[data-check='${name}'] [data-test='check-remove-icon']`);
    await removeIcon.waitForDisplayed();
    await removeIcon.scrollIntoView({ block: 'center', inline: 'center' });
    await removeIcon.waitForClickable({ timeout: 5000 });
    await browser.pause(200);
    await removeIcon.click();
    await browser.pause(1000);
    const confirmButton = await $(`[data-test="check-remove-icon-confirm"][data-confirm-button-name="${name}"]`);
    await confirmButton.waitForDisplayed({ timeout: 20000 });
    await confirmButton.scrollIntoView({ block: 'center', inline: 'center' });
    await confirmButton.waitForClickable({ timeout: 5000 });
    await browser.pause(300);
    await confirmButton.click();
});

When(/^I open the (\d)st check "([^"]*)"$/, async function (num, name) {
    const check = await $(`(//*[@data-test-preview-image='${name}'])[${num}]`);
    await check.waitForDisplayed();
    await check.click();
    const header = await $(`[data-check-header-name='${name}']`);
    await header.waitForDisplayed();
});
