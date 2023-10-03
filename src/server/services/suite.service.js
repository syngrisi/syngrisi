/* eslint-disable valid-jsdoc,no-restricted-syntax,no-await-in-loop */
const mongoose = require('mongoose');

const Test = mongoose.model('VRSTest');
const Suite = mongoose.model('VRSSuite');
const testService = require('./test.service');

const $this = this;
$this.logMeta = {
    scope: 'suite_service',
    msgType: 'SUITE',
};

/**
 * Remove a suite
 * @param {String} id - suite id
 * @param {Object} user - current user
 * @returns {Promise<Run>}
 */
const remove = async (id, user) => {
    const logOpts = {
        scope: 'removeSuite',
        itemType: 'suite',
        ref: id,
        user: user?.username,
        msgType: 'REMOVE',
    };
    log.info(`remove suite with, id: '${id}', user: '${user.username}'`, $this, logOpts);
    const tests = await Test.find({ suite: id })
        .exec();

    for (const test of tests) {
        await testService.remove(test._id, user);
    }
    const suite = await Suite.findByIdAndRemove(id)
        .exec();
    return suite;
};

module.exports = {
    remove,
};
