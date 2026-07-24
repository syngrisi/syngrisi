import { NextFunction, Request, Response } from 'express';
import crypto from 'crypto';
import log from '@logger';
import {
    getCorsEmbedSettings,
    isAllowedCorsOrigin,
    isCrossOriginRequest,
} from '../lib/corsEmbed';
import type { CorsEmbedSettings } from '../lib/corsEmbed';

const logOpts = { scope: 'corsEmbed', msgType: 'SECURITY' };

const MUTATING = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

/** Mutating paths that bootstrap CSRF / cookie and must not require a prior token. */
const CSRF_BOOTSTRAP_PATHS = new Set([
    '/v1/cors-embed/prepare-cookie',
]);

type SessionWithCors = Request['session'] & {
    corsEmbedCsrf?: string;
    cookie?: {
        sameSite?: boolean | 'lax' | 'strict' | 'none';
        secure?: boolean;
    };
};

/**
 * Applies Access-Control-* headers for an allowed Origin.
 */
function applyCorsHeaders(res: Response, origin: string, settings: CorsEmbedSettings): void {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    if (settings.allowCredentials) {
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    );
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, X-CSRF-Token, apikey',
    );
    res.setHeader('Access-Control-Expose-Headers', 'Content-Length, X-Content-Type-Options');
    res.setHeader('Access-Control-Max-Age', '600');
}

/**
 * Merges frame-ancestors into CSP (helmet runs earlier).
 */
function applyFrameAncestors(res: Response, settings: CorsEmbedSettings): void {
    if (!settings.enabled || settings.frameAncestors.length === 0) {
        return;
    }
    const ancestors = ["'self'", ...settings.frameAncestors.filter((a) => a !== "'self'")];
    const value = ancestors.join(' ');
    const existing = res.getHeader('Content-Security-Policy');
    if (typeof existing === 'string' && existing.length > 0) {
        if (/frame-ancestors/i.test(existing)) {
            res.setHeader(
                'Content-Security-Policy',
                existing.replace(/frame-ancestors[^;]*/i, `frame-ancestors ${value}`),
            );
        } else {
            res.setHeader('Content-Security-Policy', `${existing}; frame-ancestors ${value}`);
        }
    } else {
        res.setHeader('Content-Security-Policy', `frame-ancestors ${value}`);
    }
    res.removeHeader('X-Frame-Options');
}

/**
 * Production credentialed CORS + CSRF + session SameSite upgrade for Admin-configured origins.
 * Dev CORS remains handled by disableCors middleware.
 * Must run after express-session (CSRF token lives on the session).
 */
export async function corsEmbedMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const settings = await getCorsEmbedSettings();
        applyFrameAncestors(res, settings);

        if (!settings.enabled) {
            return next();
        }

        const session = req.session as SessionWithCors | undefined;

        // Same-origin traffic: upgrade session cookie so later cross-site fetches can send it.
        if (settings.sameSite === 'none' && session?.cookie && !isCrossOriginRequest(req)) {
            session.cookie.sameSite = 'none';
            session.cookie.secure = true;
        }

        const origin = req.headers.origin as string | undefined;
        const allowed = isAllowedCorsOrigin(origin, settings);

        if (origin && allowed) {
            applyCorsHeaders(res, origin, settings);

            if (req.method === 'OPTIONS') {
                res.status(204).end();
                return;
            }

            if (session?.cookie && settings.sameSite === 'none') {
                session.cookie.sameSite = 'none';
                session.cookie.secure = true;
            }
        }

        // CSRF for cross-origin mutating API calls from allowlisted origins.
        if (
            settings.csrfRequired
            && allowed
            && isCrossOriginRequest(req)
            && MUTATING.has(req.method)
            && req.path.startsWith('/v1/')
            && !CSRF_BOOTSTRAP_PATHS.has(req.path)
        ) {
            const expected = session?.corsEmbedCsrf;
            const provided = String(req.headers['x-csrf-token'] || '').trim();
            if (!expected || !provided || expected !== provided) {
                log.warn(`CSRF rejected ${req.method} ${req.originalUrl} from ${origin}`, logOpts);
                res.status(403).json({ error: 'Invalid or missing CSRF token (X-CSRF-Token)' });
                return;
            }
        }

        return next();
    } catch (error) {
        log.error(`corsEmbedMiddleware error: ${error}`, logOpts);
        return next();
    }
}

/**
 * Issues a CSRF token into the session for cross-origin Accept flows.
 */
export function issueCorsEmbedCsrfToken(req: Request): string {
    const session = req.session as SessionWithCors;
    const token = crypto.randomBytes(32).toString('hex');
    session.corsEmbedCsrf = token;
    return token;
}

/**
 * Upgrades the current session cookie to SameSite=None;Secure for allowlisted cross-site use.
 */
export function prepareCorsEmbedSessionCookie(req: Request, settings: CorsEmbedSettings): void {
    const session = req.session as SessionWithCors;
    if (!session?.cookie) return;
    if (settings.sameSite === 'none') {
        session.cookie.sameSite = 'none';
        session.cookie.secure = true;
    } else {
        session.cookie.sameSite = 'lax';
    }
}
