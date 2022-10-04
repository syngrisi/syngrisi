/* eslint-disable valid-jsdoc */
const mongoose = require('mongoose');

const $this = this;
$this.logMeta = {
    scope: 'generic.service',
    msgType: 'LOF',
};

/**
 * Query for users
 * @param {String} modelName - Item Name
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const get = async (modelName, filter, options) => {
    const itemModel = mongoose.model(modelName);
    return itemModel.paginate(filter, options);
};

module.exports = {
    get,
};
