import winston from 'winston';
import { Request, Response, NextFunction } from 'express';
import { config } from '@config';

const httpTransport = new winston.transports.File({
    filename: config.httpLoggerFilePath,
    level: 'info',
});

const httpLogger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
    ),
    transports: [httpTransport],
});

/**
 * Express middleware for HTTP request logging using Winston.
 * Replacement for pino-http logger.
 */
export default function httpLoggerMiddleware(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();

    res.on('finish', () => {
        httpLogger.info({
            method: req.method,
            url: req.url,
            status: res.statusCode,
            responseTime: Date.now() - start,
            contentLength: res.get('content-length'),
            userAgent: req.get('user-agent'),
        });
    });

    next();
}
