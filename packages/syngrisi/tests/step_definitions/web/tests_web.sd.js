/* eslint-disable no-console,func-names,no-restricted-syntax,no-await-in-loop */
const { When, Then } = require('cucumber');
const YAML = require('yaml');
const fs = require('fs');
const { TableVRSComp } = require('../../src/PO/vrs/tableVRS.comp');
const { default: checkVRS } = require('../../src/support/check/checkVrs');
const { fillCommonPlaceholders } = require('../../src/utills/common');

When(/^I click on "([^"]*)" VRS test$/, (testName) => {
    TableVRSComp.init();
    TableVRSComp.data.filter((row) => row.name.$('span[name=cell-name]')
        .getText()
        .includes(testName))[0].name
        .click();
});

When(/^I expect that(:? (\d)th)? VRS test "([^"]*)" has "([^"]*)" (status|browser|platform|viewport|accepted status)$/,
    (number, testName, fieldValue, fieldName) => {
        const intNumber = number ? parseInt(number, 10) : 1;
        TableVRSComp.init();
        const row = TableVRSComp.data.filter((r) => r.name.$('span[name=cell-name]')
            .getText()
            .includes(testName))[intNumber - 1];

        TableVRSComp.data.forEach((x) => {
            console.log({ EL: x.name.selector });
            console.log({ NAME: x.name.getText() });
        });
        const actualValue = row[fieldName].$('span')
            .jsGetText();
        const actualValue2 = actualValue.replace(/ [\[]HEADLESS[\]]/, '');
        expect(actualValue2)
            .toBe(fieldValue);
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

// eslint-disable-next-line max-len
When(/^I expect that(:? (\d)th)? test "([^"]*)" (has|contains) "([^"]*)" (status|browser|platform|viewport|accepted status|date|branch|created by|tags)$/,
    function (number, testName, method, fieldValue, fieldName) {
        number = number ? parseInt(number, 10) : 1;
        fieldValue = this.fillItemsPlaceHolders(fillCommonPlaceholders(fieldValue));
        console.log({ fieldValue });
        const row = $(`(//span[contains(text(),"${testName}")]/ancestor::div[@name="testinfo"])[${number}]`);
        const selectors = {
            status: '.cell-status',
            browser: 'span[name="browser-name"]',
            date: 'span[name="cell-date"]',
            viewport: 'span[name="cell-viewport"]',
            platform: '.cell-platform',
            branch: 'span.branch > a',
            'created by': 'div.cell-creator > div',
            'accepted status': 'div.cell-accepted-state > span',
            tags: '//div[@class=\'test-tags\']',
        };
        const selector = selectors[fieldName];
        if (!selector) {
            throw new Error('Selector is empty, you need extend the step definition logic');
        }
        const el = row.$(selector);
        if (fieldName === 'status') {
            const statusClasses = {
                Failed: 'bg-item-failed',
                Passed: 'bg-item-passed',
                Unresolved: 'bg-warning',
                Running: 'bg-item-running',
                New: 'bg-item-new',
            };
            expect(el)
                .toHaveAttributeContaining('class', statusClasses[fieldValue]);
            return;
        }
        if (fieldName === 'tags') {
            expect(el.getHTML()
                .includes(fieldValue))
                .toBeTruthy();
            return;
        }
        if (fieldName === 'platform') {
            expect(el)
                .toHaveAttributeContaining('title', fieldValue);
            return;
        }
        if (method === 'has') {
            expect(el)
                .toHaveText(fieldValue);
            return;
        }
        expect(el)
            .toHaveTextContaining(fieldValue);
    });

When(/^I expect that(:? (\d)th)? VRS test "([^"]*)" has blink icon$/,
    (number, testName) => {
        const intNumber = number ? parseInt(number, 10) : 1;
        TableVRSComp.init();
        const row = TableVRSComp.data.filter((r) => r.name.$('span[name=cell-name]')
            .getText()
            .includes(testName))[intNumber - 1];
        expect(row.name.$('img'))
            .toHaveAttributeContaining('class', 'blink-icon');
    });

Then(/^I expect that(:? (\d)th)? VRS test "([^"]*)" is unfolded$/, (number, testName) => {
    const intNumber = number ? parseInt(number, 10) : 1;
    const row = TableVRSComp.data.filter((r) => r.name.$('span[name=cell-name]')
        .getText() === testName)[intNumber - 1];
    const nameCell = row.name.$('span');
    const foldDiff = nameCell.$('./../../../../../..//div[contains(@class, \'all-checks\')]');
    expect(foldDiff)
        .toHaveAttributeContaining('class', 'show');
});

When(/^I create "([^"]*)" tests with params:$/, { timeout: 600000 }, async function (num, yml) {
    const params = YAML.parse(yml);

    let test;
    for (const i of Array.from(Array(parseInt(num, 10))
        .keys())) {
        // console.log(`Create test # ${i}`);
        test = await browser.vDriver.startTestSession({
            params: {
                app: params.appName || params.project || 'Test App',
                test: `${params.testName} - ${i + 1}`,
                run: params.run || process.env.RUN_NAME || 'integration_run_name',
                runident: params.runident || process.env.RUN_IDENT || 'integration_run_ident',
                branch: params.branch || 'integration',
                tags: params.tags || [],
                suite: params.suite || 'Integration suite',
            },
        });
        browser.pause(300);

        const filePath = params.filePath || 'files/A.png';
        const imageBuffer = fs.readFileSync(`${browser.config.rootPath}/${filePath}`);
        const checkName = params.checkName || `Check - ${Math.random()
            .toString(36)
            .substring(7)}`;
        const opts = {};
        if (params.vShifting) opts.vShifting = params.vShifting;
        const checkResult = await checkVRS(checkName, imageBuffer, opts);
        // console.log({ checkResult });
        // console.log({ test });
        this.STATE.test = test;
        this.STATE.currentCheck = checkResult;
        await browser.vDriver.stopTestSession();
    }
});

When(/^I create "([^"]*)" tests with:$/, { timeout: 60000000 }, async function (num, yml) {
    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    const createTest = async (params) => {
        await browser.vDriver.startTestSession({
            params: {
                app: params.project || 'Test App',
                branch: params.branch || 'integration',
                // test: params.testName.includes('-') ? (`${params.testName}${i + 1}`) : params.testName,
                os: params.os,
                browserName: params.browserName,
                test: params.testName,
                run: params.runName || process.env.RUN_NAME || 'integration_run_name',
                runident: params.runIdent || process.env.RUN_IDENT || uuidv4(),
                suite: params.suiteName || 'Integration suite',
            },
        });
        browser.pause(300);
        const checkResult = [];
        for (const check of params.checks) {
            const filepath = check.filePath || 'files/A.png';
            const imageBuffer = fs.readFileSync(`${browser.config.rootPath}/${filepath}`);
            checkResult.push(await checkVRS(check.checkName, imageBuffer, check));
        }

        this.STATE.currentCheck = checkResult[0];
        await browser.vDriver.stopTestSession();
    };
    for (const i of Array.from(Array(parseInt(num, 10))
        .keys())) {
        const params = YAML.parse(yml.replace(/[$]/gim, i));
        console.log(`Create test # ${i}`);
        await createTest(params, i);
    }
});

When(/^I unfold the test "([^"]*)"$/, function (name) {
    const testElement = $(`[data-table-test-name=${name}]`);
    testElement.waitForDisplayed({ timeout: 7000 });
    testElement.click();
    browser.waitUntil(
        () => $$('[data-table-check-name]').find((x) => x.isDisplayed()),
        { timeout: 7000 }
    );
});
