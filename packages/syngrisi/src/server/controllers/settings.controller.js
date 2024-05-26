const { catchAsync } = require('../utils');

const getSettings = catchAsync(async (req, res) => {
    const result = global.AppSettings.cache;
    res.json(result);
});

const updateSetting = catchAsync(async (req, res) => {
    const { name } = req.params;
    // console.log(req.body, name);
    await global.AppSettings.set(name, req.body.value);
    if (req.body.enabled === false) {
        await global.AppSettings.disable(name);
    } else {
        await global.AppSettings.enable(name);
    }
    res.json({ message: 'success' });
});

module.exports = {
    getSettings,
    updateSetting,
};
