/* eslint-disable valid-jsdoc,no-restricted-syntax,no-await-in-loop */
const { Test, Run } = require('../models');
const log2 = require("../../../dist/src/server/lib/logger2").default;

const testService = require('./test.service');

const fileLogMeta = {
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
    log2.info(`remove run with, id: '${id}', user: '${user.username}'`, fileLogMeta, logOpts);
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
