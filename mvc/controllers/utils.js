const mongoose = require('mongoose');
const Check = mongoose.model('VRSCheck');
const moment = require('moment');

const checkIdent = function checkIdent(check) {
    return ['name', 'viewport', 'browserName', 'os'].reduce((accumulator, prop) => accumulator + '.' + check[prop], 'ident')
}
exports.checkIdent = checkIdent;

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

fatalError = function fatalError(req, res, e) {
    const errMsg = e.stack ? `Fatal error: '${e}' \n  '${e.stack}'` : `Fatal error: ${e} \n`;
    req.log.fatal(errMsg);
    console.log(errMsg);
    res.status(500).json({status: 'fatalError', message: errMsg});
}

exports.fatalError = fatalError;

exports.checksGroupedByIdent = async function checksGroupedByIdent(checkFilter) {
    return new Promise(async function (resolve, reject) {
        try {
            // console.log(checkFilter)
            let chs = await Check.find(checkFilter)
                .sort({updatedDate: 1}).exec()
            let checks = chs.map(function (ch) {
                ch.formattedCreatedDate = moment(ch.createdDate)
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
            console.error(e);
            // fatalError(req, res, e);
            return reject(e);
        }
    })
}


exports.waitUntil = async function waitUntil(cb, attempts = 5, interval = 700) {
    let result = false;
    let iteration = 0;
    while (result === false) {
        result = await cb();
        await new Promise(r => setTimeout(r, interval));
        iteration = iteration + 1;

        if (iteration > attempts) {
            result = true;
        }
    }
    return result;
}
