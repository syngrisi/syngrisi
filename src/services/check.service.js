/* eslint-disable valid-jsdoc */
const mongoose = require('mongoose');

const Check = mongoose.model('VRSCheck');
const Test = mongoose.model('VRSTest');
const Suite = mongoose.model('VRSSuite');
const { calculateAcceptedStatus } = require('../../mvc/controllers/utils');
const { createNewBaseline } = require('../../mvc/controllers/api/api_controller');
const testUtil = require('../../mvc/controllers/api/utils/tests');
const checkUtil = require('../../mvc/controllers/api/utils/check');

const $this = this;
$this.logMeta = {
    scope: 'check_service',
    msgType: 'CHECK',
};

/**
 * Accept a chek
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

module.exports = {
    accept,
    remove,
};
