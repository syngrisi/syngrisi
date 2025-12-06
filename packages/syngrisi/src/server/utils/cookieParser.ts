/**
 * Cookie parser middleware - native replacement for 'cookie-parser' package
 * Parses Cookie header and populates req.cookies
 */

import type { Request, Response, NextFunction } from 'express';

/**
 * Parse a cookie header string into an object
 * Based on RFC 6265
 */
function parseCookies(cookieHeader: string): Record<string, string> {
    const cookies: Record<string, string> = Object.create(null);

    if (!cookieHeader || cookieHeader.length < 2) {
        return cookies;
    }

    const pairs = cookieHeader.split(';');

    for (const pair of pairs) {
        const eqIdx = pair.indexOf('=');
        if (eqIdx < 0) continue;

        const key = pair.substring(0, eqIdx).trim();
        if (!key) continue;

        let val = pair.substring(eqIdx + 1).trim();

        // Remove surrounding quotes if present
        if (val.charCodeAt(0) === 0x22) { // "
            val = val.slice(1, -1);
        }

        // Only assign if not already set (first value wins per RFC 6265)
        if (cookies[key] === undefined) {
            try {
                cookies[key] = decodeURIComponent(val);
            } catch {
                cookies[key] = val;
            }
        }
    }

    return cookies;
}

/**
 * Cookie parser middleware for Express
 * Parses Cookie header and populates req.cookies
 */
export function cookieParser() {
    return function cookieParserMiddleware(req: Request, _res: Response, next: NextFunction): void {
        if (req.cookies) {
            next();
            return;
        }

        const cookieHeader = req.headers.cookie;
        req.cookies = parseCookies(cookieHeader || '');

        next();
    };
}

export default cookieParser;
