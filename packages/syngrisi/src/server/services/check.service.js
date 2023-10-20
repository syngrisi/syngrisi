/* eslint-disable valid-jsdoc */
const mongoose = require('mongoose');

const Check = mongoose.model('VRSCheck');
const Test = mongoose.model('VRSTest');
const Suite = mongoose.model('VRSSuite');
const Baseline = mongoose.model('VRSBaseline');
const { calculateAcceptedStatus, buildIdentObject } = require('../utils/utils');
// const { createNewBaseline } = require('../../mvc/controllers/api/api_controller');
const testUtil = require('../utils/tests');
const checkUtil = require('../utils/check');
const orm = require('../../../lib/dbItems');

const $this = this;
$this.logMeta = {
    scope: 'check_service',
    msgType: 'CHECK',
};

const validateBaselineParam = (params) => {
    const mandatoryParams = ['markedAs', 'markedById', 'markedByUsername', 'markedDate'];
    // eslint-disable-next-line no-restricted-syntax
    for (const param of mandatoryParams) {
        if (!param) {
            const errMsg = `invalid baseline parameters, '${param}' is empty, params: ${JSON.stringify(params)}`;
            log.error(errMsg);
            throw new Error(errMsg);
        }
    }
};

async function createNewBaseline(params) {
    validateBaselineParam(params);

    const identFields = buildIdentObject(params);

    const lastBaseline = await Baseline.findOne(identFields)
        .exec();

    const sameBaseline = await Baseline.findOne({ ...identFields, ...{ snapshootId: params.actualSnapshotId } })
        .exec();

    const baselineParams = lastBaseline?.ignoreRegions
        ? { ...identFields, ...{ ignoreRegions: lastBaseline.ignoreRegions } }
        : identFields;

    if (sameBaseline) {
        log.debug(`the baseline with same ident and snapshot id: ${params.actualSnapshotId} already exist`, $this);
    } else {
        log.debug(`the baseline with same ident and snapshot id: ${params.actualSnapshotId} does not exist,
         create new one, baselineParams: ${JSON.stringify(baselineParams)}`, $this);
    }

    log.silly({ sameBaseline });

    const resultedBaseline = sameBaseline || await Baseline.create(baselineParams);

    resultedBaseline.markedAs = params.markedAs;
    resultedBaseline.markedById = params.markedById;
    resultedBaseline.markedByUsername = params.markedByUsername;
    resultedBaseline.lastMarkedDate = params.markedDate;
    resultedBaseline.createdDate = new Date();
    resultedBaseline.snapshootId = params.actualSnapshotId;

    return resultedBaseline.save();
}

/**
 * Accept a check
 * @param {String} id - check id
 * @param {Object} user - current user
 * @param {String} baselineId -new baseline id
 * @returns {Promise<Check>}
 */
const accept = async (id, baselineId, user) => {
    const logOpts = {
        msgType: 'ACCEPT',
        itemType: 'check',
        ref: id,
        user: user?.username,
        scope: 'accept',
    };
    log.debug(`accept check: ${id}`, $this, logOpts);
    const check = await Check.findById(id)
        .exec();
    const test = await Test.findById(check.test)
        .exec();

    /** update check */
    const opts = {};
    opts.markedById = user._id;
    opts.markedByUsername = user.username;
    opts.markedDate = new Date();
    opts.markedAs = 'accepted';
    opts.status = (check.status[0] === 'new') ? 'new' : 'passed';
    opts.updatedDate = Date.now();
    opts.baselineId = baselineId;

    log.debug(`update check id: '${id}' with opts: '${JSON.stringify(opts)}'`,
        $this, logOpts);

    Object.assign(check, opts);
    log.debug(`update check with options: '${JSON.stringify(check.toObject())}'`, $this, logOpts);
    await createNewBaseline(check.toObject());
    await check.save();

    /** update test statuses and date, suite date */
    const testCalculatedStatus = await testUtil.calculateTestStatus(check.test);

    const testCalculatedAcceptedStatus = await calculateAcceptedStatus(check.test);

    test.status = testCalculatedStatus;
    test.markedAs = testCalculatedAcceptedStatus;
    test.updatedDate = new Date();

    await Suite.findByIdAndUpdate(check.suite, { updatedDate: Date.now() });
    log.debug(`update test with status: '${testCalculatedStatus}', marked: '${testCalculatedAcceptedStatus}'`,
        $this,
        {
            msgType: 'UPDATE',
            itemType: 'test',
            ref: test._id,
        });
    await test.save();
    await check.save();
    log.debug(`check with id: '${id}' was updated`, $this, logOpts);
    return check;
};

/**
 * Remove a chek
 * @param {String} id - check id
 * @param {Object} user - current user
 * @returns {Promise<Check>}
 */
const remove = async (id, user) => {
    const logOpts = {
        scope: 'removeCheck',
        itemType: 'check',
        ref: id,
        user: user?.username,
        msgType: 'REMOVE',
    };
    log.info(`remove check with, id: '${id}', user: '${user.username}'`, $this, logOpts);
    return checkUtil.removeCheck(id);
};

const update = async (id, opts, user) => {
    const logOpts = {
        msgType: 'UPDATE',
        itemType: 'check',
        ref: id,
        user,
        scope: 'updateCheck',
    };
    log.debug(`update check with id '${id}' with params '${JSON.stringify(opts, null, 2)}'`,
        $this, logOpts);

    const check = await Check.findOneAndUpdate({ _id: id }, opts, { new: true })
        .exec();
    const test = await Test.findOne({ _id: check.test })
        .exec();

    test.status = await testUtil.calculateTestStatus(check.test);

    await orm.updateItemDate('VRSCheck', check);
    await orm.updateItemDate('VRSTest', test);
    await test.save();
    await check.save();
    return check;
};

module.exports = {
    accept,
    remove,
    update,
};
