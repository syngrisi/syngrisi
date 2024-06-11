/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response, NextFunction } from 'express';
import { ExtRequest } from '@types';

const catchAsync = (fn: (req: ExtRequest, res: Response, next: NextFunction) => Promise<any>) =>
    (req: ExtRequest, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch((err) => {
            return next(err);
        });
    };

export default catchAsync;
