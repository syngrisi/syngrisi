'use strict';

const mongoose = require('mongoose');
const Snapshot = mongoose.model('VRSSnapshot');
const Check = mongoose.model('VRSCheck');
const Test = mongoose.model('VRSTest');
const Suite = mongoose.model('VRSSuite');
// const App = mongoose.model('VRSApp');
const moment = require('moment');
const {fatalError, checkIdent, checksGroupedByIdent} = require('./utils');

async function getSnapshotByImgHash(hash) {
    return (await Snapshot.find({imghash: hash}))[0];
}

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
            return reject(e);
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
            // console.log(groupChecks);
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
                test: test,
                suite: suite
            });
        } catch (e) {
            fatalError(req, res, e);
            return reject(e);
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
            const baselineId = opts.baselineid ? opts.baselineid : '';
            const diffId = opts.diffid ? opts.diffid : '';

            const moment = require('moment');
            snapshot.formattedCreatedDate = moment(snapshot.Created_date)
                .format('YYYY-MM-DD hh:mm');
            res.render('pages/snapshot', {
                snapshot: snapshot,
                baselineId: baselineId,
                diffId: diffId
            });
        } catch (e) {
            fatalError(req, res, e);
            return reject(e);
        }
    });
};

exports.diffview = async function (req, res) {
    return new Promise(async function (resolve, reject) {
        try {
            const opts = req.query;

            if (!opts.expectedid) {
                res.status(400)
                    .send(`Error: There is no "id" fields (actualid) in request query: ${JSON.stringify(opts)}`);
                return;
            }
            try {
                const baseline = await Snapshot.findById(`${opts.expectedid}`);
                baseline.formattedCreatedDate = moment(baseline.Created_date)
                    .format('YYYY-MM-DD hh:mm');

                let actual_snapshoot;
                let diff_snapshoot;

                // for new check case
                if (opts.actualid) {
                    actual_snapshoot = await Snapshot.findById(`${opts.actualid}`);
                    actual_snapshoot.formattedCreatedDate = moment(actual_snapshoot.Created_date)
                        .format('YYYY-MM-DD hh:mm');
                } else {
                    diff_snapshoot = baseline;
                    // actual_snapshoot = baseline;
                }

                // for passed check case
                if (opts.diffid) {
                    diff_snapshoot = await Snapshot.findById(`${opts.diffid}`);
                    diff_snapshoot.formattedCreatedDate = moment(diff_snapshoot.Created_date)
                        .format('YYYY-MM-DD hh:mm');
                } else {

                    diff_snapshoot = actual_snapshoot ? actual_snapshoot : baseline;
                }

                const check = await Check.findById(opts.checkid);
                const suite = await Suite.findById(`${check.suite}`);
                const test = await Test.findById(`${check.test}`);

                const checksWithSameName = await checksGroupedByIdent({name: check.name});

                let lastChecksWithSameName = [];
                for (const group of Object.values(checksWithSameName)) {
                    lastChecksWithSameName.push(group.checks[group.checks.length - 1]);
                }
                // console.log({lastChecksWithSameName});

                res.render('pages/diff', {
                    expected_snapshoot: baseline,
                    actual_snapshoot: actual_snapshoot,
                    diff_snapshoot: diff_snapshoot,
                    suite: suite,
                    test: test,
                    check: check,
                    lastChecksWithSameName: lastChecksWithSameName
                });
            } catch (e) {
                res.status(500)
                    .send(`Error preparing diff page: ${JSON.stringify(e)}`);
                return reject(e);
            }

        } catch (e) {
            fatalError(req, res, e);
            return reject(e);
        }
    });
};

exports.index = async function (req, res) {
    return new Promise(
        async function (resolve, reject) {
            try {
                let opts = req.query;
                let suiteFilter = {};
                let sortBy;
                if ((opts.sortprop === 'name')
                    || (opts.sortprop === 'status')
                    || (opts.sortprop === 'browserName')
                    || (opts.sortprop === 'suite')
                    || (opts.sortprop === 'os')
                    || (opts.sortprop === 'viewport')
                    || (opts.sortprop === 'Updated_date')) {
                    sortBy = opts.sortprop
                }
                sortBy = sortBy ? sortBy : 'Updated_date'
                const sortOrder = opts.sortorder ? opts.sortorder : -1;
                let sortFilter = {};
                sortFilter[sortBy] = sortOrder;

                const suite = await Suite.findOne({name: opts.suitename}).exec()
                if (suite)
                    suiteFilter = {suite: suite.id};
                const suites = await Suite.find({})
                    .sort({name: 'asc'}).exec()
                const tests = await Test.find(suiteFilter)
                    .sort(sortFilter).exec()
                tests.map(function (test) {
                    test.formattedUpdatedDate = moment(test.Updated_date)
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
                    currentSuite: suite,
                    checksByTestGroupedByIdent: checksByTestGroupedByIdent
                });
            } catch (e) {
                fatalError(req, res, e);
                return reject(e);
            }
        }
    )
};
