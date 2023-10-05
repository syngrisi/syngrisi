/* eslint-disable valid-jsdoc */
const mongoose = require('mongoose');
const { removeEmptyProperties, fatalError } = require('../utils/utils');

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

const put = async (modelName, id, options, user) => {
    const $this = this;

    const itemModel = mongoose.model(modelName);

    const logOpts = {
        scope: 'generic.service.put',
        ref: id,
        itemType: modelName,
        msgType: 'UPDATE',
    };

    const opts = removeEmptyProperties(options);
    // eslint-disable-next-line max-len
    log.debug(`start update '${modelName}' with id: '${id}', body: '${JSON.stringify(opts)}'`, $this, logOpts);
    const item = await itemModel.findByIdAndUpdate(id, options)
        .exec();

    await item.save();
    log.debug(`baseline with id: '${id}' and opts: '${JSON.stringify(opts)}' was updated`, $this, logOpts);
    return item;
};

module.exports = {
    get,
    put,
};
