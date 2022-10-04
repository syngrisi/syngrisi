/* eslint-disable valid-jsdoc */
const mongoose = require('mongoose');

const App = mongoose.model('VRSApp');

const $this = this;
$this.logMeta = {
    scope: 'logs_service',
    msgType: 'LOG',
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
const get = async (filter, options) => App.paginate(filter, options);

module.exports = {
    get,
};
