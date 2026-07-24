import { Response } from 'express';
import { catchAsync, ApiError, HttpStatus } from '@utils';
import { ExtRequest } from '@types';
import { appSettings } from '@settings';
import { AppSettings as AppSettingsModel } from '@models';
import {
    CORS_EMBED_SETTING_NAME,
    DEFAULT_CORS_EMBED_SETTINGS,
    getCorsEmbedSettings,
    normalizeCorsEmbedSettings,
    isAllowedCorsOrigin,
} from '../lib/corsEmbed';
import {
    issueCorsEmbedCsrfToken,
    prepareCorsEmbedSessionCookie,
} from '../middlewares/corsEmbed';

/**
 * Ensures the cors_embed AppSettings document exists (for upgrades before seed upsert runs).
 */
async function ensureCorsEmbedSettingDoc(): Promise<void> {
    const existing = await AppSettingsModel.findOne({ name: CORS_EMBED_SETTING_NAME }).lean().exec();
    if (existing) return;
    await AppSettingsModel.create({
        name: CORS_EMBED_SETTING_NAME,
        label: 'CORS & Embed',
        description:
            'Credentialed cross-origin API access (e.g. Accept baselines from Jenkins Allure while logged into Syngrisi). Managed via Admin → CORS & Embed.',
        type: 'CorsEmbed',
        value: { ...DEFAULT_CORS_EMBED_SETTINGS },
        enabled: true,
    });
    await appSettings.init();
}

/**
 * GET /v1/cors-embed — admin: current settings.
 */
export const getSettings = catchAsync(async (_req: ExtRequest, res: Response) => {
    await ensureCorsEmbedSettingDoc();
    const value = await getCorsEmbedSettings();
    res.send({ name: CORS_EMBED_SETTING_NAME, value });
});

/**
 * PUT /v1/cors-embed — admin: replace settings.
 */
export const updateSettings = catchAsync(async (req: ExtRequest, res: Response) => {
    const normalized = normalizeCorsEmbedSettings(req.body?.value ?? req.body);
    if (normalized.enabled && normalized.allowedOrigins.length === 0) {
        throw new ApiError(
            HttpStatus.BAD_REQUEST,
            'allowedOrigins must contain at least one origin when CORS & Embed is enabled',
        );
    }
    if (normalized.sameSite === 'none' && !normalized.csrfRequired) {
        throw new ApiError(
            HttpStatus.BAD_REQUEST,
            'csrfRequired must be true when sameSite is "none"',
        );
    }
    await ensureCorsEmbedSettingDoc();
    await appSettings.set(CORS_EMBED_SETTING_NAME, normalized);
    res.send({ name: CORS_EMBED_SETTING_NAME, value: normalized });
});

/**
 * GET /v1/cors-embed/csrf — logged-in user: CSRF token for cross-origin Accept.
 */
export const getCsrf = catchAsync(async (req: ExtRequest, res: Response) => {
    const settings = await getCorsEmbedSettings();
    if (!settings.enabled) {
        throw new ApiError(HttpStatus.FORBIDDEN, 'CORS & Embed is disabled');
    }
    const token = issueCorsEmbedCsrfToken(req);
    res.send({ csrfToken: token });
});

/**
 * POST /v1/cors-embed/prepare-cookie — logged-in user on Syngrisi origin:
 * re-issue session cookie with SameSite=None so subsequent cross-site fetches work.
 */
export const prepareCookie = catchAsync(async (req: ExtRequest, res: Response) => {
    const settings = await getCorsEmbedSettings();
    if (!settings.enabled) {
        throw new ApiError(HttpStatus.FORBIDDEN, 'CORS & Embed is disabled');
    }
    prepareCorsEmbedSessionCookie(req, settings);
    // Touch session so express-session rewrites Set-Cookie.
    if (req.session) {
        (req.session as { touch?: () => void }).touch?.();
        req.session.cookie.maxAge = req.session.cookie.maxAge;
    }
    const csrfToken = issueCorsEmbedCsrfToken(req);
    res.send({
        ok: true,
        sameSite: settings.sameSite,
        csrfToken,
        message: settings.sameSite === 'none'
            ? 'Session cookie upgraded for cross-site credentialed requests'
            : 'Session cookie kept as SameSite=Lax (cross-site fetch will not send cookies)',
    });
});

/**
 * GET /v1/cors-embed/status — logged-in: whether current Origin is allowlisted (for clients).
 */
export const getStatus = catchAsync(async (req: ExtRequest, res: Response) => {
    const settings = await getCorsEmbedSettings();
    const origin = req.headers.origin as string | undefined;
    res.send({
        enabled: settings.enabled,
        originAllowed: isAllowedCorsOrigin(origin, settings),
        csrfRequired: settings.csrfRequired,
        sameSite: settings.sameSite,
        allowedAcceptRoles: settings.allowedAcceptRoles,
        allowedAcceptStatuses: settings.allowedAcceptStatuses,
    });
});
