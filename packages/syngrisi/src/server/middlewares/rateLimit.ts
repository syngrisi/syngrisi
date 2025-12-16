import rateLimit from 'express-rate-limit';
import { config } from '@config';

export const apiLimiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    standardHeaders: config.rateLimit.standardHeaders,
    legacyHeaders: config.rateLimit.legacyHeaders,
    message: 'Too many requests from this IP, please try again after 15 minutes',
});

export const authLimiter = rateLimit({
    windowMs: config.authRateLimit.windowMs,
    max: config.authRateLimit.max,
    standardHeaders: config.authRateLimit.standardHeaders,
    legacyHeaders: config.authRateLimit.legacyHeaders,
    message: 'Too many login attempts from this IP, please try again after 15 minutes',
});
