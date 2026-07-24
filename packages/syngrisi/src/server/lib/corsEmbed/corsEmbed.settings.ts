import { appSettings } from '@settings';
import {
    CORS_EMBED_SETTING_NAME,
    CorsEmbedAcceptStatus,
    CorsEmbedRole,
    CorsEmbedSameSite,
    CorsEmbedSettings,
    DEFAULT_CORS_EMBED_SETTINGS,
} from './corsEmbed.types';

const ROLES: CorsEmbedRole[] = ['admin', 'reviewer', 'user'];
const ACCEPT_STATUSES: CorsEmbedAcceptStatus[] = [
    'new',
    'not_accepted',
    'different_images',
    'wrong_dimensions',
];

function asBoolean(value: unknown, fallback: boolean): boolean {
    if (typeof value === 'boolean') return value;
    if (value === 'true') return true;
    if (value === 'false') return false;
    return fallback;
}

function asStringArray(value: unknown): string[] {
    if (!Array.isArray(value)) return [];
    return value
        .map((item) => String(item ?? '').trim())
        .filter(Boolean);
}

function normalizeOrigin(origin: string): string | null {
    try {
        const url = new URL(origin);
        if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
        // Drop trailing slash / path — Origin header never has a path.
        return url.origin;
    } catch {
        return null;
    }
}

/**
 * Normalizes and validates a partial CorsEmbed settings payload.
 */
export function normalizeCorsEmbedSettings(raw: unknown): CorsEmbedSettings {
    const input = (raw && typeof raw === 'object' && !Array.isArray(raw))
        ? raw as Record<string, unknown>
        : {};

    const sameSiteRaw = String(input.sameSite ?? DEFAULT_CORS_EMBED_SETTINGS.sameSite).toLowerCase();
    const sameSite: CorsEmbedSameSite = sameSiteRaw === 'none' ? 'none' : 'lax';

    const allowedOrigins = asStringArray(input.allowedOrigins)
        .map(normalizeOrigin)
        .filter((origin): origin is string => Boolean(origin));

    const allowedAcceptRoles = asStringArray(input.allowedAcceptRoles)
        .filter((role): role is CorsEmbedRole => ROLES.includes(role as CorsEmbedRole));

    const allowedAcceptStatuses = asStringArray(input.allowedAcceptStatuses)
        .filter((status): status is CorsEmbedAcceptStatus => (
            ACCEPT_STATUSES.includes(status as CorsEmbedAcceptStatus)
        ));

    const frameAncestors = asStringArray(input.frameAncestors)
        .map((item) => {
            if (item === "'self'" || item === 'self') return "'self'";
            return normalizeOrigin(item) ?? '';
        })
        .filter(Boolean);

    return {
        enabled: asBoolean(input.enabled, DEFAULT_CORS_EMBED_SETTINGS.enabled),
        allowedOrigins: [...new Set(allowedOrigins)],
        allowCredentials: asBoolean(input.allowCredentials, DEFAULT_CORS_EMBED_SETTINGS.allowCredentials),
        sameSite,
        csrfRequired: asBoolean(input.csrfRequired, DEFAULT_CORS_EMBED_SETTINGS.csrfRequired),
        allowedAcceptRoles: allowedAcceptRoles.length
            ? [...new Set(allowedAcceptRoles)]
            : [...DEFAULT_CORS_EMBED_SETTINGS.allowedAcceptRoles],
        allowedAcceptStatuses: [...new Set(allowedAcceptStatuses)],
        frameAncestors: [...new Set(frameAncestors)],
    };
}

/**
 * Loads CorsEmbed settings from AppSettings (cached ~30s).
 */
export async function getCorsEmbedSettings(): Promise<CorsEmbedSettings> {
    try {
        const doc = await appSettings.get(CORS_EMBED_SETTING_NAME);
        if (!doc) {
            return { ...DEFAULT_CORS_EMBED_SETTINGS };
        }
        return normalizeCorsEmbedSettings(doc.value);
    } catch {
        return { ...DEFAULT_CORS_EMBED_SETTINGS };
    }
}

/**
 * Returns true when the request Origin is in the allowlist.
 */
export function isAllowedCorsOrigin(origin: string | undefined, settings: CorsEmbedSettings): boolean {
    if (!origin || !settings.enabled) return false;
    const normalized = normalizeOrigin(origin);
    if (!normalized) return false;
    return settings.allowedOrigins.includes(normalized);
}

/**
 * True when the request is cross-origin against the Syngrisi host.
 */
export function isCrossOriginRequest(req: { headers: { origin?: string; host?: string } }): boolean {
    const origin = req.headers.origin;
    const host = req.headers.host;
    if (!origin || !host) return false;
    try {
        return new URL(origin).host !== host;
    } catch {
        return false;
    }
}

/**
 * Whether a check may be accepted via a credentialed cross-origin request
 * under the current CorsEmbed status / failReasons filter.
 */
export function isCheckAllowedForCorsEmbedAccept(
    check: { status?: string | string[]; failReasons?: string[] },
    settings: CorsEmbedSettings,
): boolean {
    if (settings.allowedAcceptStatuses.length === 0) {
        return true;
    }
    const status = Array.isArray(check.status) ? check.status[0] : check.status;
    const failReasons = check.failReasons ?? [];
    return settings.allowedAcceptStatuses.some((allowed) => {
        if (allowed === 'new') return status === 'new';
        return failReasons.includes(allowed);
    });
}
