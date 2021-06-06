const hasha = require('hasha');
const YAML = require('yaml');
const { spawn } = require('child_process');
const got = require('got');
const frisby = require('frisby');
const fs = require('fs');
const { Given, When, Then } = require('cucumber');
const { getDomDump } = require('@syngrisi/syngrisi-wdio-sdk');
const VRSDriver = require('@syngrisi/syngrisi-wdio-sdk').vDriver;
const checkVRS = require('../../src/support/check/checkVrs').default;
const waitForAndRefresh = require('../../src/support/action/waitForAndRefresh').default;
const { startSession } = require('../../src/utills/common');

const { saveRandomImage } = require('../../src/utills/common');
const { TableVRSComp } = require('../../src/PO/vrs/tableVRS.comp');

Given(/^I setup VRS driver with parameters:$/, async (params) => {
    const drvOpts = YAML.parse(params);
    browser.vDriver = new VRSDriver({
        url: drvOpts.url,
    });
});

Given(/^I start VRS session with parameters:$/, async (params) => {
    const sessOpts = YAML.parse(params);
    await startSession(sessOpts);
});

// for debug purposes ONLY
Given(/^I update the VRStest$/, async () => {
    await browser.vDriver.updateTest();
});

Given(/^I stop VRS session$/, async () => {
    await browser.vDriver.stopTestSession(browser.config.apiKey);
});

When(/^I start VRS server with parameters:$/, { timeout: 600000 }, (params) => {
    const srvOpts = YAML.parse(params);

    // const cmdPath = browser.config.rootPath + '/vrs/';
    const cmdPath = '../';
    const env = Object.create(process.env);
    env.VRS_PORT = srvOpts.port;
    env.VRS_BASELINE_PATH = srvOpts.baseLineFolder;
    env.VRS_CONN_STRING = `mongodb://localhost/${srvOpts.databaseName}`;
    // env.PAGE_SIZE = srvOpts.pageSize || '10';
    const homedir = require('os')
        .homedir();
    const nodePath = process.env.OLTA_NODE_PATH || (`${homedir}/.nvm/versions/node/v13.13.0/bin`);
    const child = spawn(`${nodePath}/npm`,
        ['run', 'starttest', '-g', '--prefix', cmdPath], { env });

    const startDate = new Date() / 1;
    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (data) => {
        console.log(`#: ${data}`);
        // fs.appendFileSync(`./.tmp/syngrisi_out.txt`, data);
    });

    child.stderr.setEncoding('utf8');
    child.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
        // fs.appendFileSync(`./.tmp/syngrisi_err.txt`, data);
    });

    browser.pause(2500);
    browser.waitUntil(async () => (await got.get(`http://vrs:${srvOpts.port}/`, { throwHttpErrors: false })).statusCode === 200);
    browser.syngrisiServer = child;
});

When(/^I clear test VRS database$/, () => {
    // const cmdPath = browser.config.rootPath + '/vrs/';
    const cmdPath = '../';
    const homedir = require('os')
        .homedir();
    const nodePath = process.env.OLTA_NODE_PATH || (`${homedir}/.nvm/versions/node/v13.13.0/bin`);
    const child = spawn(`${nodePath}/npm`,
        ['run', 'clear_test', '-g', '--prefix', cmdPath]);
});

When(/^I kill process which used port: "([^"]*)"$/, (port) => {
    const { execSync } = require('child_process');
    const lSoftOut = false;
    browser.waitUntil(() => {
        console.log(`Try to kill apps on port: '${port}'`);
        let pidsString;
        try {
            pidsString = execSync(`lsof -t -i:${port} -sTCP:LISTEN`)
                .toString()
                .trim();
        } catch (e) {
            console.log(e.stdout.toString());
            console.log(e.stderr.toString());
        }
        if (pidsString) {
            try {
                for (const pid of pidsString.split('\n')) {
                    console.log({ pid });
                    process.kill(pid);
                }
                return true;
            } catch (e) {
                console.error(`Cannot kill process: '${e}'`);
                return false;
            }
        } else {
            return true;
        }
    }, {
        timeout: 40000,
    });
});

When(/^I click on "([^"]*)" VRS test$/, (testName) => {
    TableVRSComp.init();

    TableVRSComp.data.filter((row) => row.name.$('span[name=cell-name]')
        .getText()
        .includes(testName))[0].name
        .click();
});

When(/^I expect that(:? (\d)th)? VRS test "([^"]*)" has "([^"]*)" (status|browser|platform|viewport|accepted status)$/,
    (number, testName, fieldValue, fieldName) => {
        const intNumber = number ? parseInt(number) : 1;
        TableVRSComp.init();
        const row = TableVRSComp.data.filter((row) => row.name.$('span[name=cell-name]')
            .getText()
            .includes(testName))[intNumber - 1];

        TableVRSComp.data.forEach((x) => {
            console.log({ NAME: x.name.getText() });
        });
        // console.log(row[fieldName].getHTML());
        expect(row[fieldName].$('span'))
            .toHaveTextContaining(fieldValue);
        if (fieldName === 'status') {
            const statusClasses = {
                Running: {
                    text: 'text-info',
                },
                New: {
                    text: 'text-success',
                },
                Passed: {
                    text: 'text-success',
                },
                Failed: {
                    text: 'text-danger',
                },
            };
            expect(row.status.$('span'))
                .toHaveAttributeContaining('class', statusClasses[fieldValue].text);
        }
    });
When(/^I expect that(:? (\d)th)? VRS test "([^"]*)" has blink icon$/,
    (number, testName) => {
        const intNumber = number ? parseInt(number) : 1;
        TableVRSComp.init();
        const row = TableVRSComp.data.filter((row) => row.name.$('span[name=cell-name]')
            .getText()
            .includes(testName))[intNumber - 1];
        expect(row.name.$('img'))
            .toHaveAttributeContaining('class', 'blink-icon');
    });

Then(/^I expect that VRS check "([^"]*)" has "([^"]*)" status$/, (checkName, expectedStatus) => {
    expect($(`.//div[contains(normalize-space(.), '${checkName}')]/../..`))
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

Then(/^I expect that(:? (\d)th)? VRS test "([^"]*)" is unfolded$/, (number, testName) => {
    const intNumber = number ? parseInt(number) : 1;
    const row = TableVRSComp.data.filter((row) => row.name.$('span[name=cell-name]')
        .getText() === testName)[intNumber - 1];
    console.log({ row });
    const nameCell = row.name.$('span');
    const foldDiff = nameCell.$('./../../../../../..//div[contains(@class, \'all-checks\')]');
    expect(foldDiff)
        .toHaveAttributeContaining('class', 'show');
});

When(/^I create new VRS Test with:$/, async function (yml) {
    const params = YAML.parse(yml);

    const form = frisby.formData();
    for (const key in params.params) {
        form.append(key, params.params[key]);
    }
    const response = await frisby.post(params.url, { body: form });
    console.log(response.json);
    this.saveItem('VRSTestResponse', response);
});

Given(/^I create new VRS Check with:$/, async function (yml) {
    const params = YAML.parse(yml);
    const form = frisby.formData();
    for (const key in params.params) {
        form.append(key, params.params[key]);
    }
    const testResp = await this.getSavedItem('VRSTestResponse');
    console.log(testResp);
    form.append('testid', testResp.json._id);

    const imageData = fs.readFileSync(params.hashFilePath);
    form.append('hashcode', hasha(imageData));

    if (params.file) {
        form.append('file', fs.createReadStream(params.file));
    }

    const response = await frisby.post(params.url, { body: form });
    const resp = response.json;
    resp.statusCode = response.status;
    this.saveItem('VRSCheck', resp);
});

Given(/^I generate a random image "([^"]*)"$/, async (filePath) => {
    await saveRandomImage(filePath);
});

When(/^I parse all affected elements in current and last successful checks from "([^"]*)"$/, async function (baseurl) {
    const result = this.getSavedItem('checkDumpResult');
    console.log(result);
    const affectResp = await got(`${baseurl}affectedelements?checktid=${result._id}&diffid=${result.diffId}`,
        { headers: { apikey: browser.config.apiKey } });
    const prevAffectResp = await got(`${baseurl}affectedelements?checktid=${result.lastSuccess}&diffid=${result.diffId}`,
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

When(/^I set env variables:$/, (yml) => {
    const params = YAML.parse(yml);
    for (const key in params) {
        process.env[key] = params[key];
    }
});

When(/^I check image with path: "([^"]*)" as "([^"]*)"$/, async function (filePath, checkName) {
    browser.pause(300);
    const imageBuffer = fs.readFileSync(`${browser.config.rootPath}/${filePath}`);
    const checkResult = await checkVRS(checkName, imageBuffer);
    this.STATE.check = checkResult;
});
When(/^I create "([^"]*)" tests with params:$/, { timeout: 60000000 }, async function (num, yml) {
    const params = YAML.parse(yml);

    browser.vDriver.setCurrentSuite({
        name: 'Integration suite',
        id: 'Integration_suite',
    });

    for (const i of Array.from(Array(parseInt(num))
        .keys())) {
        console.log(`Create test # ${i}`);
        await browser.vDriver.startTestSession({
            app: 'Test App',
            test: `${params.testName} - ${i + 1}`,
            run: process.env.RUN_NAME || 'integration_run_name',
            runident: process.env.RUN_IDENT || 'integration_run_ident',
        }, browser.config.apiKey);
        browser.pause(300);
        const imageBuffer = fs.readFileSync(`${browser.config.rootPath}/${params.filePath}`);
        const checkName = params.checkName || `Check - ${Math.random()
            .toString(36)
            .substring(7)}`;
        const checkResult = await checkVRS(checkName, imageBuffer);
        this.STATE.check = checkResult;
        await browser.vDriver.stopTestSession(browser.config.apiKey);
    }
});

When(/^I visually check page with DOM as "([^"]*)"$/, async function (checkName) {
    let domDump;
    domDump = await browser.executeAsync(getDomDump);
    browser.pause(300);
    const imageBuffer = new Buffer((await browser.saveDocumentScreenshot()), 'base64');
    const checkResult = await checkVRS(checkName, imageBuffer, domDump);
    console.log(checkResult);
    this.saveItem('checkDump', JSON.parse(checkResult.domDump)[0]);
    this.saveItem('checkDumpResult', checkResult);
});

When(/^I execute javascript code:$/, function (js) {
    const result = browser.execute(js);
    this.saveItem('js', result);
});

Then(/^I expect "([^"]*)" saved object:$/, function (itemName, yml) {
    const params = YAML.parse(yml);
    const item = this.getSavedItem(itemName);
    expect(item)
        .toMatchObject(params);
});

Given(/^I set window size: "(1366x768|712x970|880x768|1050x768|1300x768|1300x400|1700x768|500x500)"$/, (viewport) => {
    const size = viewport.split('x');
    browser.setWindowSize(parseInt(size[0]), parseInt(size[1]));
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

Then(/^the "([^"]*)" "([^"]*)" should be "([^"]*)"$/, function (itemType, property, exceptedValue) {
    expect(this.STATE[itemType][property].toString())
        .toEqual(exceptedValue);
});

When(/^I wait and refresh page on element "([^"]*)" for "([^"]*)" seconds to( not)* (exist)$/, { timeout: 600000 },
    waitForAndRefresh);

When(/^I START DEBUGGER$/, { timeout: 6000000 }, () => {
    browser.debug();
});

When(/^I refresh page$/, () => {
    browser.refresh();
});

When(/^I wait for "([^"]*)" seconds$/, { timeout: 600000 }, (sec) => {
    browser.pause(sec * 1000);
});

Then(/^I expect the stored "([^"]*)" object is( not|) equal:$/, function (itemName, condition, expected) {
    const itemValue = this.getSavedItem(itemName);
    console.log('Expect:', expected.trim());
    console.log('Stored:', itemValue.trim());
    if (condition === ' not') {
        expect(itemValue.trim())
            .not
            .toEqual(expected.trim());
    } else {
        expect(itemValue.trim())
            .toEqual(expected.trim());
    }
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

Then(/^the current url contains "([^"]*)"$/, (url) => {
    const windowHandles = browser.getWindowHandles();
    const lastWindowHanle = windowHandles[windowHandles.length - 1];
    browser.switchToWindow(lastWindowHanle);
    expect(browser)
        .toHaveUrl(url, { containing: true });
});

Then(/^I expect "([^"]*)" occurrences of (Visible|Clickable|Enabled|Existig|Selected) "([^"]*)"$/, (num, verb, selector) => {
    const actualNum = $$(selector)
        .filter((el) => el[`is${verb}`]()).length;
    expect(actualNum)
        .toEqual(parseInt(num));
});

When(/^I visually check page as "([^"]*)"$/, { timeout: 180000 }, async function (checkName) {
    browser.pause(300);
    const imageBuffer = new Buffer((await browser.saveDocumentScreenshot()), 'base64');
    const checkResult = await checkVRS(checkName, imageBuffer);
    this.saveItem('checkResult', checkResult);
});

Given(/^I set custom window size: "([^"]*)"$/, (viewport) => {
    const size = viewport.split('x');
    browser.setWindowSize(parseInt(size[0]), parseInt(size[1]));
});

Then(/^I expect that element "([^"]*)" is clickable$/, (selector) => {
    expect($(selector))
        .toBeClickable();
});

Then(/^I expect get to url "([^"]*)" answer JSON object to match:$/, async (url, params) => {
    const jsonBodyObject = JSON.parse((await got(url)).body);
    // const jsonBodyObject = JSON.parse(browser.getPageSource());
    const expectedObject = JSON.parse(params);
    expect(jsonBodyObject)
        .toMatchObject(expectedObject);
});

Then(/^I expect "([^"]*)" tests for get url "([^"]*)"$/, async (testsNum, url) => {
    const jsonBodyObject = JSON.parse((await got(url)).body);
    // console.log({jsonBodyObject});
    expect(Object.keys(jsonBodyObject).length)
        .toBe(parseInt(testsNum));
});

When(/^I check image with path: "([^"]*)" as "([^"]*)" and suppress exceptions$/, async function (filePath, checkName) {
    try {
        browser.pause(300);
        const imageBuffer = fs.readFileSync(`${browser.config.rootPath}/${filePath}`);
        const checkResult = await checkVRS(checkName, imageBuffer);
        this.STATE.check = checkResult;
    } catch (e) {
        this.STATE.check = { error: e };
        this.saveItem('error', e.message);
    }
});

When(/^I login with user:"([^"]*)" password "([^"]*)"$/, (login, password) => {
    $('#password')
        .waitForDisplayed();
    $('#email')
        .setValue(login);
    $('#password')
        .setValue(password);
    $('button*=Login')
        .click();
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

When(/^I stop the Syngrisi server$/, () => {
    browser.syngrisiServer.kill();
});

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
    $(`.//div[contains(normalize-space(.), '${checkName}') and @name='check-name']/../../../..//a[contains(@class, 'remove-button')]`)
        .click();
    browser.pause(200);
    $(`.//div[contains(normalize-space(.), '${checkName}') and @name='check-name']/../div[@name='check-buttons']//a[contains(@class, 'remove-option')]`)
        .click();
});

When(/^I expect the "([^"]*)" check has "([^"]*)" acceptance status$/, (checkName, acceptStatus) => {
    const acceptStatusMap = {
        accept: 'accepted-button-icon',
        'not accept': 'not-accepted-button-icon',
    };

    // eslint-disable-next-line max-len
    const icon = $(`.//div[contains(normalize-space(.), '${checkName}') and @name='check-name']/../../../..//a[contains(@class, 'accept-button')]/i`);

    expect(icon)
        .toHaveAttrContaining('class', acceptStatusMap[acceptStatus]);
});

Then(/^I expect that last "([^"]*)" checks with ident contains "([^"]*)" has (not |)the same "([^"]*)"$/, async function (num, ident, negative, prop) {
    const checksGroups = JSON.parse((await got('http://vrs:3001/checks')).body);
    console.log({ checksGroups });
    const checks = Object.values(checksGroups)
        .map((x) => {
            const identKey = Object.keys(x)
                .filter(x => x.startsWith('ident'))[0];
            console.log({ x });
            console.log({ identKey });
            const identParts = identKey.split('.');
            identParts.pop();
            const cuttedIdent = identParts.join('.');
            x[cuttedIdent] = x[identKey];
            return x;
        });
    console.log({ checks });
    const values = checks.map((x) => x[ident].checks)
        .flat()
        .slice(0, num)
        .map((x) => x.[prop]);
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

When(/^I parse the API key$/, function () {
    const apiKey = $('#notification-textarea')
        .getValue();
    this.saveItem('apiKey', apiKey);
});

When(/^I set the API key in config$/, function () {
    browser.config.apiKey = this.getSavedItem('apiKey');
});

Then(/^I expect that "([^"]*)" check has Created "([^"]*)" equal to "([^"]*)"$/, function (checkNum, field, value) {
    const checkTitle = $(`(//div[@name='preview-container'])[${checkNum}]`)
        .getAttribute('title');

    const regex = new RegExp(`${field}: (.+?$)`, `gm`);
    // const regex = new RegExp(`${field}`, `gm`);
    const match = regex.exec(checkTitle);
    expect(match[1])
        .toContain(value);
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
