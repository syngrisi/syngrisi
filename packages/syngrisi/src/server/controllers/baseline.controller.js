const httpStatus = require('http-status');
const { catchAsync } = require('../utils');
// const { genericService } = require('../services');
const { genericService } = require('../../../dist/src/server/services');

const { deserializeIfJSON, pick } = require('../utils');

const { ApiError } = require('../utils');


const get = catchAsync(async (req, res) => {
    const filter = req.query.filter ? deserializeIfJSON(pick(req.query, ['filter']).filter) : {};
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
    const result = await genericService.get('VRSBaseline', filter, options);
    res.send(result);
});

const put = catchAsync(async (req, res) => {
    const { id } = req.params;
    if (!id) throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot update the baseline - Id not found');
    const result = await genericService.put('VRSBaseline', id, req.body, req?.user);
    res.send(result);
});

module.exports = {
    get,
    put,
};
