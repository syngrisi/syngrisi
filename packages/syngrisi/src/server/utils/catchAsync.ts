import { Request, Response, NextFunction } from 'express';
import log from "../lib/logger";

const catchAsync = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) => 
    (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch((err) => {
            log.error(err.stack || err.toString());
            return next(err);
        });
    };

export default catchAsync;
