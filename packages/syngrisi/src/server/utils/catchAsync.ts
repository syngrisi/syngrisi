/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response, NextFunction } from 'express';
import log from "../lib/logger";
import { ExtRequest } from '../../types/ExtRequest';

const catchAsync = (fn: (req: ExtRequest, res: Response, next: NextFunction) => Promise<any>) =>
    (req: any, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch((err) => {
            log.error(err);
            return next(err);
        });
    };

export default catchAsync;
