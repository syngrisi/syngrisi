/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import { config } from '@config';

// disable CORS for development purposes
export const disableCors = (req: Request, res: Response, next: NextFunction): void => {
    if (!config.disableCors) return next();

    const origin = req.headers.origin || '*';

    // Set the actual origin instead of wildcard to allow credentials
    res.setHeader('Access-Control-Allow-Origin', origin);

    // Allow various headers
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control');

    // Allow all methods
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Allow credentials
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Allow specific expose headers if needed
    res.setHeader('Access-Control-Expose-Headers', 'Content-Length, X-Content-Type-Options');

    // Security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.removeHeader('X-Frame-Options');

    // Content Security Policy to allow mixed content and scripts
    res.setHeader('Content-Security-Policy',
        "default-src 'self' * 'unsafe-inline' 'unsafe-eval' data: blob:; " +
        "script-src 'self' * 'unsafe-inline' 'unsafe-eval'; " +
        "style-src 'self' * 'unsafe-inline'; " +
        "img-src 'self' * data: blob:; " +
        "font-src 'self' * data:; " +
        "connect-src 'self' *;"
    );

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Pass to next layer of middleware
    return next();
};
