/* eslint-disable */
const hasha = require('hasha');
const YAML = require('yaml');
const { spawn, execSync, } = require('child_process');
const got = require('got');
const frisby = require('frisby');
const path = require('path');
const fs = require('fs');
const { Given, When, Then, } = require('cucumber');
const { getDomDump } = require('@syngrisi/syngrisi-wdio-sdk');
const SyngrisiDriver = require('@syngrisi/syngrisi-wdio-sdk').SyngrisiDriver;
const checkVRS = require('../src/support/check/checkVrs').default;
const waitForAndRefresh = require('../src/support/action/waitForAndRefresh').default;
const { startSession, killServer, startDriver } = require('../src/utills/common');

const {
    saveRandomImage,
    fillCommonPlaceholders,
} = require('../src/utills/common');
const { TableVRSComp } = require('../src/PO/vrs/tableVRS.comp');

const { requestWithLastSessionSid } = require('../src/utills/common');

// for debug purposes ONLY
Given(/^I update the VRStest$/, async () => {
    await browser.vDriver.updateTest();
});

When(/^I get all affected elements in current and last successful checks from the server$/, async function () {
    const result = this.getSavedItem('checkDumpResult');
    console.log({ result });
    const uri = `${browser.config.syngrisiUrl}affectedelements?checktid=${result._id}&diffid=${result.diffId}`;
    console.log({ uri });
    const affectResp = await got(uri, { headers: { apikey: browser.config.apiKey } });
    const prevAffectResp = await got(`${browser.config.syngrisiUrl}affectedelements?checktid=${result.lastSuccess}&diffid=${result.diffId}`,
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
    let domDump;
    domDump = await browser.executeAsync(getDomDump);
    browser.pause(300);
    const imageBuffer = new Buffer((await browser.saveDocumentScreenshot()), 'base64');
    const checkResult = await checkVRS(checkName, imageBuffer, domDump);
    console.log({ checkResult });
    this.saveItem('checkDump', JSON.parse(checkResult.domDump)[0]);
    this.saveItem('checkDumpResult', checkResult);
});

When(/^I assert image with path: "([^"]*)" as "([^"]*)"$/, async function (filePath, checkName) {
    browser.pause(300);
    const imageBuffer = fs.readFileSync(`${browser.config.rootPath}/${filePath}`);
    const checkResult = await checkVRS(checkName, imageBuffer);
    this.STATE.check = checkResult;
    try {
        expect(checkResult.status[0] === 'new' || checkResult.status[0] === 'passed')
            .toBeTruthy();
    } catch (e) {
        throw new e.constructor(`${e.message}  \ncheck status is: '${checkResult.status[0]}', expected 'new' or 'passed'
                \n Result: '${JSON.stringify(checkResult)}'`);
    }
});

When(/^I visually check page as "([^"]*)"$/, { timeout: 180000 }, async function (checkName) {
    browser.pause(300);
    const imageBuffer = new Buffer((await browser.saveDocumentScreenshot()), 'base64');
    const checkResult = await checkVRS(checkName, imageBuffer);
    this.saveItem('checkResult', checkResult);
});

Then(/^I expect "([^"]*)" tests for get url "([^"]*)"$/, async (testsNum, url) => {
    const jsonBodyObject = JSON.parse((await got(url)).body);
    // console.log({jsonBodyObject});
    expect(Object.keys(jsonBodyObject).length)
        .toBe(parseInt(testsNum));
});

When(/^I login with user:"([^"]*)" password "([^"]*)"$/, (login, password) => {
    browser.url(`http://${browser.config.serverDomain}:${browser.config.serverPort}/`);
    browser.pause(2000);
    $('#password')
        .waitForDisplayed();
    $('#email')
        .setValue(login);
    $('#password')
        .setValue(password);
    $('button*=Login')
        .click();
});

Then(/^I expect ([\d]+) baselines$/, function (num) {
    browser.url('http://vrs:3001/baselines');
    const baselines = JSON.parse($('pre')
        .getHTML(false));
    expect(baselines.length)
        .toBe(parseInt(num, 10));
});

Then(/^I expect ([\d]+)st baseline with:$/, function (num, yml) {
    browser.url('http://vrs:3001/baselines');
    const baselines = JSON.parse($('pre')
        .getHTML(false));
    console.log({ baselines });

    const params = YAML.parse(yml);
    const baseline = baselines[parseInt(num) - 1];
    baseline.markedByUsername = baseline.markedByUsername || '';
    baseline.markedAs = baseline.markedAs || '';
    expect(baseline)
        .toMatchObject(params);
});

When(/^I select the test "([^"]*)"$/, function (testName) {
    $(`//span[normalize-space(text())='${testName}']/../../..//input`)
        .click();
});

Then(/^I expect the (\d)st "([^"]*)" check has "([^"]*)" acceptance status$/, function (num, checkName, acceptStatus) {
    const acceptStatusMap = {
        accept: 'accepted-button-icon',
        'previously accept': 'prev-accepted-button-icon',
        'not accept': 'not-accepted-button-icon',
    };
    const icon = $(`(.//div[contains(normalize-space(.), '${checkName}') and @name='check-name']/../../../..//a[contains(@class, 'accept-button')]/i)[${num}]`);

    const classesList = icon
        .getAttribute('class')
        .split(' ');

    expect(classesList)
        .toContain(
            acceptStatusMap[acceptStatus]
        );

    const wrongStatuses = Object.keys(acceptStatusMap)
        .filter(x => x !== acceptStatus);
    console.log({ wrongStatuses });

    for (const wrongStatus of wrongStatuses) {
        expect(classesList)
            .not
            .toContain(
                acceptStatusMap[wrongStatus]
            );
    }
});

Then(/^I expect that the element "([^"]*)" to have attribute "([^"]*)" containing "([^"]*)"$/, function (selector, attr, value) {
    const value2 = fillCommonPlaceholders(value);
    expect($(selector))
        .toHaveAttrContaining(attr, value2);
});

async function getWithLastSessionSid(uri, $this) {
    // console.log({ uri });
    const sessionSid = $this.getSavedItem('lastSessionId');
    // console.log({ sessionSid });

    const res = await got.get(`${uri}`, {
        'headers': {
            'cookie': `connect.sid=${sessionSid}`
        },
    });
    return {
        raw: res,
        json: JSON.parse(res.body)
    };
}

// COMMON
When(/^I click on the element "([^"]*)" via js$/, function (selector) {
    $(selector)
        .jsClick();
});

Then(/^I expect HTML( does not|) contains:$/, function (mode, text) {
    if (mode === '') {
        const source = browser
            .getPageSource();
        expect(source)
            .toContain(text);
    }
    const source = browser
        .getPageSource();
    expect(source)
        .not
        .toContain(text);
});

When(/^I wait and refresh page on element "([^"]*)" for "([^"]*)" seconds to( not)* (exist)$/, { timeout: 600000 },
    waitForAndRefresh);

When(/^I START DEBUGGER$/, { timeout: 6000000 }, () => {
    browser.debug();
});

When(/^I wait for "([^"]*)" seconds$/, { timeout: 600000 }, (sec) => {
    browser.pause(sec * 1000);
});

Given(/^I set window size: "(1366x768|712x970|880x768|1050x768|1300x768|1300x400|1700x768|500x500)"$/, (viewport) => {
    const size = viewport.split('x');
    browser.setWindowSize(parseInt(size[0]), parseInt(size[1]));
});

Given(/^I generate a random image "([^"]*)"$/, async (filePath) => {
    await saveRandomImage(filePath);
});

Then(/^the "([^"]*)" "([^"]*)" should be "([^"]*)"$/, function (itemType, property, exceptedValue) {
    expect(this.STATE[itemType][property].toString())
        .toEqual(exceptedValue);
});

When(/^I expect that element "([^"]*)" to (contain|have) text "([^"]*)"$/, (selector, matchCase, text) => {
    const filledText = text;
    if (matchCase === 'contains') {
        expect($(selector))
            .toHaveTextContaining(filledText);
    } else {
        expect($(selector))
            .toHaveText(filledText);
    }
});

Given(/^I set custom window size: "([^"]*)"$/, (viewport) => {
    const size = viewport.split('x');
    browser.setWindowSize(parseInt(size[0]), parseInt(size[1]));
});

Then(/^I expect that element "([^"]*)" is clickable$/, (selector) => {
    expect($(selector))
        .toBeClickable();
});

When(/^I expect that element "([^"]*)" contain value "([^"]*)"$/, (selector, val) => {
    const actualValue = $(selector)
        .getValue();
    // console.log({ actualValue });
    expect(actualValue)
        .toContain(val);
});

When(/^I expect that element "([^"]*)" contain text "([^"]*)"$/, (selector, val) => {
    const actualValue = $(selector)
        .getText();
    console.log({ actualValue });
    expect(actualValue)
        .toContain(val);
});

Then(/^page source match:$/, (source) => {
    const parsedExpectedObj = JSON.parse(source);
    let parseActualdObj = {};
    if ($('pre')
        .isExisting()) {
        parseActualdObj = JSON.parse($('pre')
            .getText());
    } else {
        parseActualdObj = JSON.parse(browser.getPageSource());
    }
    console.log({ parsedExpectedObj });
    console.log({ parseActualdObj });
    expect(parseActualdObj.user)
        .toMatchObject(parsedExpectedObj);
});

// Then(/^I expect get to url "([^"]*)" answer JSON object to match:$/, async (url, params) => {
//     const jsonBodyObject = JSON.parse((await got(url)).body);
//     // const jsonBodyObject = JSON.parse(browser.getPageSource());
//     const expectedObject = JSON.parse(params);
//     expect(jsonBodyObject)
//         .toMatchObject(expectedObject);
// });

Then(/^I expect "([^"]*)" occurrences of (Visible|Clickable|Enabled|Existig|Selected) "([^"]*)"$/, (num, verb, selector) => {
    const actualNum = $$(selector)
        .filter((el) => el[`is${verb}`]()).length;
    expect(actualNum)
        .toEqual(parseInt(num));
});

Then(/^I expect the element "([^"]*)" contains the text "([^"]*)" via js$/, function (selector, expectedText) {
    const text = $(selector)
        .jsGetText();
    expect(text)
        .toContain(expectedText);
});
