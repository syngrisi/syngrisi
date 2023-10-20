const httpStatus = require('http-status');
const { EJSON } = require('bson');
const catchAsync = require('../utils/catchAsync');
const { usersService } = require('../services');
const pick = require('../utils/pick');

const $this = this;
$this.logMeta = {
    scope: 'users',
};

const current = catchAsync(async (req, res) => {
    const logOpts = {
        scope: 'users',
        msgType: 'GET_CURRENT_USER',
    };
    log.debug(`current user is: '${req?.user?.username || 'not_logged'}'`, $this, logOpts);
    res.status(httpStatus.OK)
        .json({
            id: req?.user?.id,
            username: req?.user?.username,
            firstName: req?.user?.firstName,
            lastName: req?.user?.lastName,
            role: req?.user?.role,
        });
});

const getUsers = catchAsync(async (req, res) => {
    const filter = req.query.filter ? EJSON.parse(pick(req.query, ['filter']).filter) : {};
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await usersService.queryUsers(filter, options);
    res.send(result);
});

const createUser = catchAsync(async (req, res) => {
    try {
        const user = await usersService.createUser(req.body);
        res.status(httpStatus.CREATED)
            .send(user);
    } catch (e) {
        if (e.statusCode) {
            log.error(e.stack || e.toString(), $this);
            res.status(e.statusCode)
                .json({ message: e.message });
        } else {
            throw e;
        }
    }
});

const updateUser = catchAsync(async (req, res) => {
    const user = await usersService.updateUserById(req.params.userId, req.body);
    res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
    await usersService.deleteUserById(req.params.userId);
    res.status(httpStatus.NO_CONTENT)
        .send();
});

module.exports = {
    current,
    createUser,
    updateUser,
    deleteUser,
    getUsers,
};
