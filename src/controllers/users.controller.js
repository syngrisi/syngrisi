const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');

const $this = this;
$this.logMeta = {
    scope: 'users',
};

const current = catchAsync(async (req, res) => {
    const logOpts = {
        scope: 'users',
        msgType: 'GET_CURRENT_USER',
    };
    log.debug(`current user is: '${req?.user?.username}'`, $this, logOpts);
    res.status(httpStatus.OK)
        .json({
            id: req?.user?.id,
            username: req?.user?.username,
            firstName: req?.user?.firstName,
            lastName: req?.user?.lastName,
            role: req?.user?.role,
        });
});

module.exports = {
    current,
};
