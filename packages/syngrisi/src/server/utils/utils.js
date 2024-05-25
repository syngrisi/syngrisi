/* eslint-disable dot-notation,object-shorthand */
// const moment = require('moment');
const { Check, Test, Run, Suite } = require('../models');

const ident = ['name', 'viewport', 'browserName', 'os', 'app', 'branch'];
exports.ident = ident;

/**
 * Returns check `Ident` object
 * @param {Object} params  - plain object with a bunch of properties
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
exports.getSuitesByTestsQuery = async (query) => {
    const suitesIds = await Test
        .find(query)
        .distinct('suite');
    const suites = await Suite.find(
        { _id: { $in: suitesIds } }
    )
        .sort({ name: 'asc' });
    return suites;
};

exports.getRunsByTestsQuery = async (query, limit = 150) => {
    const runsIds = await Test
        .find(query)
        .distinct('run');
    const runs = await Run.find({ _id: { $in: runsIds } })
        .limit(limit)
        .sort({ updatedDate: -1 });
    return runs;
};

exports.buildQuery = (params) => {
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

// const fatalError = function fatalError(req, res, e) {
//     const errMsg = e.stack ? `Fatal error: '${e}' \n  '${e.stack}'` : `Fatal error: ${e} \n`;
//     req.log.fatal(errMsg);
//     log.error(errMsg);
//     res.status(500)
//         .json({
//             status: 'fatalError',
//             message: errMsg,
//         });
// };

// exports.fatalError = fatalError;

exports.removeEmptyProperties = function removeEmptyProperties(obj) {
    return Object.fromEntries(Object.entries(obj)
        // eslint-disable-next-line no-unused-vars
        .filter(([_, v]) => (v != null) && (v !== '')));
};

exports.waitUntil = async function waitUntil(cb, attempts = 5, interval = 700) {
    let result = false;
    let iteration = 0;
    while (result === false) {
        // eslint-disable-next-line no-await-in-loop
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

module.exports.ProgressBar = class ProgressBar {
    constructor(length) {
        this.length = length;
        this.percentLenght = parseFloat(length / 100);
        this.prevPercent = 0;
        this.currentPercent = 0;
        this.progressString = '';
    }

    isChange(current) {
        this.currentPercent = parseInt(current / this.percentLenght, 10);
        if (this.prevPercent === this.currentPercent) {
            return false;
        }
        this.prevPercent = this.currentPercent;
        this.progressString += '#';
        return true;
    }

    writeIfChange(index, count, fn, res) {
        if (this.isChange(index)) {
            const placeholderString = Array.from(new Array(99 - this.currentPercent))
                .reduce(
                    (accum) => accum += '.',
                    ''
                );
            fn(`[${this.progressString}${placeholderString}](${index}/${count})`, res);
        }
    }
};
