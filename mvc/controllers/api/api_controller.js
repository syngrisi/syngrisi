'use strict';

const mongoose = require('mongoose');
const hasha = require('hasha');
const fs = require('fs').promises;
const {config} = require('../../../config');
const {getDiff} = require('../../../lib/comparator');
const orm = require('../../../lib/dbItems');
const {parseDiff} = require('../../../lib/parseDiff');
const {getAllElementsByPositionFromDump} = require('../../../lib/getElementsByPixPositionsFromDump')
const Snapshot = mongoose.model('VRSSnapshot');
const Check = mongoose.model('VRSCheck');
const Test = mongoose.model('VRSTest');
const Suite = mongoose.model('VRSSuite');
const {checksGroupedByIdent} = require('../utils');
const {fatalError, waitUntil} = require('../utils');

// get last updated document
async function getLastCheck(identifier) {
    const last = (await Check.find(identifier)
        .sort({updatedDate: -1})
        .limit(1))[0];
    if (last && last.baselineId) {
        return last;
    }
    return null;
}

async function getLastSuccessCheck(identifier) {
    const condition = [{...identifier, 'status': 'new'}, {...identifier, 'status': 'passed'}]
    return (await Check.find({
        $or: condition
    }).sort({updatedDate: -1}).limit(1))[0];
}

async function getSnapshotByImgHash(hash) {
    return (await Snapshot.find({imghash: hash}))[0];
}

async function createSnapshotIfNotExist(parameters) {
    const {params, fileData, hashCode} = parameters
    let opts = {name: params.name};
    if (!fileData && !hashCode)
        throw new Error("Error: the 'fileData' nor 'hashCode' is set, you should provide at least one parameter")

    opts['imghash'] = hashCode || hasha(fileData);
    const equalSnapshot = await getSnapshotByImgHash(opts['imghash']);
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
    await fs.writeFile(path, fileData);
    return snapshoot;
}

async function compareSnapshots(baseline, actual) {
    console.log(`Compare baseline and actual snapshots with ids: [${baseline.id}, ${actual.id}]`);
    console.log(`BASELINE: ${JSON.stringify(baseline)}`);
    let diff;
    if (baseline.imghash === actual.imghash) {
        console.log(`Baseline and actual snapshoot have the identical image hashes: '${baseline.imghash}'`)
        // stub for diff object
        diff = {
            isSameDimensions: true,
            dimensionDifference: {width: 0, height: 0},
            rawMisMatchPercentage: 0,
            misMatchPercentage: '0.00',
            analysisTime: 0,
            executionTotalTime: '0'
        }
    } else {
        const baselineData = fs.readFile(`${config.defaultBaselinePath}${baseline.id}.png`);
        const actualData = fs.readFile(`${config.defaultBaselinePath}${actual.id}.png`);
        let opts = {};
        if (baseline.ignoreRegions !== 'undefined') {
            let ignored = JSON.parse(JSON.parse(baseline.ignoreRegions))
            opts = {ignoredBoxes: ignored}
        }
        opts.ignore = baseline.matchType;
        diff = await getDiff(baselineData, actualData, opts);
    }

    if (diff.misMatchPercentage !== '0.00') {
        console.log(`Images are different, ids: [${baseline.id}, ${actual.id}]`);
    }
    console.log({diff});
    if (diff.stabMethod && diff.vOffset) {
        if (diff.stabMethod === 'downup') {
            // this mean that we delete first 'diff.vOffset' line of pixels from actual
            // then we will use this during parse actual page DOM dump
            actual.vOffset = -diff.vOffset;
            await actual.save()
        }
        if (diff.stabMethod === 'updown') {

            // this mean that we delete first 'diff.vOffset' line of pixels from baseline
            // then we will use this during parse actual page DOM dump
            baseline.vOffset = -diff.vOffset;
            await baseline.save()
        }
    }
    return diff;
}

// API
const checks_group_by_ident = async function (req, res) {
    return new Promise(async function (resolve, reject) {
        try {
            let testId = req.params.testid;
            res.json(await checksGroupedByIdent({test: testId}).catch(function (e) {
                fatalError(req, res, e);
                return reject(e);
            }));
        } catch (e) {
            fatalError(req, res, e);
            return reject(e);
        }
    })

};

exports.checks_group_by_ident = checks_group_by_ident;

exports.affectedelements = async function (req, res) {
    return new Promise(async function (resolve, reject) {
        try {
            if (!req.query.checktid || !req.query.diffid) {
                const e = "checktid|diffid query values are empty";
                fatalError(req, res, e);
                return reject(e);
            }
            const chk = await Check.findById(req.query.checktid).exec().catch((e) => {
                    fatalError(req, res, e);
                    return reject(e)
                }
            )
            if (!chk) {
                fatalError(req, res, `Cannot find check with such id: '${req.query.checktid}'`)
            }

            const imDiffData = await fs.readFile(`${config.defaultBaselinePath}${req.query.diffid}.png`).catch(
                function (e) {
                    throw new Error(e)
                }
            );
            const positions = parseDiff(imDiffData);
            const result = await getAllElementsByPositionFromDump(JSON.parse(chk.domDump), positions)
            console.table(Array.from(result), ['tag', 'id', 'x', 'y', "width", "height", "domPath"])
            res.json(result);
            resolve(result)
        } catch (e) {
            fatalError(req, res, e)
        }
    })
}

exports.list_all_checks = async function (req, res) {
    return new Promise(async function (resolve, reject) {
        let filter = {}
        if (req.query.testid)
            filter.test = req.query.testid
        if (req.query.id)
            filter._id = req.query.id
        const checks = await Check.find(filter).exec().catch(
            function (e) {
                fatalError(req, res, e);
                return reject(e)

            }
        )
        res.json(checks);
        return resolve(checks)
    })
};

exports.create_test = async function (req, res) {
    return new Promise(
        async function (resolve, reject) {
            try {
                let params = req.body;

                req.log.info(`Create test with name '${params.testname}', params: '${JSON.stringify(params)}'`);

                let opts = {
                    name: params.name,
                    status: params.status,
                    viewport: params.viewport,
                    browserName: params.browser,
                    browserVersion: params.browserVersion,
                    os: params.os,
                    startDate: new Date(),
                }

                let run;
                if (params.run) {
                    run = await orm.createRunIfNotExist({name: params.run});
                    opts.run = run.id;
                }
                const test = await orm.createTest(opts);

                res.json(test);
                resolve([req, res, test]);

            } catch (e) {
                reject(e);
                fatalError(req, res, e)
            }
        });
};

exports.stop_session = async function (req, res) {
    return new Promise(async function (resolve, reject) {
        try {
            let testId = req.params.testid;
            // let opts = req.body;
            await waitUntil(async () => {
                return (await Check.find({test: testId}).exec())
                    .filter(ch => ch.status.toString() !== 'pending').length > 0;
            });
            const checksGroup = await checksGroupedByIdent({test: testId});
            const groupStatuses = Object.keys(checksGroup).map(group => checksGroup[group].status);
            // console.log(JSON.stringify(checksGroup, null, "\t"));
            const groupViewPorts = Object.keys(checksGroup).map(group => checksGroup[group].viewport);
            // console.log({groupViewPorts});
            const uniqueGroupViewports = Array.from(new Set(groupViewPorts));
            let testViewport;
            if (uniqueGroupViewports.length === 1)
                testViewport = uniqueGroupViewports[0];
            else
                testViewport = uniqueGroupViewports.length

            let testStatus = 'not set';
            if (groupStatuses.some(st => st === 'failed'))
                testStatus = 'Failed'
            if (groupStatuses.some(st => st === 'passed')
                && !groupStatuses.some(st => st === 'failed'))
                testStatus = 'Passed'
            if (groupStatuses.some(st => st === 'new')
                && !groupStatuses.some(st => st === 'failed'))
                testStatus = 'Passed'
            if (groupStatuses.some(st => st === 'blinking')
                && !groupStatuses.some(st => st === 'failed'))
                testStatus = 'Passed'
            if (groupStatuses.every(st => st === 'new'))
                testStatus = 'New'
            const blinkingCount = groupStatuses.filter(g => g === 'blinking').length;
            const updatedTest = await updateTest({
                id: testId,
                status: testStatus,
                blinking: blinkingCount,
                calculatedViewport: testViewport
                // viewport: await this.getViewport()
            }).catch(function (e) {
                console.log(`Cannot update session: ${e}`)
                throw (e.stack ? e.stack.split("\n") : e)
            })
            const result = updatedTest.toObject();
            result.calculatedStatus = testStatus;
            res.json(result);
            return resolve(result);
        } catch (e) {
            fatalError(req, res, e)
            return reject(e);
        }
    });
};

function updateTest(opts) {
    return new Promise(async function (resolve, reject) {
        try {
            const id = opts.id
            opts['updatedDate'] = Date.now();
            console.log(`UPDATE test id '${id}' with params '${JSON.stringify(opts)}'`);

            const tst = await Test.findByIdAndUpdate(id, opts).exec().catch(
                function (e) {
                    console.log(`Cannot update the test, error: '${e}'`);
                    return reject(e);
                }
            )
            tst.save().catch(
                function (e) {
                    console.log(`Cannot save the test, error: '${e}'`);
                    return reject(e);
                }
            )
            return resolve(tst);
        } catch (e) {
            reject(e);
        }
    })

}

exports.update_test = async function (req, res) {
    return new Promise(
        async function (resolve, reject) {
            try {
                let opts = req.body;
                let id = req.params.id;
                opts['updatedDate'] = Date.now();
                console.log(`UPDATE test id '${id}' with params '${JSON.stringify(opts)}'`);

                const tst = await Test.findByIdAndUpdate(id, opts).exec().catch(
                    function (e) {
                        console.log(`Cannot update the test, error: '${e}'`);
                        fatalError(req, res, e)
                        return reject(e);
                    }
                )
                tst.save().catch(
                    function (e) {
                        console.log(`Cannot save the test, error: '${e}'`);
                        fatalError(req, res, e)
                        return reject(e);
                    }
                )
                res.status(200).send(`Test with id: '${id}' was updated`);
                resolve(tst);
            } catch (e) {
                fatalError(req, res, e)
                return reject(e);
            }
        });
};

function removeTest(id) {
    return new Promise(function (resolve, reject) {
        try {
            console.log(`Try to delete all checks associated to test with ID: '${id}'`);
            Check.remove({test: id}).then(function (result) {
                console.log(`DELETE test with ID: '${id}'`);
                Test.findByIdAndDelete(id).then(function (out) {
                    return resolve(out);
                });
            })
        } catch (e) {
            return reject(e);
        }
    })
}

exports.remove_test = function (req, res) {
    return new Promise(async function (resolve, reject) {
        try {
            const id = req.params.id;
            removeTest(id).then(function (output) {
                res.status(200)
                    .send(`Test with id: '${id}' and all related checks were removed
                        output: '${JSON.stringify(output)}'`);
                return resolve();
            });
        } catch (e) {
            fatalError(req, res, e);
            return reject(e);
        }
    })
};

exports.remove_suite = async function (req, res) {
    return new Promise(async function (resolve, reject) {
        try {
            const id = req.params.id;
            console.log(`DELETE test and checks which associate with the suite with ID: '${id}'`);
            const tests = await Test.find({suite: id});

            let results = []
            for (const test of tests) {
                results.push(removeTest(test._id));
            }

            Promise.all(results).then(function (result) {
                Suite.findByIdAndDelete(id).then(function (out) {
                    res.status(200)
                        .send(`Suite with id: '${id}' and all related tests and checks were removed
                    output: '${JSON.stringify(out)}'`);
                    return resolve();
                })
            })
        } catch (e) {
            return reject(e);
        }
    })
};

function prettyCheckParams(result) {
    if (!result.domDump)
        return JSON.stringify(result);
    const dump = JSON.parse(result.domDump);
    let resObs = {...result};
    delete resObs.domDump;
    resObs.domDump = JSON.stringify(dump).substr(0, 20) + `... and about ${dump.length} items]`
    return JSON.stringify(resObs);
}

exports.create_check = async function (req, res) {
    return new Promise(async function (resolve, reject) {
            let test;
            let suite;
            try {
                console.log(`CREATE check name: '${prettyCheckParams(req.body.name)}'`);
                let executionTimer = process.hrtime()
                checkRequestBody: {
                    if (!req.body.testid) {
                        const errMsg = `Cannot create check without 'testid' parameter, try to initialize session at first. parameters: '${JSON.stringify(req.body)}'`
                        res.status(400)
                            .send({
                                status: 'paramNotFound',
                                message: errMsg
                            });
                        reject(errMsg);
                        return
                    }
                    if (!req.body.hashcode) {
                        const errMsg = `Cannot create check without 'hashcode' parameter, parameters: '${JSON.stringify(req.body)}'`;
                        res.status(400)
                            .send({
                                status: 'paramNotFound',
                                message: errMsg
                            });
                        reject(errMsg);
                        return
                    }

                    console.log(`Try to find test with id: '${req.body.testid}'`);
                    test = await Test.findById(req.body.testid).exec();
                    if (!test) {
                        const errMsg = `Error: Can not find test with id: '${req.body.testid}', parameters: '${JSON.stringify(req.body)}'`
                        res.status(400)
                            .send({
                                status: 'testNotFound',
                                message: errMsg
                            });

                        reject(errMsg)
                        return
                    }
                }
                suite = await orm.createSuiteIfNotExist({name: req.body.suitename || 'Others'});
                orm.updateItem('VRSTest', {_id: test.id}, {suite: suite.id});

                let params = {
                    testname: req.body.testname,
                    test: req.body.testid,
                    name: req.body.name,
                    viewport: req.body.viewport,
                    browserName: req.body.browserName,
                    browserVersion: req.body.browserVersion,
                    os: req.body.os,
                    updatedDate: Date.now(),
                    suite: suite.id,
                    app: (await orm.createAppIfNotExist({name: req.body.appName || 'Unknown'})).id,
                    domDump: req.body.domdump,
                    run: test.run
                }

                const fileData = req.files ? req.files.file.data : false
                /**
                 * Usually there is two stage of checking request:
                 * Phase I
                 *   1. Client sends request with 'req.body.hashcode' value but without 'req.files.file.data'
                 *   2. Server finds for snapshot with this image 'hashcode' and if found - go to Step 3 of Phase2,
                 *      if not - sends response "{status: 'requiredFileData', message: 'cannot found an image with this hashcode,
                 *      please add image file data and resend request'}"
                 * Phase2
                 *   1. Client receives response with incomplete status and resend the same request but with 'req.files.file.data' parameter
                 *   2. Server create a new snapshot based on parameters
                 *   3. Server handle checking the snapshoot and return to client check response with one of 'complete` status (eq:. new, failed, passed)
                 */
                const snapshotFoundedByHashcode = await getSnapshotByImgHash(req.body.hashcode);
                if (!req.files && !snapshotFoundedByHashcode) {
                    console.log(`Cannot find snapshoot with hash: '${req.body.hashcode}', response with 206, 'requiredFileData' message`)
                    res.status(206).json({
                        status: 'requiredFileData',
                        message: 'cannot found an image with this hashcode, please add image file data and resend request',
                        hashCode: req.body.hashcode
                    })
                    resolve()
                    return
                }
                if (snapshotFoundedByHashcode) {
                    console.log(`FOUND snapshoot by hashcode: '${JSON.stringify(snapshotFoundedByHashcode)}'`)
                }
                let currentSnapshot, baselineSnapshoot, actualSnapshot

                // check MUST be identified by Name, OS, Browser, Viewport, App
                const checkIdentifier = {
                    name: params.name,
                    os: params.os,
                    browserName: params.browserName,
                    viewport: params.viewport,
                    app: params.app,
                };
                const lastSuccessCheck = await getLastSuccessCheck(checkIdentifier);
                handleBaseline:{

                    console.log(`Find for baseline for check with identifier: '${JSON.stringify(checkIdentifier)}'`);
                    const lastCheck = await getLastCheck(checkIdentifier);

                    const previousBaselineId = lastCheck ? lastCheck.baselineId : null;
                    currentSnapshot = snapshotFoundedByHashcode || (await createSnapshotIfNotExist({
                        params: req.body,
                        fileData: fileData,
                        hashCode: req.body.hashcode
                    }));
                    if (previousBaselineId) {
                        console.log(`A baseline for check name: '${req.body.name}', id: '${previousBaselineId}' is already exists`);
                        params.baselineId = previousBaselineId;

                        console.log(`Creating an actual snapshot for check with name: '${req.body.name}'`);

                        actualSnapshot = currentSnapshot
                        baselineSnapshoot = await Snapshot.findById(previousBaselineId);
                        params.actualSnapshotId = actualSnapshot.id;
                        params.status = 'pending';
                    } else {
                        console.log(`A baseline snapshot for previous check with name: '${req.body.name}', does not exist creating new one`);
                        const baseline = currentSnapshot
                        baselineSnapshoot = currentSnapshot
                        params.baselineId = baseline.id;
                        params.status = 'new';
                    }
                }
                console.log(`Create and save new check with params: '${prettyCheckParams(params)}'`);
                let check = await Check.create(params);

                let resultResponse;
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
                let totalCheckHandleTime;
                let compareResult;
                if (check.status.toString() !== 'new') {
                    compareResult = await compareSnapshots(baselineSnapshoot, actualSnapshot);
                    if (compareResult.misMatchPercentage !== '0.00') {
                        console.log(`Saving diff snapshot for check with Id: '${check.id}'`);
                        const diffSnapshot = await createSnapshotIfNotExist({
                            params: req.body,
                            fileData: compareResult.getBuffer()
                        });
                        updateParams['diffId'] = diffSnapshot.id;
                        updateParams['status'] = 'failed';
                    } else {
                        updateParams['status'] = 'passed';
                    }

                    console.log(`Update check with params: '${JSON.stringify(updateParams)}'`);
                    updateParams['updatedDate'] = Date.now();
                    totalCheckHandleTime = process.hrtime(executionTimer).toString()

                    compareResult['totalCheckHandleTime'] = totalCheckHandleTime;
                    console.log({compareResult})
                    updateParams['result'] = JSON.stringify(compareResult, null, "\t");

                    await check.updateOne(updateParams);
                    resultResponse = await Check.findById(check.id);
                }
                const result = Object.assign({}, resultResponse.toObject(),
                    {
                        executeTime: totalCheckHandleTime,
                        lastSuccess: lastSuccessCheck ? (lastSuccessCheck).id : null
                    })
                res.json(result);
                resolve([req, res, result]);
            } catch (e) {
                fatalError(req, res, e);
                return reject(e);
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
            opts['updatedDate'] = Date.now();
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
                            return reject(e);
                        });
                })
                .catch(
                    (e) => {
                        res.status(400)
                            .send(`Cannot update a check with id: '${id}', error: ${e}`);
                        return reject(e);
                    }
                );

        } catch (e) {
            fatalError(req, res, e);
            return reject(e);
        }
    })

};

exports.update_snapshot = async function (req, res) {
    return new Promise(async function (resolve, reject) {
        try {
            let opts = req.body;
            let id = req.params.id;
            opts['updatedDate'] = Date.now();
            console.log(`UPDATE snapshot id: '${id}' with params: '${JSON.stringify(req.params)}', body: '${JSON.stringify(opts)}'`);
            const snp = await Snapshot.findByIdAndUpdate(id, opts).exec().catch(
                function (e) {
                    console.log(`Cannot update a snapshot with id: '${id}', error: ${e}`);
                    fatalError(req, res, e);
                    return reject(e)
                }
            );
            await snp.save()
            console.log(`Snapshot with id: '${id}' and opts: '${JSON.stringify(opts)}' was updated`);
            res.status(200)
                .json({item: 'Snapshot', action: 'update', id: id, opts: opts})
        } catch (e) {
            fatalError(req, res, e);
            return reject(e);
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
            return reject(e);
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
            return reject(e);
        }
    })
};
