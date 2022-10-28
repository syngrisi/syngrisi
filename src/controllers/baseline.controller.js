const catchAsync = require('../utils/catchAsync');
const { genericService } = require('../services');
const { deserializeIfJSON, pick } = require('../utils');

const get = catchAsync(async (req, res) => {
    const filter = req.query.filter ? deserializeIfJSON(pick(req.query, ['filter']).filter) : {};
    const options = pick(req.query, ['sortBy', 'limit', 'page', 'populate']);
    const result = await genericService.get('VRSBaseline', filter, options);
    res.send(result);
});

module.exports = {
    get,
};
