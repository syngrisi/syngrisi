/* eslint-disable indent,no-useless-escape */
// eslint-disable-next-line no-unused-vars
const httpStatus = require('http-status');
// eslint-disable-next-line no-unused-vars
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { genericService } = require('../services');
const { deserializeIfJSON, pick } = require('../utils');

const get = catchAsync(async (req, res) => {
    const filter = req.query.filter ? deserializeIfJSON(pick(req.query, ['filter']).filter) : {};
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
    const result = await genericService.get('VRSCheck', filter, options);
    res.send(result);
});

module.exports = {
    get,
};
