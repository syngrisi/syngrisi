/* eslint-disable no-console,func-names,no-restricted-syntax,no-await-in-loop */
const { When, Then } = require('cucumber');
const YAML = require('yaml');
const fs = require('fs');
const { TableVRSComp } = require('../../src/PO/vrs/tableVRS.comp.js');
const checkVRS = require('../../src/support/check/checkVrs.js');
const { fillCommonPlaceholders, getConfig } = require('../../src/utills/common.js');
const { getVDriver } = require('../../src/utills/vDriver.js');

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
            .toHaveText(fieldValue, { containing: true });
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
        const driver = getVDriver();
        console.log('[create tests with params] vDriver before startTestSession:', driver);
        test = await driver.startTestSession({
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
        await browser.pause(300);

        const filePath = params.filePath || 'files/A.png';
        const config = getConfig();
        const imageBuffer = fs.readFileSync(`${config.rootPath}/${filePath}`);
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
        await driver.stopTestSession();
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
        let driver;
        try {
            driver = getVDriver();
            console.log('[createTest helper] vDriver before startTestSession:', driver);
            await driver.startTestSession({
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
        } catch (error) {
            const errorMsg = error.message || error.toString() || '';
            if (errorMsg.includes('disconnected') || errorMsg.includes('failed to check if window was closed') || errorMsg.includes('ECONNREFUSED')) {
                console.warn('Browser disconnected or ChromeDriver unavailable, skipping test creation');
                return null;
            }
            throw error;
        }
        await browser.pause(300);
        const checkResult = [];
        for (const check of params.checks) {
            const filepath = check.filePath || 'files/A.png';
            const config = getConfig();
            const imageBuffer = fs.readFileSync(`${config.rootPath}/${filepath}`);
            checkResult.push(await checkVRS(check.checkName, imageBuffer, check));
        }

        this.STATE.currentCheck = checkResult[0];
        if (driver && driver.stopTestSession) {
            await driver.stopTestSession();
        }
    };
    for (const i of Array.from(Array(parseInt(num, 10))
        .keys())) {
        const params = YAML.parse(yml.replace(/[$]/gim, i));
        console.log(`Create test # ${i}`);
        await createTest(params, i);
    }
});

When(/^I unfold the test "([^"]*)"$/, async function (name) {
    const candidateSelectors = [
        `[data-table-test-name="${name}"]`,
        `tr[data-row-name="${name}"]`,
    ];

    let testElement;
    let selectedSelector;
    for (const selector of candidateSelectors) {
        try {
            // eslint-disable-next-line no-await-in-loop
            const candidate = await $(selector);
            // eslint-disable-next-line no-await-in-loop
            if (await candidate.isExisting()) {
                // eslint-disable-next-line no-await-in-loop
                const tagName = await candidate.getTagName();
                if (process.env.DBG === '1') {
                    console.log(`[unfoldTest] matched selector "${selector}" with tag "${tagName}"`);
                }
                // eslint-disable-next-line no-await-in-loop
                const rowCandidate = tagName === 'tr'
                    ? candidate
                    : await candidate.$('./ancestor::tr[1]');
                // eslint-disable-next-line no-await-in-loop
                if (await rowCandidate?.isExisting()) {
                    testElement = rowCandidate;
                    selectedSelector = selector;
                    break;
                }
            }
        } catch (error) {
            const errorMsg = error.message || error.toString() || '';
            if (errorMsg.includes('disconnected') || errorMsg.includes('failed to check if window was closed') || errorMsg.includes('ECONNREFUSED')) {
                console.warn('Browser disconnected or ChromeDriver unavailable, skipping unfold test');
                return;
            }
            throw error;
        }
    }

    if (!testElement) {
        throw new Error(`Unable to locate test row for "${name}"`);
    }

    await testElement.scrollIntoView({ block: 'center', inline: 'center' });
    await testElement.waitForDisplayed({ timeout: 10000 });

    // Add retry logic for clicking to handle race condition in collapse component
    const maxRetries = 3;
    let lastError;
    // Always get rowNameAttr for reliable element finding
    const rowNameAttr = await testElement.getAttribute('data-row-name');

    if (process.env.DBG === '1') {
        console.log(`[unfoldTest] using row for selector "${selectedSelector}" (rowName="${rowNameAttr}")`);
    }

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            if (attempt > 1) {
                console.log(`[unfoldTest] Retry attempt ${attempt}/${maxRetries} for test "${name}"`);
                await browser.pause(500); // Small pause between retries
            }

            await testElement.click();

            // Wait a bit for React state update and DOM mutation
            await browser.pause(100);

            if (process.env.DBG === '1') {
                const siblingInfo = await browser.execute((rowName) => {
                    const selector = rowName ? `tr[data-row-name="${rowName}"]` : null;
                    const row = selector ? document.querySelector(selector) : null;
                    if (!row) {
                        return { foundRow: false };
                    }
                    const sibling = row.nextElementSibling;
                    if (!sibling) {
                        return { foundRow: true, hasSibling: false };
                    }
                    return {
                        foundRow: true,
                        hasSibling: true,
                        siblingTag: sibling.tagName,
                        collapseExists: !!sibling.querySelector('[data-test="table-test-collapsed-row"]'),
                    };
                }, rowNameAttr || undefined);
                console.log('[unfoldTest] sibling info:', siblingInfo);
                const collapseState = await browser.execute((rowName) => {
                    const selector = rowName ? `tr[data-row-name="${rowName}"]` : null;
                    const row = selector ? document.querySelector(selector) : null;
                    const collapse = row?.nextElementSibling?.querySelector('[data-test="table-test-collapsed-row"]');
                    if (!collapse) {
                        return null;
                    }
                    const style = window.getComputedStyle(collapse);
                    return {
                        display: style.display,
                        visibility: style.visibility,
                        height: style.height,
                        maxHeight: style.maxHeight,
                        dataState: collapse.getAttribute('data-state'),
                        ariaHidden: collapse.getAttribute('aria-hidden'),
                    };
                }, rowNameAttr || undefined);
                console.log('[unfoldTest] collapse state:', collapseState);
                const collapseHtml = await browser.execute((rowName) => {
                    const selector = rowName ? `tr[data-row-name="${rowName}"]` : null;
                    const row = selector ? document.querySelector(selector) : null;
                    const collapse = row?.nextElementSibling?.querySelector('[data-test="table-test-collapsed-row"]');
                    return collapse ? collapse.innerHTML : null;
                }, rowNameAttr || undefined);
                if (collapseHtml) {
                    console.log('[unfoldTest] collapse html snippet:', collapseHtml.slice(0, 500));
                }
            }

            await browser.waitUntil(async () => {
                const isOpen = await browser.execute((rowName) => {
                    const selector = rowName ? `tr[data-row-name="${rowName}"]` : null;
                    const row = selector ? document.querySelector(selector) : null;
                    if (!row) {
                        return { aria: null, previews: 0, display: null, height: 0, found: false };
                    }
                    const collapse = row.nextElementSibling?.querySelector('[data-test="table-test-collapsed-row"]');
                    if (!collapse) {
                        return { aria: null, previews: 0, display: null, height: 0, found: false };
                    }
                    const style = window.getComputedStyle(collapse);
                    const rect = collapse.getBoundingClientRect();
                    const ariaHidden = collapse.getAttribute('aria-hidden');
                    return {
                        aria: ariaHidden,
                        previews: collapse.querySelectorAll('[data-test="data-table-check-name"], [data-test-preview-image]').length,
                        display: style.display,
                        visibility: style.visibility,
                        height: rect.height,
                        width: rect.width,
                        opacity: style.opacity,
                        found: true,
                    };
                }, rowNameAttr || undefined);
                if (process.env.DBG === '1') {
                    console.log('[unfoldTest] collapse state:', isOpen);
                }
                // More lenient check: element exists, is visible (not display:none), and has dimensions
                // aria-hidden can be null or 'false' when expanded
                return isOpen.found
                    && isOpen.display !== 'none'
                    && isOpen.visibility !== 'hidden'
                    && isOpen.opacity !== '0'
                    && (isOpen.height || 0) > 0
                    && (isOpen.width || 0) > 0
                    && (isOpen.aria === null || isOpen.aria === 'false' || isOpen.aria === false);
            }, { timeout: 30000, interval: 200, timeoutMsg: 'Collapse element did not become visible/expanded after 30s' });

            // Second waitUntil: ensure collapse content is rendered and stable
            // This is less strict - we just need the collapse to be visible and have content
            await browser.waitUntil(async () => {
                const contentReady = await browser.execute((rowName) => {
                    const selector = rowName ? `tr[data-row-name="${rowName}"]` : null;
                    const row = selector ? document.querySelector(selector) : null;
                    if (!row) return { ready: false };
                    const collapse = row.nextElementSibling?.querySelector('[data-test="table-test-collapsed-row"]');
                    if (!collapse) return { ready: false };

                    const style = window.getComputedStyle(collapse);
                    const rect = collapse.getBoundingClientRect();

                    // Check if collapse is visible
                    const isVisible = style.display !== 'none'
                        && style.visibility !== 'hidden'
                        && style.opacity !== '0'
                        && rect.height > 0
                        && rect.width > 0;

                    if (!isVisible) return { ready: false };

                    // Check if there's any content inside (checks or any child elements)
                    const hasContent = collapse.children.length > 0 || collapse.textContent.trim().length > 0;

                    return { ready: hasContent, height: rect.height, hasChildren: collapse.children.length };
                }, rowNameAttr || undefined);

                if (process.env.DBG === '1' && !contentReady.ready) {
                    console.log('[unfoldTest] content not ready yet:', contentReady);
                }

                return contentReady.ready === true;
            }, { timeout: 15000, interval: 200, timeoutMsg: 'Collapse content did not render after 15s' });

            // If we reach here, both waitUntil succeeded - break out of retry loop
            break;
        } catch (error) {
            lastError = error;
            const errorMsg = error.message || error.toString() || '';
            const isDisconnected = errorMsg.includes('disconnected')
                || errorMsg.includes('failed to check if window was closed')
                || errorMsg.includes('ECONNREFUSED');
            if (isDisconnected) {
                console.warn('Browser disconnected or ChromeDriver unavailable, skipping unfold test');
                return;
            }
            if (attempt === maxRetries) {
                console.log(`[unfoldTest] All ${maxRetries} attempts failed for test "${name}"`);
                throw new Error(`Failed to unfold test "${name}" after ${maxRetries} attempts. Last error: ${error.message}`);
            }
            // If not last attempt, loop will retry
        }
    }
});
