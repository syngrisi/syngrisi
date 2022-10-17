/* eslint-disable valid-jsdoc */
const mongoose = require('mongoose');

const Test = mongoose.model('VRSTest');
const Run = mongoose.model('VRSRun');
const testService = require('./test.service');

const $this = this;
$this.logMeta = {
    scope: 'run_service',
    msgType: 'RUN',
};

/**
 * Remove a run
 * @param {String} id - run id
 * @param {Object} user - current user
 * @returns {Promise<Run>}
 */
const remove = async (id, user) => {
    const logOpts = {
        scope: 'removeRun',
        itemType: 'run',
        ref: id,
        user: user?.username,
        msgType: 'REMOVE',
    };
    log.info(`remove run with, id: '${id}', user: '${user.username}'`, $this, logOpts);
    const tests = await Test.find({ run: id })
        .exec();

    for (const test of tests) {
        await testService.remove(test._id, user);
    }
    const run = await Run.findByIdAndRemove(id)
        .exec();
    return run;
};

module.exports = {
    remove,
};
