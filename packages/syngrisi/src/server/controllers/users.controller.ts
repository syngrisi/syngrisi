
import httpStatus from 'http-status';
import { EJSON } from 'bson';
import { ApiError, catchAsync, pick } from '@utils';
import { usersService } from '@services';
import log from "../lib/logger";
import { ExtRequest } from '@types';
import { Response } from "express";
import { errMsg } from '../utils/errMsg';

const current = catchAsync(async (req: ExtRequest, res: Response) => {
    const logOpts = {
        scope: 'users',
        msgType: 'GET_CURRENT_USER',
    };
    log.debug(`current user is: '${req?.user?.username || 'not_logged'}'`, logOpts);
    res.set('Cache-Control', 'no-store');
    res.status(httpStatus.OK).json({
        id: req?.user?.id,
        username: req?.user?.username,
        firstName: req?.user?.firstName,
        lastName: req?.user?.lastName,
        role: req?.user?.role,
    });
});

const get = catchAsync(async (req: ExtRequest, res: Response) => {
    const filter = typeof req.query.filter === 'string'
        ? EJSON.parse(req.query.filter)
        : {};

    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await usersService.queryUsers(filter, options);
    res.send(result);
});


const getById = catchAsync(async (req: ExtRequest, res: Response) => {
    const user = await usersService.getUserById(req.params.userId);
    res.send(user);
});

const create = catchAsync(async (req: ExtRequest, res: Response) => {
    const logOpts = {
        scope: 'users',
        msgType: 'CREATE',
    };

    try {
        const userData = pick(req.body, [
            'username',
            'firstName',
            'lastName',
            'role',
            'password',
            'apiKey',
            'expiration',
            'meta',
        ]);
        const user = await usersService.createUser(userData);
        res.status(httpStatus.CREATED).send(user);
    } catch (e: unknown) {
        if (e instanceof ApiError && e.statusCode) {
            log.error(e, logOpts);
            res.status(e.statusCode).json({ message: e.message });
        } else {
            log.error(errMsg(e), logOpts);
            throw e;
        }
    }
});

const update = catchAsync(async (req: ExtRequest, res: Response) => {
    const user = await usersService.updateUserById(req.params.userId, req.body);
    res.send(user);
});

const remove = catchAsync(async (req: ExtRequest, res: Response) => {
    await usersService.deleteUserById(req.params.userId);
    res.status(httpStatus.NO_CONTENT).send();
});

export {
    current,
    create,
    update,
    remove,
    get,
    getById,
};
