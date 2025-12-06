/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpStatus } from '@utils';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Response, NextFunction } from 'express';
import { ApiError } from '@utils';
import { catchAsync } from '@utils';
import log from '@lib/logger';
import { ExtRequest } from '@types';
import { appSettings } from "@settings";
// import { createLog } from '@controllers/logs.controller';
// import AppSettings from '@models/AppSettings';


export const authorization = (type: string) => {

    const types: { [key: string]: (req: any, res: any, next: NextFunction) => any } = {
        admin: catchAsync(async (req: ExtRequest, res: Response, next: NextFunction) => {
            const AppSettings = appSettings;
            const authEnabled = await AppSettings.isAuthEnabled();
            log.info(`authorization check`, {
                type,
                user: req.user?.username,
                role: req.user?.role,
                authEnabled,
            });

            if (!authEnabled) {
                return next();
            }
            if (req.user?.role === 'admin') {
                log.silly(`user: '${req.user?.username}' was successfully authorized, type: '${type}'`);
                return next();
            }
            log.warn(`user authorization: '${req.user?.username}' wrong role, type: '${type}'`);
            throw new ApiError(HttpStatus.FORBIDDEN, 'Authorization Error - wrong Role');
        }),
        user: catchAsync(async (req: ExtRequest, res: Response, next: NextFunction) => {
            const AppSettings = appSettings;

            // @ts-ignore
            const authEnabled = await AppSettings.isAuthEnabled();
            log.info(`authorization check`, {
                type,
                user: req.user?.username,
                role: req.user?.role,
                authEnabled,
            });

            if (!authEnabled) {
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
            throw new ApiError(HttpStatus.FORBIDDEN, 'Authorization Error - wrong Role');
        }),
    };
    if (types[type]) return types[type];
    return catchAsync(
        () => {
            log.error(JSON.stringify(new ApiError(HttpStatus.FORBIDDEN, 'Wrong type of authorization')));
            throw new ApiError(HttpStatus.FORBIDDEN, 'Authorization Error - wrong type of authorization');
        }
    );
};
