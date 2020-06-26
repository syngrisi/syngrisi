'use strict';

const mongoose = require('mongoose');
const hasha = require('hasha');
const fs = require('fs');
const {config} = require('../../config');
const {getDiff} = require('../../lib/comparator');
const {Lock} = require('../../lib/lock');
const orm = require('../../lib/dbItems');

const Snapshot = mongoose.model('VRSSnapshot');
const Check = mongoose.model('VRSCheck');
const Test = mongoose.model('VRSTest');
const Suite = mongoose.model('VRSSuite');
const App = mongoose.model('VRSApp');
const moment = require('moment');

function fatalError(req, res, e) {
    let stack = ''
    if (e.stack) {
        stack = e.stack;
    }
    const errMsg = 'Fatal error: ' + e + "\n" + stack;
    req.log.fatal(errMsg);
    console.log(errMsg);
    res.status(500).send(
        `<pre>${errMsg}</pre>>`);
}

// get last updated document
async function getLastCheckBaselineId(identifier) {
    const last = (await Check.find(identifier)
        .sort({Updated_date: -1})
        .limit(1))[0];
    if (last && last.baselineId) {
        return last.baselineId;
    }
    return null;
}

async function getSnapshot(hash) {
    return (await Snapshot.find({imghash: hash}))[0];
}

async function createSnapshotIfNotExist(params, fileData) {
    // console.log(baseline);
    let opts = {name: params.name};
    opts['imghash'] = hasha(fileData);
    // console.log(opts['imghash']);
    const equalSnapshot = await getSnapshot(opts['imghash']);
    // console.log(equalSnapshot);
    if (equalSnapshot) {
        console.log(`Snapshot with hash: '${opts['imghash']}' is already exist.`);
        return equalSnapshot;
    }
    console.log(`Snapshot with hash: '${opts['imghash']}' doesn't exists creating new one...`);

    const snapshoot = new Snapshot(opts);

    snapshoot.save(function (err, bline) {
        if (err) {
            throw err;
        }
    });
    console.log(`Snapshot was saved: '${JSON.stringify(snapshoot)}'`);
    const path = `${config.defaultBaselinePath}${snapshoot.id}.png`;
    console.log(`Save screenshot to: '${path}'`);
    fs.writeFileSync(path, fileData);
    return snapshoot;

}

async function compareSnapshots(params) {
    console.log(`Compare baseline and actual snapshots with ids: [${params.baselineId}, ${params.actualSnapshotId}]`);
    const baseline = await Snapshot.findById(params.baselineId);
    console.log(`BASELINE: ${JSON.stringify(baseline)}`);
    const baselineFile = fs.readFileSync(`${config.defaultBaselinePath}${params.baselineId}.png`);
    const actualData = fs.readFileSync(`${config.defaultBaselinePath}${params.actualSnapshotId}.png`);
    let opts = {};
    if (baseline.ignoreRegions !== 'undefined') {
        let ignored = JSON.parse(JSON.parse(baseline.ignoreRegions))
        opts = {ignoredBoxes: ignored}
    }
    const diff = await getDiff(baselineFile, actualData, opts);
    if (diff.misMatchPercentage !== '0.00') {
        console.log(`Images are different, ids: [${params.baselineId}, ${params.actualSnapshotId}]\n diff: ${JSON.stringify(diff)}`);
    }
    return diff;
}

// CONTROLLERS
// HTML

exports.checkview = async function (req, res) {
    return new Promise(async function (resolve, reject) {
        try {
            const opts = req.query;

            if (!opts.id) {
                res.status(404)
                    .send('Cannot return check. There is no "id" field in request query');
                return;
            }

            const check = await Check.findById(`${opts.id}`);
            var moment = require('moment');
            const checkDate = moment(check.Created_date)
                .format('YYYY-MM-DD hh:mm');
            res.render('pages/check', {
                check: check,
                checkDate: checkDate
            });
        } catch (e) {
            fatalError(req, res, e);
            reject(e);
        }
    })
};
exports.checksgroupview = async function (req, res) {
    return new Promise(async function (resolve, reject) {
        try {
            const opts = req.query;

            if (!opts.id) {
                res.status(404)
                    .send('Cannot return checks ident group. There is no check "id" field in request query');
                return;
            }

            const check = await Check.findById(`${opts.id}`).exec();
            const test = await Test.findById(check.test).exec();
            const suite = await Suite.findById(check.suite).exec();
            const testId = check.test;
            const suiteId = check.suite;
            const ident = checkIdent(check);
            console.warn(check.name, "|", testId, "|", suite, "|", ident, "|")
            const groups = await checksGroupedByIdent({test: testId});
            const groupChecks = groups[ident].checks;
            console.log(groupChecks);
            const moment = require('moment');
            groupChecks.map(function (check) {
                check.formattedCreatedDate = moment(check.Created_date)
                    .format('YYYY-MM-DD hh:mm');
                return check
            })
            // console.log(JSON.stringify(group, null, "  "))
            // const checkDate = moment(check.Created_date)
            //     .format('YYYY-MM-DD hh:mm');
            res.render('pages/checkgroup', {
                checks: groupChecks,
                // firstCheck: check,
                test: test,
                suite: suite
            });
        } catch (e) {
            fatalError(req, res, e);
            reject(e);
        }
    });

};

exports.snapshootview = async function (req, res) {
    return new Promise(async function (resolve, reject) {
        try {
            const opts = req.query;

            if (!opts.id) {
                res.status(400)
                    .send('Cannot return snapshoot. There is no "id" field in request query');
                return;
            }

            const snapshot = await Snapshot.findById(`${opts.id}`);
            const moment = require('moment');
            snapshot.formattedCreatedDate = moment(snapshot.Created_date)
                .format('YYYY-MM-DD hh:mm');
            res.render('pages/snapshot', {
                snapshot: snapshot,
            });
        } catch (e) {
            fatalError(req, res, e);
            reject(e);
        }
    });
};

exports.diffview = async function (req, res) {
    return new Promise(async function (resolve, reject) {
        try {
            const opts = req.query;

            if (!opts.actualid || !opts.expectedid || !opts.diffid) {
                res.status(400)
                    .send(`Error: There is no "id" fields (actualid || expectedid ||opts_diffid) in request query: ${JSON.stringify(opts)}`);
                return;
            }
            try {
                const expected_snapshoot = await Snapshot.findById(`${opts.expectedid}`);
                const actual_snapshoot = await Snapshot.findById(`${opts.actualid}`);
                const diff_snapshoot = await Snapshot.findById(`${opts.diffid}`);

                // const snapshot = await Snapshot.findById(`${opts.id}`);
                var moment = require('moment');
                expected_snapshoot.formattedCreatedDate = moment(expected_snapshoot.Created_date)
                    .format('YYYY-MM-DD hh:mm');
                actual_snapshoot.formattedCreatedDate = moment(actual_snapshoot.Created_date)
                    .format('YYYY-MM-DD hh:mm');
                diff_snapshoot.formattedCreatedDate = moment(diff_snapshoot.Created_date)
                    .format('YYYY-MM-DD hh:mm');

                res.render('pages/diff', {
                    expected_snapshoot: expected_snapshoot,
                    actual_snapshoot: actual_snapshoot,
                    diff_snapshoot: diff_snapshoot,
                });
            } catch (e) {
                res.status(500)
                    .send(`Error preparing diff page: ${JSON.stringify(e)}`);
                reject(e);
            }

        } catch (e) {
            fatalError(req, res, e);
            reject(e);
        }
    });
};

function checkIdent(check) {
    return ['name', 'viewport', 'browserName', 'os'].reduce((accumulator, prop) => accumulator + '.' + check[prop], 'ident')
}

function groupStatus(checks) {
    const statuses = checks.map(function (check) {
        return check.status[0];
    })
    const lastStatus = statuses[statuses.length - 1]
    let resultStatus = 'not set'

    if (statuses.includes('failed'))
        resultStatus = 'failed'
    if (statuses.includes('failed') && lastStatus === 'passed')
        resultStatus = 'blinking'
    if (!statuses.includes('failed'))
        resultStatus = 'passed'
    if (lastStatus === 'new')
        resultStatus = 'new'
    return resultStatus
}

async function checksGroupedByIdent(checkFilter) {
    return new Promise(async function (resolve, reject) {
        try {
            // console.log(checkFilter)
            let chs = await Check.find(checkFilter)
                .sort({Updated_date: 1}).exec()
            let checks = chs.map(function (ch) {
                ch.formattedCreatedDate = moment(ch.Created_date)
                    .format('YYYY-MM-DD hh:mm');
                return ch;
            });
            let result = {};
            checks.forEach(function (check) {
                if (result[checkIdent(check)] === undefined) {
                    result[checkIdent(check)] = {};
                    result[checkIdent(check)]['checks'] = [];
                }
                result[checkIdent(check)]['checks'].push(check)
            })
            for (const groupIdent in result) {
                result[groupIdent].status = groupStatus(result[groupIdent].checks)
            }
            resolve(result);
        } catch (e) {
            fatalError(req, res, e);
            reject(e);
        }
    })
}

exports.index = async function (req, res) {
    return new Promise(
        async function (resolve, reject) {
            try {
                let opts = req.query;
                let suiteFilter = {};
                const suite = await Suite.findOne({name: opts.suitename}).exec()
                if (suite)
                    suiteFilter = {suite: suite.id};
                const suites = await Suite.find({})
                    .sort({Updated_date: -1}).exec()
                const tests = await Test.find()
                    .sort({Updated_date: -1}).exec()
                tests.map(function (test) {
                    test.formattedCreatedDate = moment(test.Start_date)
                        .format('YYYY-MM-DD hh:mm');
                    return test;
                })

                let checksByTestGroupedByIdent = {}

                for (const test of tests) {
                    let checkFilter = {test: test.id}
                    if (suite)
                        checkFilter.suite = suite.id
                    checksByTestGroupedByIdent[test.id] = await checksGroupedByIdent(checkFilter);
                }

                res.render('pages/index', {
                    suites: suites,
                    tests: tests,
                    currentSuiteName: opts.suitename,
                    checksByTestGroupedByIdent: checksByTestGroupedByIdent
                });
            } catch (e) {
                reject(e);
                fatalError(req, res, e);
            }
        }
    )
};

// API

exports.checks_group_by_ident = async function (req, res) {
    return new Promise(async function (resolve, reject) {
        try {
            let testId = req.params.testid;
            res.json(await checksGroupedByIdent({test: testId}).catch(function (e) {
                fatalError(req, res, e);
                reject(e);
            }));
        } catch (e) {
            fatalError(req, res, e);
            reject(e);
        }
    })

};

exports.list_all_checks = async function (req, res) {
    return new Promise(async function (resolve, reject) {
        let filter = {}
        if (req.query.testid)
            filter.test = req.query.testid
        const checks = await Check.find(filter).exec().catch(
            function (e) {
                fatalError(req, res, e);
                reject(e)
                return
            }
        )
        res.json(checks);
        resolve(checks)
    })
};

exports.create_test = async function (req, res) {
    return new Promise(
        async function (resolve, reject) {
            try {
                let params = req.body;

                console.log(`Create test with name '${params.testname}', params: '${JSON.stringify(params)}'`);
                req.log.info(`Create test with name '${params.testname}', params: '${JSON.stringify(params)}'`);
                const test = await orm.createTest({
                    name: params.testname,
                    status: params.teststatus,
                    viewport: params.testsviewport,
                    browserName: params.testsbrowsername,
                    os: params.testos
                });

                res.json(test);
                resolve([req, res, test]);

            } catch (e) {
                reject(e);
                fatalError(req, res, e)
            }
        });
};

exports.update_test = async function (req, res) {
    return new Promise(
        async function (resolve, reject) {
            try {
                let opts = req.body;
                let id = req.params.id;
                opts['Updated_date'] = Date.now();
                console.log(`UPDATE test id '${id}' with params '${JSON.stringify(opts)}'`);

                const tst = await Test.findByIdAndUpdate(id, opts).exec().catch(
                    function (e) {
                        console.log(`Cannot update the test, error: '${e}'`);
                        fatalError(req, res, e)
                        reject(e);
                    }
                )
                tst.save().catch(
                    function (e) {
                        console.log(`Cannot save the test, error: '${e}'`);
                        fatalError(req, res, e)
                        reject(e);
                    }
                )
                res.status(200).send(`Test with id: '${id}' was updated`);
                resolve(tst);
            } catch (e) {
                fatalError(req, res, e)
                reject(e);
            }
        });
};

exports.remove_test = async function (req, res) {
    return new Promise(async function (resolve, reject) {
        try {
            const id = req.params.id;
            console.log(`DELETE test with ID: '${id}'`);
            console.log(`Try to delete all checks associated to test with ID: '${id}'`);
            Check.remove({test: id})
                .then(function (output) {
                    // console.log(output);
                    Test.findByIdAndDelete(id)
                        .then(function (out) {
                            res.status(200)
                                .send(`Test with id: '${id}' and all related checks were removed 
                        output: '${JSON.stringify(output)}' | ${JSON.stringify(out)}'`);
                        })
                        .catch(
                            (err) => {
                                res.status(400)
                                    .send(`Cannot remove the test with id: '${id}', error: '${err}'`);
                                reject(e);
                            }
                        );
                })
                .catch(function (error) {
                    res.status(400)
                        .send(`Cannot remove the checks related to id: '${id}', error: '${error}'`);
                    reject(e);
                });
        } catch (e) {
            fatalError(req, res, e);
            reject(e);
        }
    })
};

exports.create_check = async function (req, res) {
    return new Promise(async function (resolve, reject) {
            try {
                let executionTimer = process.hrtime()
                let params = req.body;
                console.log(`CREATE check with params: '${JSON.stringify(params)}'`);

                params['Updated_date'] = Date.now();
                let resultResponse = '';

                // if (params.testname) {
                //     console.log(`Create test with name '${params.testname}' if not exist`);
                //     const test = await orm.createTestIfNotExist({ name: params.testname });
                //     params.test = test.id;
                // }
                let test = {};
                if (!params.testid) {
                    res.status(400)
                        .send("Cannot create check without 'testid' parameters, try to initialize session at first");
                } else {
                    console.log(`Try to find test with Id: ${params.testid}`);
                    test = await Test.findById(params.testid);
                    console.log(`Attach this check to the tests '${JSON.stringify(test)}' if not exist`);
                    // const test = await orm.createTestIfNotExist({ name: params.testname });
                    params.test = test.id;
                }

                if (params.suitename) {
                    console.log(`Create suite with name '${params.suitename}' if not exist`);
                    const suite = await orm.createSuiteIfNotExist({name: params.suitename});
                    params.suite = suite.id;
                }

                if (params.appname) {
                    console.log(`Create App with name '${params.appname}' if not exist`);
                    const test = await orm.createAppIfNotExist({name: params.appname});
                    params.app = test.id;
                }

                // create an actual snapshot if baseline Id is exist in a previous сheck or create a new baseline otherwise
                console.log(`Check if baselineId is exist in previous check with name: '${req.body.name}'`);

                // check MUST be identified by Name, OS, Browser, Viewport
                const checkIdentifier = {
                    name: params.name,
                    os: params.os,
                    browserName: params.browserName,
                    viewport: params.viewport,
                };

                console.log(`Find for baseline for check with identifier: '${JSON.stringify(checkIdentifier)}'`);
                const previousBaselineId = await getLastCheckBaselineId(checkIdentifier);
                if (previousBaselineId) {
                    console.log(`A baseline for check name: '${req.body.name}', id is '${previousBaselineId}' is already exists`);
                    params.baselineId = previousBaselineId;

                    console.log(`Creating an actual snapshot for check with name: '${req.body.name}'`);
                    const actualSnapshot = await createSnapshotIfNotExist(req.body, req.files.file.data);
                    params.actualSnapshotId = actualSnapshot.id;
                    params.status = 'pending';
                } else {
                    console.log(`A baseline snapshot for previous check with name: '${req.body.name}', does not exist creating new one`);
                    const baseline = await createSnapshotIfNotExist(req.body, req.files.file.data);
                    params.baselineId = baseline.id;
                    params.status = 'new';
                }

                // params.browserName = test.browserName;
                // params.viewport = test.viewport;
                console.log(`Create and save new check with params: '${JSON.stringify(params, 2)}'`);
                let check = await Check.create(params);

                await check.save()
                    .then(function (chk) {
                            resultResponse = chk;
                            console.log(`Check with id: '${check.id}', successful saved!`);
                        }
                    )
                    .catch(function (error) {
                        res.send(error);
                        console.log(`Cannot save the check, error: '${error}'`);
                    });

                // compare actual with baseline if a check isn't new
                let updateParams = {};
                if (check.status.toString() !== 'new') {
                    const diff = await compareSnapshots(params);
                    if (diff.misMatchPercentage !== '0.00') {
                        console.log(`Saving diff snapshot for check with Id: '${check.id}'`);
                        const diffSnapshot = await createSnapshotIfNotExist(req.body, diff.getBuffer());
                        updateParams['diffId'] = diffSnapshot.id;
                        updateParams['status'] = 'failed';
                    } else {
                        updateParams['status'] = 'passed';
                    }

                    console.log(`Update check with params: '${JSON.stringify(updateParams)}'`);
                    updateParams['Updated_date'] = Date.now();
                    await check.updateOne(updateParams);
                    resultResponse = await Check.findById(check.id);
                }
                const result = Object.assign({}, resultResponse.toObject(),
                    {executeTime: process.hrtime(executionTimer).toString()})
                console.log({res})
                res.json(result);
                resolve([req, res, check]);
            } catch (e) {
                reject(e);
                fatalError(req, res, e);
            }
        }
    );
};

exports.remove_check = async function (req, res) {
    return new Promise(function (resolve, reject) {
        try {
            const id = req.params.id;
            console.log(`DELETE check with ID: '${id}'`);

            Check.findByIdAndDelete(id)
                .then(function () {
                    res.status(200)
                        .send(`Check with id: '${id}' was removed`);
                })
                .catch(
                    (err) => {
                        res.status(400)
                            .send(`Cannot remove a check with id: '${id}', error: ${err}`);
                        resolve(err);
                    }
                );
        } catch (e) {
            fatalError(req, res, e)
            resolve(e);
        }
    })

};

exports.update_check = async function (req, res) {
    return new Promise(async function (resolve, reject) {
        try {
            let opts = req.body;
            let id = req.params.id;
            opts['Updated_date'] = Date.now();
            console.log(`UPDATE check id: '${id}' with params: '${JSON.stringify(req.params)}', body: '${JSON.stringify(opts)}'`);

            // Check.findByIdAndUpdate(req.param.id, opts)
            const chk = await Check.findByIdAndUpdate(id, opts)
                .then(async function (chk) {
                    await chk.save()
                        .then(async function () {
                            await orm.updateItemDate('VRSSuite', chk.suite);
                            await orm.updateItemDate('VRSTest', chk.test);

                            console.log(`Check with id: '${id}' was updated`);
                            res.status(200)
                                .send(`Check with id: '${id}' was updated`);
                        })
                        .catch(function (error) {
                            console.log(`Cannot update check, error: '${error}'`);
                            reject(e);
                        });
                })
                .catch(
                    (e) => {
                        res.status(400)
                            .send(`Cannot update a check with id: '${id}', error: ${e}`);
                        reject(e);
                    }
                );

        } catch (e) {
            fatalError(req, res, e);
            reject(e);
        }
    })

};

exports.update_snapshot = async function (req, res) {
    return new Promise(async function (resolve, reject) {
        try {
            let opts = req.body;
            let id = req.params.id;
            opts['Updated_date'] = Date.now();
            console.log(`UPDATE snapshot id: '${id}' with params: '${JSON.stringify(req.params)}', body: '${JSON.stringify(opts)}'`);
            const snp = await Snapshot.findByIdAndUpdate(id, opts).exec().catch(
                function (e) {
                    console.log(`Cannot update a snapshot with id: '${id}', error: ${e}`);
                    fatalError(req, res, e);
                    reject(e)
                }
            );
            await snp.save()
            console.log(`Snapshot with id: '${id}' and opts: '${JSON.stringify(opts)}' was updated`);
            res.status(200)
                .json({item: 'Snapshot', action: 'update', id: id, opts: opts})
        } catch (e) {
            fatalError(req, res, e);
            reject(e);
        }
    })
};

exports.get_snapshot = async function (req, res) {
    return new Promise(async function (resolve, reject) {
        try {
            let opts = req.body;
            let id = req.params.id;
            console.log(`GET snapshot with id: '${id}',  params: '${JSON.stringify(req.params)}', body: '${JSON.stringify(opts)}'`);
            const snp = await Snapshot.findById(id)
                .then(async function (snp) {
                    res.json(snp);
                })
                .catch(
                    (err) => {
                        res.status(400)
                            .send(`Cannot GET a snapshot with id: '${id}', error: ${err}`);
                        resolve(err);
                    }
                );
        } catch (e) {
            fatalError(req, res, e);
            reject(e);
        }
    })
};

exports.get_check = async function (req, res) {
    return new Promise(async function (resolve, reject) {
        try {
            let opts = req.body;
            let id = req.params.id;
            console.log(`GET check with id: '${id}', params: '${JSON.stringify(req.params)}', body: '${JSON.stringify(opts)}'`);
            const snp = await Check.findById(id)
                .then(async function (item) {
                    res.json(item);
                })
                .catch(
                    (err) => {
                        res.status(400)
                            .send(`Cannot GET a Check with id: '${id}', error: ${err}`);
                        resolve(err);
                    }
                );
        } catch (e) {
            fatalError(req, res, e);
            reject(e);
        }
    })
};


