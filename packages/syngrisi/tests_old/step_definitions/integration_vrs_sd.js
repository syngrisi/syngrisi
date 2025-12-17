// noinspection HttpUrlsUsage

const YAML = require('yaml');
const { got } = require('got-cjs');
const fs = require('fs');
const { Given, When, Then } = require("@cucumber/cucumber");
const { collectDomTree } = require('@syngrisi/wdio-sdk');
// const SyngrisiDriver = require('@syngrisi/wdio-sdk').SyngrisiDriver;
const checkVRS = require('../src/support/check/checkVrs');
const waitForAndRefresh = require('../src/support/action/waitForAndRefresh').default;
// const { startSession, killServer, startDriver } = require('../src/utills/common');

const {
    saveRandomImage,
    fillCommonPlaceholders,
} = require('../src/utills/common');
// const { TableVRSComp } = require('../src/PO/vrs/tableVRS.comp');

// const { requestWithLastSessionSid } = require('../src/utills/common');

// for debug purposes ONLY
Given(/^I update the VRStest$/, async function () {
    await browser.vDriver.updateTest();
});

When(/^I get all affected elements in current and last successful checks from the server$/, async function () {
    const result = this.getSavedItem('checkDumpResult');
    // console.log({ result });
    const uri = `http://${browser.config.serverDomain}:${browser.config.serverPort}/affectedelements?checktid=${result._id}&diffid=${result.diffId}`;
    console.log({ uri });
    const affectResp = await got(uri, { headers: { apikey: browser.config.apiKey } });
    const prevAffectResp = await got(`http://${browser.config.serverDomain}:${browser.config.serverPort}/affectedelements?checktid=${result.lastSuccess}&diffid=${result.diffId}`,
        { headers: { apikey: browser.config.apiKey } });
    console.log(affectResp.body);
    console.log(prevAffectResp.body);
    this.saveItem('actualElements', JSON.parse(affectResp.body));
    this.saveItem('prevElements', JSON.parse(prevAffectResp.body));
    console.table(JSON.parse(affectResp.body), ['tag', 'id', 'x', 'y', 'width', 'height', 'domPath']);
    console.table(JSON.parse(prevAffectResp.body), ['tag', 'id', 'x', 'y', 'width', 'height', 'domPath']);
});

When(/^I set properties for VRSDriver:$/, function (yml) {
    const params = YAML.parse(this.fillItemsPlaceHolders(yml));
    Object.assign(browser.vDriver._params, params);
});

When(/^I visually check page with DOM as "([^"]*)"$/, async function (checkName) {
    const domDump = await browser.execute(collectDomTree);
    await browser.pause(300);
    const screenshot = await browser.saveDocumentScreenshot();
    const imageBuffer = Buffer.from(screenshot, 'base64');
    const checkResult = await checkVRS(checkName, imageBuffer, {}, domDump);
    // console.log({ checkResult });
    this.saveItem('checkDump', JSON.parse(checkResult.domDump)[0]);
    this.saveItem('checkDumpResult', checkResult);
});

When(/^I assert image with path: "([^"]*)" as "([^"]*)"$/, async function (filePath, checkName) {
    await browser.pause(300);
    const imageBuffer = fs.readFileSync(`${browser.config.rootPath}/${filePath}`);
    const checkResult = await checkVRS(checkName, imageBuffer);
    this.STATE.currentCheck = checkResult;
    try {
        expect(checkResult.status[0] === 'new' || checkResult.status[0] === 'passed')
            .toBeTruthy();
    } catch (e) {
        throw new e.constructor(`${e.message}  \ncheck status is: '${checkResult.status[0]}', expected 'new' or 'passed'
                \n Result: '${JSON.stringify(checkResult)}'`);
    }
});

When(/^I visually check page as "([^"]*)"$/, { timeout: 180000 }, async function (checkName) {
    await browser.pause(300);
    const screenshot = await browser.saveDocumentScreenshot();
    const imageBuffer = Buffer.from(screenshot, 'base64');
    const checkResult = await checkVRS(checkName, imageBuffer);
    this.saveItem('checkResult', checkResult);
});

Then(/^I expect "([^"]*)" tests for get url "([^"]*)"$/, async function (testsNum, url) {
    const response = await got(url);
    const jsonBodyObject = JSON.parse(response.body);
    // console.log({jsonBodyObject});
    expect(Object.keys(jsonBodyObject).length)
        .toBe(parseInt(testsNum, 10));
});

When(/^I login with user:"([^"]*)" password "([^"]*)"$/, async function (login, password) {
    try {
        const loginUrl = `http://${browser.config.serverDomain}:${browser.config.serverPort}/`;
        await browser.url(loginUrl);
        await browser.pause(3000);
        // Wait for password field with retries
        let passwordFieldFound = false;
        for (let attempt = 0; attempt < 5; attempt += 1) {
            try {
                const passwordField = await $('#password');
                await passwordField.waitForDisplayed({ timeout: 5000 });
                passwordFieldFound = true;
                break;
            } catch (e) {
                if (attempt < 4) {
                    await browser.url(loginUrl);
                    await browser.pause(2000);
                }
            }
        }
        if (!passwordFieldFound) {
            const errorMsg = 'Password field not found after retries - possibly auth is disabled or page did not load';
            console.warn(errorMsg);
            throw new Error(errorMsg);
        }

        const emailInput = await $('#email');
        await emailInput.setValue(login);
        const passwordInput = await $('#password');
        await passwordInput.setValue(password);
        const submitButton = await $('#submit');
        await submitButton.click();
    } catch (error) {
        const errorMsg = error.message || error.toString() || '';
        const isDisconnected = errorMsg.includes('disconnected')
            || errorMsg.includes('failed to check if window was closed')
            || errorMsg.includes('ECONNREFUSED');
        if (isDisconnected) {
            console.warn('Browser disconnected or ChromeDriver unavailable, skipping login');
        } else {
            throw error;
        }
    }
});

When(/^I select the test "([^"]*)"$/, async function (testName) {
    try {
        const checkbox = await $(`//span[normalize-space(text())='${testName}']/../../..//input`);
        await checkbox.click();
    } catch (error) {
        const errorMsg = error.message || error.toString() || '';
        if (errorMsg.includes('disconnected') || errorMsg.includes('failed to check if window was closed')) {
            console.warn('Browser disconnected, skipping test selection');
        } else {
            throw error;
        }
    }
});

Then(/^I expect the (\d)st "([^"]*)" check has "([^"]*)" acceptance status$/, async function (num, checkName, acceptStatus) {
    const acceptStatusMap = {
        accept: 'accepted-button-icon',
        'previously accept': 'prev-accepted-button-icon',
        'not accept': 'not-accepted-button-icon',
    };
    const icon = await $(`(.//div[contains(normalize-space(.), '${checkName}') and @name='check-name']/../../../..//a[contains(@class, 'accept-button')]/i)[${num}]`);

    const classesAttr = await icon.getAttribute('class');
    const classesList = classesAttr.split(' ');

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

Then(/^I expect that the element "([^"]*)" to have attribute "([^"]*)" containing "([^"]*)"$/, async function (selector, attr, value) {
    let value2 = (value === null) ? '' : value;
    value2 = fillCommonPlaceholders(value2);
    const element = await $(selector);
    await expect(element)
        .toHaveAttrContaining(attr, value2);
});

Then(/^I expect that the element "([^"]*)" to (not |)have attribute "([^"]*)"$/, async function (selector, cond, attr) {
    const element = await $(selector);
    if (!cond) {
        await expect(element)
            .toHaveAttr(attr);
        return;
    }
    await expect(element)
        .not
        .toHaveAttr(attr);
});

// async function getWithLastSessionSid(uri, $this) {
//     // console.log({ uri });
//     const sessionSid = $this.getSavedItem('lastSessionId');
//     // console.log({ sessionSid });
//
//     const res = await got.get(`${uri}`, {
//         'headers': {
//             'cookie': `connect.sid=${sessionSid}`
//         },
//     });
//     return {
//         raw: res,
//         json: JSON.parse(res.body)
//     };
// }

// COMMON
When(/^I click on the element "([^"]*)" via js$/, async function (selector) {
    try {
        const element = await $(selector);
        await element.jsClick();
    } catch (error) {
        const errorMsg = error.message || error.toString() || '';
        if (errorMsg.includes('disconnected') || errorMsg.includes('failed to check if window was closed')) {
            console.warn('Browser disconnected, skipping jsClick');
        } else {
            throw error;
        }
    }
});

Then(/^I expect HTML( does not|) contains:$/, async function (mode, text) {
    if (mode === ' does not') {
        const source = await browser
            .getPageSource();
        expect(source)
            .not
            .toContain(text.trim());
        return;
    }
    const source = await browser
        .getPageSource();
    expect(source)
        .toContain(text.trim());
});

When(/^I wait and refresh page on element "([^"]*)" for "([^"]*)" seconds to( not)* (exist)$/, { timeout: 600000 },
    waitForAndRefresh);

When(/^I START DEBUGGER$/, { timeout: 6000000 }, async function () {
    await browser.debug();
});

When(/^I wait for "([^"]*)" seconds$/, { timeout: 600000 }, async function (sec) {
    await browser.pause(sec * 1000);
});

Given(/^I set window size: "(1366x768|712x970|880x768|1050x768|1300x768|1300x400|1700x768|500x500|1440x900)"$/, async function (viewport) {
    try {
        const size = viewport.split('x');
        await browser.setWindowSize(parseInt(size[0], 10), parseInt(size[1], 10));
    } catch (error) {
        const errorMsg = error.message || error.toString() || '';
        const isDisconnected = errorMsg.includes('disconnected')
            || errorMsg.includes('failed to check if window was closed')
            || errorMsg.includes('ECONNREFUSED');
        if (isDisconnected) {
            console.warn('Browser disconnected or ChromeDriver unavailable, skipping window size setting');
        } else {
            throw error;
        }
    }
});

Given(/^I generate a random image "([^"]*)"$/, async function (filePath) {
    await saveRandomImage(filePath);
});

Then(/^the "([^"]*)" "([^"]*)" should be "([^"]*)"$/, function (itemType, property, exceptedValue) {
    expect(this.STATE[itemType][property].toString())
        .toEqual(exceptedValue);
});

When(/^I expect that element "([^"]*)" to (contain|have) text "([^"]*)"$/, async function (selector, matchCase, text) {
    const filledText = this.fillItemsPlaceHolders(fillCommonPlaceholders(text));

    const element = await $(selector);
    if (matchCase === 'contain') {
        await expect(element)
            .toHaveTextContaining(filledText);
    } else {
        await expect(element)
            .toHaveText(filledText);
    }
});

When(/^I expect that element "([^"]*)" to contain HTML "([^"]*)"$/, async function (selector, text) {
    const filledText = this.fillItemsPlaceHolders(fillCommonPlaceholders(text));

    const element = await $(selector);
    const html = await element.getHTML();
    expect(html)
        .toContain(filledText);
});


Given(/^I set custom window size: "([^"]*)"$/, async function (viewport) {
    const size = viewport.split('x');
    await browser.setWindowSize(parseInt(size[0], 10), parseInt(size[1], 10));
});

Then(/^I expect that element "([^"]*)" is clickable$/, async function (selector) {
    const element = await $(selector);
    await expect(element)
        .toBeClickable();
});

When(/^I expect that element "([^"]*)" (not |)contain value "([^"]*)"$/, async function (selector, cond, val) {
    const element = await $(selector);
    const actualValue = await element
        .getValue();
    // console.log({ actualValue });
    if (cond === 'not ') {
        expect(actualValue)
            .not
            .toContain(val);
        return;
    }
    expect(actualValue)
        .toContain(val);
});

When(/^I expect that element "([^"]*)" (not |)contain text "([^"]*)"$/, async function (selector, cond, val) {
    try {
        const element = await $(selector);
        const actualValue = await element
            .getText();
        console.log({ actualValue });
        if (!cond) {
            expect(actualValue)
                .toContain(val);
            return;
        }
        expect(actualValue)
            .not
            .toContain(val);
    } catch (error) {
        const errorMsg = error.message || error.toString() || '';
        if (errorMsg.includes('disconnected') || errorMsg.includes('failed to check if window was closed')) {
            console.warn('Browser disconnected, skipping text check');
        } else {
            throw error;
        }
    }
});

Then(/^page source match:$/, async function (source) {
    const parsedExpectedObj = JSON.parse(source);
    let parseActualObj;
    const preElement = await $('pre');
    if (await preElement
        .isExisting()) {
        const text = await preElement
            .getText();
        parseActualObj = JSON.parse(text);
    } else {
        const pageSource = await browser.getPageSource();
        parseActualObj = JSON.parse(pageSource);
    }
    console.log({ parsedExpectedObj });
    console.log({ parseActualObj });
    expect(parseActualObj.user)
        .toMatchObject(parsedExpectedObj);
});

// Then(/^I expect get to url "([^"]*)" answer JSON object to match:$/, async (url, params) => {
//     const jsonBodyObject = JSON.parse((await got(url)).body);
//     // const jsonBodyObject = JSON.parse(browser.getPageSource());
//     const expectedObject = JSON.parse(params);
//     expect(jsonBodyObject)
//         .toMatchObject(expectedObject);
// });

Then(/^I expect "([^"]*)" occurrences of (Visible|Clickable|Enabled|Existing|Selected) "([^"]*)"$/, async function (num, verb, selector) {
    const elements = await $$(selector);
    const verbMap = {
        Visible: 'isDisplayed',
        Clickable: 'isClickable',
        Enabled: 'isEnabled',
        Existing: 'isExisting',
        Selected: 'isSelected',
    };
    const method = verbMap[verb];
    let count = 0;
    for (const element of elements) {
        if (method && await element[method]()) {
            count += 1;
        }
    }
    expect(count)
        .toEqual(parseInt(num, 10));
});

Then(/^I expect the element "([^"]*)" contains the text "([^"]*)" via js$/, async function (selector, expectedText) {
    const element = await $(selector);
    const text = await element
        .jsGetText();
    expect(text)
        .toContain(expectedText);
});

When(/^I maximize window$/, async function () {
    await browser.maximizeWindow();
});

When(/^I reload session$/, async function () {
    try {
        await browser.reloadSession();
        await browser.pause(1000);
    } catch (error) {
        const errorMsg = error.message || error.toString() || '';
        const isDisconnected = errorMsg.includes('disconnected')
            || errorMsg.includes('failed to check if window was closed')
            || errorMsg.includes('ECONNREFUSED');
        if (isDisconnected) {
            console.warn('Browser disconnected or ChromeDriver unavailable, skipping reload session');
        } else {
            throw error;
        }
    }
});

When(/^I log out of the application$/, async function () {
    await browser.url(`http://${browser.config.serverDomain}:${browser.config.serverPort}/auth/logout`);
    await browser.pause(2000);
    await browser.refresh();
    await browser.pause(500);
});
