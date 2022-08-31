const catchAsync = require('../utils/catchAsync');
const { logsService } = require('../services');
const pick = require('../utils/pick');

const getLogs = catchAsync(async (req, res) => {
    const filter = req.query.filter ? JSON.parse(pick(req.query, ['filter']).filter) : {};
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await logsService.queryLogs(filter, options);
    res.send(result);
});

module.exports = {
    getLogs,
};
