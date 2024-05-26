/* eslint-disable valid-jsdoc */
const {
    Check,
    Test,
    Suite,
    Baseline,
} = require('../models');

const { calculateAcceptedStatus, buildIdentObject } = require('../utils');
const snapshotService = require("./snapshot.service");
const orm = require('../lib/dbItems');
const log2 = require("../../../dist/src/server/lib/logger2").default;

const fileLogMeta = {
    scope: 'check_service',
    msgType: 'CHECK',
};

async function calculateTestStatus(testId) {
    const checksInTest = await Check.find({ test: testId });
    const statuses = checksInTest.map((x) => x.status[0]);
    let testCalculatedStatus = 'Failed';
    if (statuses.every((x) => (x === 'new') || (x === 'passed'))) {
        testCalculatedStatus = 'Passed';
    }
    if (statuses.every((x) => (x === 'new'))) {
        testCalculatedStatus = 'New';
    }
    return testCalculatedStatus;
}


const validateBaselineParam = (params) => {
    const mandatoryParams = ['markedAs', 'markedById', 'markedByUsername', 'markedDate'];
    // eslint-disable-next-line no-restricted-syntax
    for (const param of mandatoryParams) {
        if (!param) {
            const errMsg = `invalid baseline parameters, '${param}' is empty, params: ${JSON.stringify(params)}`;
            log2.error(errMsg);
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
        log2.debug(`the baseline with same ident and snapshot id: ${params.actualSnapshotId} already exist`, fileLogMeta);
    } else {
        log2.debug(`the baseline with same ident and snapshot id: ${params.actualSnapshotId} does not exist,
         create new one, baselineParams: ${JSON.stringify(baselineParams)}`, fileLogMeta);
    }

    log2.silly({ sameBaseline });

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
    const logMeta = {
        msgType: 'ACCEPT',
        itemType: 'check',
        ref: id,
        user: user?.username,
        scope: 'accept',
    };
    log2.debug(`accept check: ${id}`, fileLogMeta, logMeta);
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

    log2.debug(`update check id: '${id}' with opts: '${JSON.stringify(opts)}'`,
        fileLogMeta, logMeta);

    Object.assign(check, opts);
    log2.debug(`update check with options: '${JSON.stringify(check.toObject())}'`, fileLogMeta, logMeta);
    await createNewBaseline(check.toObject());
    await check.save();

    /** update test statuses and date, suite date */
    const testCalculatedStatus = await calculateTestStatus(check.test);

    const testCalculatedAcceptedStatus = await calculateAcceptedStatus(check.test);

    test.status = testCalculatedStatus;
    test.markedAs = testCalculatedAcceptedStatus;
    test.updatedDate = new Date();

    await Suite.findByIdAndUpdate(check.suite, { updatedDate: Date.now() });
    log2.debug(`update test with status: '${testCalculatedStatus}', marked: '${testCalculatedAcceptedStatus}'`,
        fileLogMeta,
        {
            msgType: 'UPDATE',
            itemType: 'test',
            ref: test._id,
        });
    await test.save();
    await check.save();
    log2.debug(`check with id: '${id}' was updated`, fileLogMeta, logMeta);
    return check;
};

async function removeCheck(id, user) {
    const logMeta = {
        scope: 'removeCheck',
        itemType: 'check',
        ref: id,
        msgType: 'REMOVE',
        user: user?.username,
    };

    try {
        const check = await Check.findByIdAndDelete(id)
            .exec();

        log2.debug(`check with id: '${id}' was removed, update test: ${check.test}`, fileLogMeta, logMeta);

        const test = await Test.findById(check.test)
            .exec();
        const testCalculatedStatus = await calculateTestStatus(check.test);
        const testCalculatedAcceptedStatus = await calculateAcceptedStatus(check.test);
        test.status = testCalculatedStatus;
        test.markedAs = testCalculatedAcceptedStatus;
        test.updatedDate = new Date();
        await orm.updateItemDate('VRSSuite', check.suite);
        await test.save();

        if ((check.baselineId) && (check.baselineId !== 'undefined')) {
            log2.debug(`try to remove the snapshot, baseline: ${check.baselineId}`, fileLogMeta, logMeta);
            await snapshotService.remove(check.baselineId?.toString());
        }

        if ((check.actualSnapshotId) && (check.baselineId !== 'undefined')) {
            log2.debug(`try to remove the snapshot, actual: ${check.actualSnapshotId}`, fileLogMeta, logMeta);
            await snapshotService.remove(check.actualSnapshotId?.toString());
        }

        if ((check.diffId) && (check.baselineId !== 'undefined')) {
            log2.debug(`try to remove snapshot, diff: ${check.diffId}`, fileLogMeta, logMeta);
            await snapshotService.remove(check.diffId?.toString());
        }
        return check;
    } catch (e) {
        const errMsg = `cannot remove a check with id: '${id}', error: '${e.stack || e.toString()}'`;
        log2.error(errMsg, fileLogMeta, logMeta);
        throw new Error(errMsg);
    }
}


/**
 * Remove a chek
 * @param {String} id - check id
 * @param {Object} user - current user
 * @returns {Promise<Check>}
 */
const remove = async (id, user) => {
    const logMeta = {
        scope: 'removeCheck',
        itemType: 'check',
        ref: id,
        user: user?.username,
        msgType: 'REMOVE',
    };
    log2.info(`remove check with, id: '${id}', user: '${user.username}'`, fileLogMeta, logMeta);
    return removeCheck(id, user);
};

const update = async (id, opts, user) => {
    const logMeta = {
        msgType: 'UPDATE',
        itemType: 'check',
        ref: id,
        user,
        scope: 'updateCheck',
    };
    log2.debug(`update check with id '${id}' with params '${JSON.stringify(opts, null, 2)}'`,
        fileLogMeta, logMeta);

    const check = await Check.findOneAndUpdate({ _id: id }, opts, { new: true })
        .exec();
    const test = await Test.findOne({ _id: check.test })
        .exec();

    test.status = await calculateTestStatus(check.test);

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
