const mongoose = require('mongoose');
const snapshotUtil = require('./snapshots');
const { calculateAcceptedStatus } = require('../../utils');
const testUtil = require('./tests');
const orm = require('../../../../lib/dbItems');

const Check = mongoose.model('VRSCheck');
const Test = mongoose.model('VRSTest');

const $this = this;

$this.logMeta = {
    scope: 'check_helper',
    msgType: 'API',
};

module.exports.removeCheck = async function removeCheck(id) {
    const logOpts = {
        scope: 'removeCheck',
        itemType: 'check',
        ref: id,
        msgType: 'REMOVE',
    };

    try {
        const check = await Check.findByIdAndDelete(id)
            .exec();

        log.debug(`check with id: '${id}' was removed, update test: ${check.test}`, $this, logOpts);

        const test = await Test.findById(check.test)
            .exec();
        const testCalculatedStatus = await testUtil.calculateTestStatus(check.test);
        const testCalculatedAcceptedStatus = await calculateAcceptedStatus(check.test);
        test.status = testCalculatedStatus;
        test.markedAs = testCalculatedAcceptedStatus;
        test.updatedDate = new Date();
        await orm.updateItemDate('VRSSuite', check.suite);
        await test.save();

        if ((check.baselineId) && (check.baselineId !== 'undefined')) {
            log.debug(`try to remove the snapshot, baseline: ${check.baselineId}`, $this, logOpts);
            await snapshotUtil.removeSnapshot(check.baselineId?.toString());
        }

        if ((check.actualSnapshotId) && (check.baselineId !== 'undefined')) {
            log.debug(`try to remove the snapshot, actual: ${check.actualSnapshotId}`, $this, logOpts);
            await snapshotUtil.removeSnapshot(check.actualSnapshotId?.toString());
        }

        if ((check.diffId) && (check.baselineId !== 'undefined')) {
            log.debug(`try to remove snapshot, diff: ${check.diffId}`, $this, logOpts);
            await snapshotUtil.removeSnapshot(check.diffId?.toString());
        }
        return check;
    } catch (e) {
        const errMsg = `cannot remove a check with id: '${id}', error: '${e}'`;
        log.error(errMsg, $this, logOpts);
        throw new Error(errMsg);
    }
};
