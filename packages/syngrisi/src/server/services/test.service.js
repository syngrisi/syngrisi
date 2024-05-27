/* eslint-disable no-restricted-syntax,no-await-in-loop */
const checkService = require('./check.service');
const { Test, Check } = require('../models');
const log = require("../../../dist/src/server/lib/logger").default;

const fileLogMeta = {
    scope: 'test_service',
    msgType: 'TEST',
};

/**
 * Query for test
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>} - result
 */
const queryTests = async (filter, options) => {
    const tests = await Test.paginate(filter, options);
    return tests;
};
const queryTestsDistinct = async (filter, options) => {
    const tests = await Test.paginateDistinct(filter, options);
    return tests;
};

/**
 * Remove a test
 * @param {String} id - test id
 * @param {Object} user - current user
 * @returns {Promise<Check>} - removed test
 */
const remove = async (id, user) => {
    const logOpts = {
        scope: 'removeTest',
        itemType: 'test',
        ref: id,
        user: user?.username,
        msgType: 'REMOVE',
    };
    log.info(`remove test with, id: '${id}', user: '${user.username}'`, fileLogMeta, logOpts);

    try {
        log.debug(`try to delete all checks associated to test with ID: '${id}'`, logOpts);
        const checks = await Check.find({ test: id });
        // eslint-disable-next-line no-restricted-syntax
        for (const check of checks) {
            // eslint-disable-next-line no-await-in-loop
            await checkService.remove(check._id, user);
        }
        return Test.findByIdAndDelete(id);
    } catch (e) {
        log.error(`cannot remove test with id: ${id} error: ${e.stack || e.toString()}`, logOpts);
        throw new Error();
    }
};

const accept = async (id, user) => {
    const logOpts = {
        scope: 'acceptTest',
        itemType: 'test',
        ref: id,
        user: user?.username,
        msgType: 'ACCEPT',
    };
    log.info(`accept test with, id: '${id}', user: '${user.username}'`, fileLogMeta, logOpts);

    const checks = await Check.find({ test: id })
        .exec();

    for (const check of checks) {
        await checkService.accept(check._id, check.actualSnapshotId, user);
    }
    return { message: 'success' };
};

module.exports = {
    queryTests,
    queryTestsDistinct,
    remove,
    accept,
};
