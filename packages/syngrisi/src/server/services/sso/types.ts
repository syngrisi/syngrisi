/**
 * SSO Types and Interfaces
 *
 * Central type definitions for SSO providers
 */

import type { PassportStatic } from 'passport';

/** SSO protocol types */
export type SSOProtocol = 'oauth2' | 'saml' | 'google';

/** SSO provider types for user records (matches User model) */
export type SSOProviderType = 'local' | 'oauth' | 'saml';

/** Normalized user profile from any SSO provider */
export interface NormalizedProfile {
    /** Provider-specific user ID */
    id: string;
    /** User's email address */
    email?: string;
    /** Alternative email format (OAuth2 standard) */
    emails?: { value: string }[];
    /** User's name parts */
    name?: {
        givenName?: string;
        familyName?: string;
    };
    /** Full display name */
    displayName?: string;
    /** Provider name */
    provider?: string;
    /** Raw JSON response from provider */
    _json?: any;
}

/** OAuth2 tokens from provider */
export interface SSOTokens {
    accessToken: string;
    refreshToken?: string;
    expiresIn?: number;
    tokenType?: string;
    idToken?: string;
}

/** SSO configuration from environment */
export interface SSOConfig {
    enabled: boolean;
    protocol: SSOProtocol | '';
    // OAuth2
    clientId: string;
    clientSecret: string;
    authorizationUrl: string;
    tokenUrl: string;
    userinfoUrl: string;
    callbackUrl: string;
    // SAML
    entryPoint: string;
    issuer: string;
    cert: string;
    idpIssuer: string;
    // User settings
    defaultRole: string;
    autoCreateUsers: boolean;
    allowAccountLinking: boolean;
}

/** Result of SSO user processing */
export interface SSOUserResult {
    user: any; // User document
    isNewUser: boolean;
    wasLinked: boolean;
}

/** SSO Provider interface - each provider implements this */
export interface SSOProvider {
    /** Provider name for identification */
    readonly name: string;

    /** Protocol type */
    readonly protocol: SSOProtocol;

    /** Initialize passport strategy */
    initialize(passport: PassportStatic): Promise<void>;

    /** Check if provider is properly configured */
    isConfigured(): boolean;

    /** Get strategy name for passport */
    getStrategyName(): string;
}

/** SSO Provider factory interface */
export interface SSOProviderFactory {
    /** Create provider based on protocol */
    create(protocol: SSOProtocol): SSOProvider | null;
}

/** SSO Event types */
export type SSOEventType =
    | 'user.sso.login'
    | 'user.sso.created'
    | 'user.sso.linked'
    | 'user.sso.unlinked'
    | 'user.sso.error';

/** SSO Event payload */
export interface SSOEvent {
    type: SSOEventType;
    timestamp: Date;
    userId?: string;
    email?: string;
    provider?: SSOProviderType;
    metadata?: Record<string, any>;
    error?: Error;
}

/** SSO Event handler */
export type SSOEventHandler = (event: SSOEvent) => void | Promise<void>;

/** Account linking request */
export interface AccountLinkRequest {
    userId: string;
    provider: SSOProviderType;
    providerId: string;
    email: string;
}

/** Account linking result */
export interface AccountLinkResult {
    success: boolean;
    message: string;
    user?: any;
}
