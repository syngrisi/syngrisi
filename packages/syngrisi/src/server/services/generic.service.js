/* eslint-disable valid-jsdoc */
const mongoose = require('mongoose');
const { removeEmptyProperties } = require('../utils/utils');
const log2 = require("../../../dist/src/server/lib/logger2").default;

const fileLogMeta = {
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

const put = async (modelName, id, options, user) => {
    const itemModel = mongoose.model(modelName);

    const logOpts = {
        scope: 'generic.service.put',
        ref: id,
        itemType: modelName,
        msgType: 'UPDATE',
        user: user?.username,
    };

    const opts = removeEmptyProperties(options);
    // eslint-disable-next-line max-len
    log2.debug(`start update '${modelName}' with id: '${id}', body: '${JSON.stringify(opts)}'`, fileLogMeta, logOpts);
    const item = await itemModel.findByIdAndUpdate(id, options)
        .exec();

    await item.save();
    log2.debug(`baseline with id: '${id}' and opts: '${JSON.stringify(opts)}' was updated`, fileLogMeta, logOpts);
    return item;
};

module.exports = {
    get,
    put,
};
