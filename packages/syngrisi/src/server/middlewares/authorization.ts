/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils';
import { catchAsync } from '../utils';
import log from '../lib/logger';
// import { createLog } from '../controllers/logs.controller';
// import AppSettings from '../models/AppSettings';


export const authorization = (type: string) => {

    const types: { [key: string]: (req: any, res: Response, next: NextFunction) => any } = {
        admin: catchAsync(async (req: any, res: Response, next: NextFunction) => {
            const AppSettings = (global as any).AppSettings;
            if (!(await AppSettings.isAuthEnabled())) {
                return next();
            }
            if (req.user?.role === 'admin') {
                log.silly(`user: '${req.user?.username}' was successfully authorized, type: '${type}'`);
                return next();
            }
            log.warn(`user authorization: '${req.user?.username}' wrong role, type: '${type}'`);
            throw new ApiError(httpStatus.FORBIDDEN, 'Authorization Error - wrong Role');
        }),
        user: catchAsync(async (req: any, res: Response, next: NextFunction) => {
            const AppSettings = (global as any).AppSettings;

            // @ts-ignore
            if (!(await AppSettings.isAuthEnabled())) {
                return next();
            }
            if (req.user?.role === 'admin') {
                log.silly(`user: '${req.user?.username}' was successfully authorized, type: '${type}'`);
                return next();
            }
            if (
                type === 'user'
                && (req.user?.role === 'user' || req.user?.role === 'reviewer')
            ) {
                log.silly(`user: '${req.user?.username}' was successfully authorized, type: '${type}'`);
                return next();
            }
            log.warn(`user authorization: '${req.user?.username}' wrong role, type: '${type}'`);
            throw new ApiError(httpStatus.FORBIDDEN, 'Authorization Error - wrong Role');
        }),
    };
    if (types[type]) return types[type];
    return catchAsync(
        () => {
            log.error(JSON.stringify(new ApiError(httpStatus.FORBIDDEN, 'Wrong type of authorization')));
            throw new ApiError(httpStatus.FORBIDDEN, 'Authorization Error - wrong type of authorization');
        }
    );
};
