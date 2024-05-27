/* eslint-disable valid-jsdoc,no-restricted-syntax,no-await-in-loop */
const { Test, Suite } = require('../models');
const testService = require('./test.service');
const log = require("../../../dist/src/server/lib/logger").default;


const fileLogMeta = {
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
    log.info(`remove suite with, id: '${id}', user: '${user.username}'`, fileLogMeta, logOpts);
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
