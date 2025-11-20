import { Request, Response, NextFunction } from 'express';
import log from '@logger';

const logOpts = { scope: 'ensureSameOrigin', msgType: 'SECURITY' };

const isSameHost = (value: string | undefined, host: string | undefined): boolean => {
    if (!value || !host) return true;
    try {
        const url = new URL(value);
        return url.host === host;
    } catch {
        return false;
    }
};

export const ensureSameOrigin = (req: Request, res: Response, next: NextFunction): void => {
    const host = req.headers.host;
    const originHeader = req.headers.origin as string | undefined;
    const refererHeader = req.headers.referer as string | undefined;

    const isOriginValid = isSameHost(originHeader, host);
    const isRefererValid = isSameHost(refererHeader, host);

    if (isOriginValid && isRefererValid) {
        return next();
    }

    log.warn(`Same-origin check failed for ${req.originalUrl}`, logOpts);
    res.status(403).json({ message: 'forbidden' });
};
