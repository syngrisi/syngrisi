/**
 * Auth SSO Service
 *
 * Main entry point for SSO authentication.
 * Delegates to protocol-specific providers (OAuth2, SAML).
 */

import passport from 'passport';
import log from '@logger';
import { env } from '../envConfig';
import {
    oauth2Provider,
    samlProvider,
    ssoUserService,
    ssoTokenStore,
    accountLinkingService,
    OAUTH2_STRATEGY_NAME,
    GOOGLE_STRATEGY_NAME,
    SAML_STRATEGY_NAME,
    type NormalizedProfile,
    type SSOProtocol,
} from './sso';
import { LogOpts } from '@types';

const logMeta: LogOpts = { scope: 'auth-sso.service', msgType: 'SSO' };

/** Auth strategy names (exported for backwards compatibility) */
export const AUTH_STRATEGY = {
    GOOGLE: GOOGLE_STRATEGY_NAME,
    OAUTH2: OAUTH2_STRATEGY_NAME,
    SAML: SAML_STRATEGY_NAME,
};

/** Re-export NormalizedProfile for backwards compatibility */
export type { NormalizedProfile };

/**
 * Process SSO user (backwards compatibility wrapper)
 *
 * @deprecated Use ssoUserService.processUserCallback directly
 */
export const processSSOUser = async (
    profile: any,
    provider: 'oauth' | 'saml',
    done: (error: any, user?: any) => void,
) => {
    return ssoUserService.processUserCallback(profile, provider, done);
};

/**
 * Get SSO secrets status (for UI to show configuration state)
 */
export const getSSOSecretsStatus = () => {
    return {
        clientSecretConfigured: !!env.SSO_CLIENT_SECRET,
        certConfigured: !!env.SSO_CERT,
    };
};

/**
 * Determine which OAuth2 strategy to use based on configuration
 */
export const getOAuth2StrategyName = (): string => {
    if (env.SSO_AUTHORIZATION_URL && env.SSO_TOKEN_URL) {
        return AUTH_STRATEGY.OAUTH2;
    }
    return AUTH_STRATEGY.GOOGLE;
};

/**
 * Check if SSO is enabled
 */
export const isSSOEnabled = (): boolean => {
    return env.SSO_ENABLED;
};

/**
 * Get current SSO protocol
 */
export const getSSOProtocol = (): SSOProtocol | '' => {
    return env.SSO_PROTOCOL as SSOProtocol | '';
};

/**
 * Get SSO configuration for API responses
 */
export const getSSOConfig = () => {
    return {
        enabled: env.SSO_ENABLED,
        protocol: env.SSO_PROTOCOL,
        autoCreateUsers: env.SSO_AUTO_CREATE_USERS,
        allowAccountLinking: env.SSO_ALLOW_ACCOUNT_LINKING,
        defaultRole: env.SSO_DEFAULT_ROLE,
    };
};

/**
 * Initialize SSO strategies based on configuration
 */
export const initSSOStrategies = async (passportInstance: passport.PassportStatic = passport) => {
    try {
        if (!env.SSO_ENABLED) {
            log.info('SSO is disabled', logMeta);
            return;
        }

        const protocol = env.SSO_PROTOCOL;

        log.info(`Initializing SSO with protocol: ${protocol}`, logMeta);

        if (protocol === 'oauth2') {
            if (!env.SSO_CLIENT_SECRET) {
                log.warn('OAuth2 SSO enabled but SSO_CLIENT_SECRET not set', logMeta);
                return;
            }
            await oauth2Provider.initialize(passportInstance);
        } else if (protocol === 'saml') {
            if (!env.SSO_CERT) {
                log.warn('SAML SSO enabled but SSO_CERT not set', logMeta);
                return;
            }
            await samlProvider.initialize(passportInstance);
        } else {
            log.warn(`Unknown SSO protocol: ${protocol}`, logMeta);
        }
    } catch (error) {
        log.error('Error initializing SSO strategies', { ...logMeta, error });
        throw error;
    }
};

/**
 * Handle SSO logout
 *
 * Clears tokens and optionally initiates IdP logout
 */
export const handleSSOLogout = async (sessionId: string, userId?: string): Promise<void> => {
    // Remove tokens from store
    if (sessionId) {
        ssoTokenStore.remove(sessionId);
    }

    // Remove all tokens for user (if known)
    if (userId) {
        ssoTokenStore.removeByUserId(userId);
    }

    log.debug('SSO logout processed', {
        ...logMeta,
        sessionId: sessionId?.substring(0, 8) + '...',
        userId,
    });
};

/**
 * Get token store stats (for monitoring)
 */
export const getTokenStoreStats = () => {
    return ssoTokenStore.getStats();
};

// Re-export services for direct access
export {
    ssoUserService,
    ssoTokenStore,
    accountLinkingService,
    oauth2Provider,
    samlProvider,
};
