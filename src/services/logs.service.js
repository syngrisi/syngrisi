/* eslint-disable valid-jsdoc */
// const httpStatus = require('http-status');
const mongoose = require('mongoose');

const Log = mongoose.model('VRSLog');
// const ApiError = require('../utils/ApiError');

const $this = this;
$this.logMeta = {
    scope: 'logs_service',
    msgType: 'LOF',
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryLogs = async (filter, options) => {
    const users = await Log.paginate(filter, options);
    return users;
};

module.exports = {
    queryLogs,
};
