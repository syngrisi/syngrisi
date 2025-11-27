const fs = require('fs');
const path = require('path');

const reportPath = path.join(__dirname, '../reports/report.json');

function getTests(suite, tests = []) {
    if (suite.suites) {
        for (const childSuite of suite.suites) {
            getTests(childSuite, tests);
        }
    }
    if (suite.specs) {
        for (const spec of suite.specs) {
            for (const test of spec.tests) {
                // Add spec title to test for easier identification
                test.specTitle = spec.title;
                test.parentSuiteTitle = suite.title;
                test.file = spec.file;
                tests.push(test);
            }
        }
    }
    return tests;
}

function printTestErrors(tests, type) {
    if (tests.length === 0) return;

    console.log(`\n==================================================`);
    console.log(`             ${type.toUpperCase()} TESTS`);
    console.log(`==================================================`);

    tests.forEach((test, index) => {
        console.log(`\n${index + 1}) ${test.parentSuiteTitle} > ${test.specTitle}`);
        console.log(`   File: ${test.file}`);

        test.results.forEach((result, rIndex) => {
            if (result.error) {
                console.log(`   Attempt ${rIndex + 1}:`);
                if (result.error.message) {
                    // Clean up ANSI codes if present, though usually fine in console
                    console.log(`   Error: ${result.error.message}`);
                }
                if (result.error.stack) {
                    console.log(`   Stack:`);
                    // Indent stack trace
                    const stackLines = result.error.stack.split('\n').map(line => `     ${line}`).join('\n');
                    console.log(stackLines);
                }
            }
        });
    });
}

try {
    if (!fs.existsSync(reportPath)) {
        console.log('Report file not found:', reportPath);
        process.exit(0);
    }

    const reportData = fs.readFileSync(reportPath, 'utf8');
    let report;
    try {
        report = JSON.parse(reportData);
    } catch (e) {
        // Fallback: try to find the JSON object if there's extra text
        const jsonStart = reportData.indexOf('{');
        const jsonEnd = reportData.lastIndexOf('}');
        if (jsonStart !== -1 && jsonEnd !== -1) {
            report = JSON.parse(reportData.substring(jsonStart, jsonEnd + 1));
        } else {
            throw e;
        }
    }

    const allTests = [];
    if (report.suites) {
        for (const suite of report.suites) {
            getTests(suite, allTests);
        }
    }

    const failedTests = allTests.filter(t => t.status === 'unexpected');
    const flakyTests = allTests.filter(t => t.status === 'flaky');

    printTestErrors(failedTests, 'Failed');
    printTestErrors(flakyTests, 'Flaky');

    const stats = report.stats;

    // Calculate total duration
    const durationMs = stats.duration;

    // Format duration to mm:ss
    const minutes = Math.floor(durationMs / 60000);
    const seconds = ((durationMs % 60000) / 1000).toFixed(0);
    const formattedDuration = `${minutes}m ${seconds}s`;

    console.log('\n--------------------------------------------------');
    console.log('             TEST RUN STATISTICS');
    console.log('--------------------------------------------------');
    console.log(` Total Tests:  ${(stats.expected || 0) + (stats.unexpected || 0) + (stats.flaky || 0) + (stats.skipped || 0)}`);
    console.log(` Passed:       ${stats.expected || 0}`);
    console.log(` Failed:       ${stats.unexpected || 0}`);
    console.log(` Flaky:        ${stats.flaky || 0}`);
    console.log(` Skipped:      ${stats.skipped || 0}`);
    console.log(` Duration:     ${formattedDuration} (${durationMs}ms)`);
    console.log('--------------------------------------------------\n');

    console.log('To view the combined HTML report, run:');
    console.log('\x1b[36m%s\x1b[0m', 'npx playwright show-report reports/playwright-report');
    console.log('\n');

} catch (err) {
    console.error('Error reading or parsing report statistics:', err.message);
}
