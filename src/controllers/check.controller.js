const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { genericService, checkService } = require('../services');
const { deserializeIfJSON, pick } = require('../utils');

const get = catchAsync(async (req, res) => {
    const filter = req.query.filter ? deserializeIfJSON(pick(req.query, ['filter']).filter) : {};
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
    const result = await genericService.get('VRSCheck', filter, options);
    res.send(result);
});

const get_via_post = catchAsync(async (req, res) => {
    const filter = req.body.filter ? pick(req.body, ['filter']).filter : {};
    const options = req.body.options ? pick(req.body, ['options']).options : {};
    const result = await genericService.get('VRSCheck', filter, options);
    res.send(result);
});

const accept = catchAsync(async (req, res) => {
    const { id } = req.params;
    if (!id) throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot accept the check - Id not found');
    if (!req.body.baselineId) throw new ApiError(httpStatus.BAD_REQUEST, `Cannot accept the check: ${id} - new Baseline Id not found`);
    const result = await checkService.accept(id, req.body.baselineId, req?.user);
    res.send(result);
});

const remove = catchAsync(async (req, res) => {
    const { id } = req.params;
    if (!id) throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot remove the check - Id not found');
    const result = await checkService.remove(id, req?.user);
    res.send(result);
});

module.exports = {
    get_via_post,
    get,
    accept,
    remove,
};
