/**
 * Admin-managed settings for credentialed cross-origin API access
 * (e.g. Accept baselines from Jenkins Allure while the user is logged into Syngrisi).
 */
export type CorsEmbedSameSite = 'lax' | 'none';

export type CorsEmbedRole = 'admin' | 'reviewer' | 'user';

export type CorsEmbedAcceptStatus = 'new' | 'not_accepted' | 'different_images' | 'wrong_dimensions';

export interface CorsEmbedSettings {
    /** Master switch for production credentialed CORS. */
    enabled: boolean;
    /** Exact origins allowed to call the API with cookies (e.g. https://ci.example.com). */
    allowedOrigins: string[];
    /** Echo credentials CORS header for allowed origins. */
    allowCredentials: boolean;
    /** Session cookie SameSite when feature is active for allowed-origin traffic. */
    sameSite: CorsEmbedSameSite;
    /** Require X-CSRF-Token on cross-origin mutating requests. */
    csrfRequired: boolean;
    /** Roles allowed to Accept via cross-origin requests. */
    allowedAcceptRoles: CorsEmbedRole[];
    /** Check statuses that may be accepted via cross-origin Accept. Empty = no extra filter. */
    allowedAcceptStatuses: CorsEmbedAcceptStatus[];
    /**
     * Extra frame-ancestors origins for embedding Syngrisi UI (optional).
     * Always includes 'self'. Empty + feature off keeps helmet default ('self' only).
     */
    frameAncestors: string[];
}

export const DEFAULT_CORS_EMBED_SETTINGS: CorsEmbedSettings = {
    enabled: false,
    allowedOrigins: [],
    allowCredentials: true,
    sameSite: 'lax',
    csrfRequired: true,
    allowedAcceptRoles: ['admin', 'reviewer'],
    allowedAcceptStatuses: ['new', 'not_accepted', 'different_images', 'wrong_dimensions'],
    frameAncestors: [],
};

export const CORS_EMBED_SETTING_NAME = 'cors_embed';
