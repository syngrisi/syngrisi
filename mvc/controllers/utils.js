/* eslint-disable dot-notation,object-shorthand */
/* global log:readonly */
const mongoose = require('mongoose');

const moment = require('moment');

const Check = mongoose.model('VRSCheck');

const Test = mongoose.model('VRSTest');

const Run = mongoose.model('VRSRun');

const Suite = mongoose.model('VRSSuite');

const ident = ['name', 'viewport', 'browserName', 'os', 'app', 'branch'];
exports.ident = ident;

/**
 * Returns check `Ident` object
 * @param {Object} params  - plain object with bunch of properties
 * @returns {Object} - plain object with only ident properties
 */
exports.buildIdentObject = (params) => Object.fromEntries(
    Object.entries(params)
        .filter(([key]) => ident.includes(key))
);

const checkIdent = function checkIdent(check) {
    return ident.reduce((accumulator, prop) => `${accumulator}.${check[prop]}`, 'ident');
};
exports.checkIdent = checkIdent;

// parse uniques suites that are in the tests with particular find query
exports.getSuitesByTestsQuery = async function (query) {
    const sutesIds = await Test
        .find(query)
        .distinct('suite');
    const suites = await Suite.find(
        { _id: { $in: sutesIds } }
    )
        .sort({ name: 'asc' });
    return suites;
};

exports.getRunsByTestsQuery = async function (query, limit = 150) {
    const runsIds = await Test
        .find(query)
        .distinct('run');
    const runs = await Run.find({ _id: { $in: runsIds } })
        .limit(limit)
        .sort({ updatedDate: -1 });
    return runs;
};

exports.buildQuery = function buildQuery(params) {
    const querystring = require('querystring');
    const query = Object.keys(params)
        .filter((key) => key.startsWith('filter_'))
        .reduce((obj, key) => {
            const props = key.split('_');
            const name = props[1] === 'id' ? '_id' : props[1];
            const operator = props[2];
            const value = decodeURI(params[key]);
            const decodedValue = Object.keys(querystring.decode(value))[0];
            obj[`${name}`] = { [`$${operator}`]: decodedValue };
            if (operator === 'regex') {
                obj[`${name}`]['$options'] = 'i';
            }
            return obj;
        }, {});

    return query;
};

function groupStatus(checks) {
    const statuses = checks.map((check) => check.status[0]);
    const lastStatus = statuses[statuses.length - 1];
    let resultStatus = 'not set';

    if (statuses.includes('failed')) {
        resultStatus = 'failed';
    }
    if (statuses.includes('failed') && lastStatus === 'passed') {
        resultStatus = 'blinking';
    }
    if (!statuses.includes('failed')) {
        resultStatus = 'passed';
    }
    if (lastStatus === 'new') {
        resultStatus = 'new';
    }
    return resultStatus;
}

function groupViewPort(checks) {
    return checks[0].viewport;
}

const fatalError = function fatalError(req, res, e) {
    const errMsg = e.stack ? `Fatal error: '${e}' \n  '${e.stack}'` : `Fatal error: ${e} \n`;
    req.log.fatal(errMsg);
    log.error(errMsg);
    res.status(500)
        .json({
            status: 'fatalError',
            message: errMsg,
        });
};

exports.fatalError = fatalError;

exports.removeEmptyProperties = function removeEmptyProperties(obj) {
    return Object.fromEntries(Object.entries(obj)
        .filter(([_, v]) => (v != null) && (v !== '')));
};

exports.checksGroupedByIdent = function checksGroupedByIdent(checkFilter) {
    return new Promise(async (resolve, reject) => {
        try {
            const chs = await Check.find(checkFilter)
                .exec();
            const checks = chs.map((ch) => {
                ch.formattedCreatedDate = moment(ch.createdDate)
                    .format('YYYY-MM-DD hh:mm');
                return ch;
            });
            const result = {};
            checks.forEach((check) => {
                if (result[checkIdent(check)] === undefined) {
                    result[checkIdent(check)] = {};
                    result[checkIdent(check)]['checks'] = [];
                }
                result[checkIdent(check)]['checks'].push(check);
            });
            for (const groupIdent in result) {
                result[groupIdent].status = groupStatus(result[groupIdent].checks);
            }
            for (const groupIdent in result) {
                result[groupIdent].viewport = groupViewPort(result[groupIdent].checks);
            }
            resolve(result);
        } catch (e) {
            console.error(e);
            // fatalError(req, res, e);
            return reject(e);
        }
    });
};

exports.checksGroupedByIdent2 = function checksGroupedByIdent2(testId) {
    Check.find({ test: testId })
        .sort({ updatedDate: 1 })
        .then((checks) => {
            const result = {};
            checks.forEach((check) => {
                if (result[checkIdent(check)] === undefined) {
                    result[checkIdent(check)] = {};
                    result[checkIdent(check)]['checks'] = [];
                }
                result[checkIdent(check)]['checks'].push(check);
            });
            // transform ident group object to array
            const result2 = Object.keys(result)
                .map((idnt) => ({
                    ident: idnt,
                    checks: result[idnt].checks,
                    status: groupStatus(result[idnt].checks),
                    viewport: groupViewPort(result[idnt].checks),
                }));
            return result2;
        });
};

exports.waitUntil = async function waitUntil(cb, attempts = 5, interval = 700) {
    let result = false;
    let iteration = 0;
    while (result === false) {
        result = await cb();
        await new Promise((r) => setTimeout(r, interval));
        iteration += 1;

        if (iteration > attempts) {
            result = true;
        }
    }
    return result;
};

exports.calculateAcceptedStatus = async function calculateAcceptedStatus(testId) {
    const checksInTest = await Check.find({ test: testId });
    const statuses = checksInTest.map((x) => x.markedAs);
    if (statuses.length < 1) {
        return 'Unaccepted';
    }
    let testCalculatedStatus = 'Unaccepted';
    if (statuses.some((x) => x === 'accepted')) {
        testCalculatedStatus = 'Partially';
    }
    if (statuses.every((x) => x === 'accepted')) {
        testCalculatedStatus = 'Accepted';
    }
    // console.log({ testCalculatedStatus });
    return testCalculatedStatus;
};
