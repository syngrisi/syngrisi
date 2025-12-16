/* eslint-disable no-await-in-loop,no-restricted-syntax */
require('../../server/models');

const utils = require('../lib');
const { Check, Test, Run, Suite } = require('../lib');

async function task() {
    await utils.runMongoCode(async () => {
        try {
            /**
             * 0. fill test collection with 'checks' field array
             * */
            console.log('\nStage: 0');

            const checks = await Check.find({});
            // console.log(checks);
            for (const check of checks) {
                const testId = check.test;
                const test = await Test.findOne({ _id: testId });
                if (test && testId && !test.checks.map((x: any) => x.toString()).includes(check?._id.toString())) {
                    const newChecksArray = test.checks || [];
                    newChecksArray.push(check._id);
                    await test.update({ _id: test._id }, { $set: { checks: newChecksArray } });
                    await test.save();
                    process.stdout.write('.');
                } else {
                    process.stdout.write('x');
                }
            }

            /**
             * 1. fill test suite fields
             * */
            console.log('\nStage: 1');

            const tests: any = await Test.find({});

            for (const test of tests) {
                // console.log(test.checks[0]);
                const firstCheckId = test.checks[0];
                if (firstCheckId) {
                    // @ts-ignore
                    const firstCheck = await Check.findOne({ _id: test.checks[0] });

                    if (firstCheck) {
                        const { suite } = firstCheck;
                        if (suite) {
                            test.suite = suite;
                            await Test.update({ _id: test._id }, { $set: { suite } });
                        }
                    }
                } else {
                    process.stdout.write('x');
                }
                process.stdout.write('.');
            }

            /**
             * 2. set app id for runs and suites
             * */

            console.log('\nStage: 2');

            for (const x of tests) {
                const appId = x.app;
                await Run.update({ _id: x.run }, { $set: { app: appId } });
                await Suite.update({ _id: x.suite }, { $set: { app: appId } });
                process.stdout.write('.');
            }

            /**
             * 3. populate 'runs' and 'suites' with 'createdDate' field
             * */
            console.log('\nStage: 3');

            const suites = await Suite.find({});
            for (const x of suites) {
                await Suite.update({ _id: x._id }, { $set: { createdDate: x._id.getTimestamp() } });
                process.stdout.write('+');
            }

            const runs = await Run.find({});
            for (const x of runs) {
                await Run.update({ _id: x._id }, { $set: { createdDate: x._id.getTimestamp() } });
                process.stdout.write('>');
            }
        } catch (err) {
            console.error(err);
        } finally {
            console.log('\nDone');
        }
    });
}

task();
