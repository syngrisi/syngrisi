/* eslint-disable valid-jsdoc */
const { Log } = require('../models');

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryLogs = async (filter, options) => Log.paginate(filter, options);

const distinct = async (field) => Log.distinct(field);
const log = require("../../../dist/src/server/lib/logger").default;

const createLogs = async (body) => {
    log[body.level || 'debug'](body.message,
        {
            user: body.user,
            scope: body.scope || 'test_scope',
            msgType: body.msgType || 'TEST_MSG_TYPE',
        });
    return { message: 'success' };
};

module.exports = {
    queryLogs,
    distinct,
    createLogs,
};
