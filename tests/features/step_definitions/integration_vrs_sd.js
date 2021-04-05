const hasha = require('hasha');
const YAML = require('yaml');
const {spawn} = require('child_process');
const got = require('got');
const frisby = require('frisby');
const fs = require('fs');
const {Given, When, Then} = require('cucumber');
const {getDomDump} = require('@syngrisi/syngrisi-wdio-sdk');
const checkVRS = require('../../src/support/check/checkVrs').default;
const waitForAndRefresh = require('../../src/support/action/waitForAndRefresh').default;

const saveRandomImage = require('../../src/utills/common').saveRandomImage;
const VRSDriver = require('@syngrisi/syngrisi-wdio-sdk').vDriver;
const TableVRSComp = require('../../src/PO/vrs/tableVRS.comp').TableVRSComp;

Given(/^I setup VRS driver with parameters:$/, async function (params) {
    const drvOpts = YAML.parse(params);
    browser.vDriver = new VRSDriver({
        url: drvOpts.url
    });
});

Given(/^I start VRS session with parameters:$/, async function (params) {
    const sessOpts = YAML.parse(params);
    sessOpts.suiteName = sessOpts.suiteName || 'Integration suite';
    sessOpts.suiteId = sessOpts.suiteId || sessOpts.suiteName.replace(' ', '_');
    sessOpts.appName = sessOpts.appName || 'Integration Test App';

    const currentSuite = {
        name: sessOpts.suiteName || 'Integration suite',
        id: sessOpts.suiteId || sessOpts.suiteName.replace(' ', '_')
    };

    if ((sessOpts.suiteName !== 'EMPTY')) {
        browser.vDriver.setCurrentSuite(currentSuite);
    }

    await browser.vDriver.startTestSession({
        app: sessOpts.appName,
        test: sessOpts.testName,
        run: process.env['RUN_NAME']
    });
});

// for debug purposes ONLY
Given(/^I update the VRStest$/, async function () {
    await browser.vDriver.updateTest();
});

Given(/^I stop VRS session$/, async function () {
    await browser.vDriver.stopTestSession();
});

When(/^I start VRS server with parameters:$/, function (params) {
    const srvOpts = YAML.parse(params);

    // const cmdPath = browser.config.rootPath + '/vrs/';
    const cmdPath = '../';
    let env = Object.create(process.env);
    env.VRS_PORT = srvOpts.port;
    env.VRS_BASELINE_PATH = srvOpts.baseLineFolder;
    env.VRS_CONN_STRING = `mongodb://localhost/${srvOpts.databaseName}`;
    const homedir = require('os')
        .homedir();
    const nodePath = process.env['OLTA_NODE_PATH'] || (homedir + '/.nvm/versions/node/v13.13.0/bin');
    let child = spawn(nodePath + '/npm',
        ['run', 'startdebug', '-g', '--prefix', cmdPath], {env: env});
    browser.waitUntil(async function () {
        return (await got.get(`http://vrs:${srvOpts.port}/`, {throwHttpErrors: false})).statusCode === 200;
    });

    this.STATE.vrsPid = child.pid;
});

When(/^I clear test VRS database$/, function () {
    // const cmdPath = browser.config.rootPath + '/vrs/';
    const cmdPath = '../';
    const homedir = require('os')
        .homedir();
    const nodePath = process.env['OLTA_NODE_PATH'] || (homedir + '/.nvm/versions/node/v13.13.0/bin');
    let child = spawn(nodePath + '/npm',
        ['run', 'clear_test', '-g', '--prefix', cmdPath]);
});


When(/^I kill process which used port: "([^"]*)"$/, function (port) {
    const execSync = require('child_process').execSync;
    let lSoftOut = false;
    browser.waitUntil(function () {
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
                    console.log({pid});
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
        timeout: 40000
    });

});

When(/^I click on "([^"]*)" VRS test$/, function (testName) {
    TableVRSComp.init();
    TableVRSComp.data.filter(row => row.name.getText() === testName)[0].name.$('a')
        .click();
});

When(/^I expect that(:? (\d)th)? VRS test "([^"]*)" has "([^"]*)" (status|browser|platform|viewport)$/,
    function (number, testName, fieldValue, fieldName) {
        const intNumber = number ? parseInt(number) : 1;
        TableVRSComp.init();
        const row = TableVRSComp.data.filter(row => row.name.getText() === testName)[intNumber - 1];
        expect(row[fieldName].$('span'))
            .toHaveTextContaining(fieldValue);
        if (fieldName === 'status') {
            const statusClasses = {
                Running: {
                    text: 'text-info'
                },
                New: {
                    text: 'text-success'
                },
                Passed: {
                    text: 'text-success'
                },
                Failed: {
                    text: 'text-danger'
                }
            };
            expect(row['status'].$('span'))
                .toHaveAttributeContaining('class', statusClasses[fieldValue].text);
        }
    }
);
When(/^I expect that(:? (\d)th)? VRS test "([^"]*)" has blink icon$/,
    function (number, testName) {
        const intNumber = number ? parseInt(number) : 1;
        TableVRSComp.init();
        const row = TableVRSComp.data.filter(row => row.name.getText() === testName)[intNumber - 1];
        expect(row['status'].$('img'))
            .toHaveAttributeContaining('class', 'blink-icon');
    }
);

Then(/^I expect that VRS check "([^"]*)" has "([^"]*)" status$/, function (checkName, expectedStatus) {
    expect($(`.//div[contains(normalize-space(.), '${checkName}')]/../..`))
        .toBeExisting();

    // const border = $("div.all-checks.show").$("div.check-mini-toolbar").$(`.//div[contains(., '${checkName}')]/../..`);
    const border = $(`.//div[contains(normalize-space(.), '${checkName}') and @name='check-name']/../../..`);
    const classStatuses = {
        New: 'bg-info',
        Passed: 'bg-success',
        Failed: 'bg-danger',
        Blinking: 'bg-warning'
    };
    expect(border)
        .toHaveAttrContaining('class', classStatuses[expectedStatus]);
});

Then(/^I expect that(:? (\d)th)? VRS test "([^"]*)" is unfolded$/, function (number, testName) {
    const intNumber = number ? parseInt(number) : 1;
    const row = TableVRSComp.data.filter(row => row.name.getText() === testName)[intNumber - 1];
    const nameCell = row['name'].$('span');
    const foldDiff = nameCell.$('.//../../../../div[contains(@class, \'all-checks\')]');
    expect(foldDiff)
        .toHaveAttributeContaining('class', 'show');
});

When(/^I create new VRS Test with:$/, async function (yml) {
    const params = YAML.parse(yml);

    let form = frisby.formData();
    for (const key in params.params) {
        form.append(key, params.params[key]);
    }
    const response = await frisby.post(params.url, {body: form});
    console.log(response.json);
    this.saveItem('VRSTestResponse', response);

});

Given(/^I create new VRS Check with:$/, async function (yml) {
    const params = YAML.parse(yml);
    let form = frisby.formData();
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

    const response = await frisby.post(params.url, {body: form});
    let resp = response.json;
    resp.statusCode = response.status;
    this.saveItem('VRSCheck', resp);
});

Given(/^I generate a random image "([^"]*)"$/, async function (filePath) {
    await saveRandomImage(filePath);
});

When(/^I parse all affected elements in current and last successful checks from "([^"]*)"$/, async function (baseurl) {
    const result = this.getSavedItem('checkDumpResult');
    console.log(result);
    const affectResp = await got(`${baseurl}affectedelements?checktid=${result._id}&diffid=${result.diffId}`);
    const prevAffectResp = await got(`${baseurl}affectedelements?checktid=${result.lastSuccess}&diffid=${result.diffId}`);
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

When(/^I set env variables:$/, function (yml) {
    const params = YAML.parse(yml);
    for (const key in params) {
        process.env[key] = params[key];
    }
});

When(/^I check image with path: "([^"]*)" as "([^"]*)"$/, async function (filePath, checkName) {
    browser.pause(300);
    const imageBuffer = fs.readFileSync(browser.config.rootPath + '/' + filePath);
    const checkResult = await checkVRS(checkName, imageBuffer);
    this.STATE.check = checkResult;
});

When(/^I check image with path: "([^"]*)" as "([^"]*)" and suppress exceptions$/, async function (filePath, checkName) {
    try {
        browser.pause(300);
        const imageBuffer = fs.readFileSync(browser.config.rootPath + '/' + filePath);
        const checkResult = await checkVRS(checkName, imageBuffer);
        this.STATE.check = checkResult;
    } catch (e) {
        this.STATE.check = {error: e};
        this.saveItem('error', e.message);
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


Given(/^I set window size: "(1366x768|712x970|880x768|1050x768|1300x768|1700x768|500x500)"$/, function (viewport) {
    const size = viewport.split('x');
    browser.setWindowSize(parseInt(size[0]), parseInt(size[1]));
});

When(/^I assert image with path: "([^"]*)" as "([^"]*)"$/, async function (filePath, checkName) {
    browser.pause(300);
    const imageBuffer = fs.readFileSync(browser.config.rootPath + '/' + filePath);
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

When(/^I wait and refresh page on element "([^"]*)" for "([^"]*)" seconds to( not)* (exist)$/, {timeout: 600000},
    waitForAndRefresh
);

When(/^I start debugger$/, {timeout: 600000}, function () {
    browser.debug();
});

When(/^I refresh page$/, function () {
    browser.refresh();
});

When(/^I wait for "([^"]*)" seconds$/, {timeout: 600000}, function (sec) {
    browser.pause(sec * 1000);
});

Then(/^I expect the stored "([^"]*)" object is( not|) equal:$/, function (itemName, condition, expected) {
    const itemValue = this.getSavedItem(itemName);
    console.log('Expect:', expected.trim());
    console.log('Stored:', itemValue.trim());
    if (condition === ' not') {
        expect(itemValue.trim()).not.toEqual(expected.trim());
    } else {
        expect(itemValue.trim()).toEqual(expected.trim());
    }
});

When(/^I expect that element "([^"]*)" to (contain|have) text "([^"]*)"$/, function (selector, matchCase, text) {
    const filledText = text;
    if (matchCase === 'contains')
        expect($(selector)).toHaveTextContaining(filledText);
    else
        expect($(selector)).toHaveText(filledText);

});

Then(/^the current url contains "([^"]*)"$/, function (url) {
    const windowHandles = browser.getWindowHandles();
    const lastWindowHanle = windowHandles[windowHandles.length - 1];
    browser.switchToWindow(lastWindowHanle);
    expect(browser).toHaveUrl(url, {containing: true});
});

Then(/^I expect "([^"]*)" occurrences of (Visible|Clickable|Enabled|Existig|Selected) "([^"]*)"$/, function (num, verb, selector) {
    const actualNum = $$(selector).filter(el => el[`is${verb}`]()).length;
    expect(actualNum).toEqual(parseInt(num));
});

When(/^I visually check page as "([^"]*)"$/, {timeout: 180000}, async function (checkName) {
    browser.pause(300);
    const imageBuffer = new Buffer((await browser.saveDocumentScreenshot()), 'base64')
    const checkResult = await checkVRS(checkName, imageBuffer);
    this.saveItem('checkResult', checkResult)
});

Given(/^I set custom window size: "([^"]*)"$/, function (viewport) {
    const size = viewport.split('x');
    browser.setWindowSize(parseInt(size[0]), parseInt(size[1]));
});

Then(/^I expect that element "([^"]*)" is clickable$/, function (selector) {
    expect($(selector)).toBeClickable()
});
