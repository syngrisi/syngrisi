/**
 * OAuth2 Provider
 *
 * Implements SSO authentication via OAuth2/OIDC protocol.
 * Supports generic OAuth2 providers (Logto, Keycloak, etc.) and Google.
 */

import { Strategy as OAuth2Strategy } from 'passport-oauth2';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import type { PassportStatic } from 'passport';
import log from '@logger';
import { env } from '../../envConfig';
import { ssoUserService } from './sso-user.service';
import { ssoTokenStore } from './token-store';
import type { SSOProvider, NormalizedProfile, SSOTokens } from './types';
import { LogOpts } from '@types';

const logMeta: LogOpts = { scope: 'oauth2-provider', msgType: 'SSO' };

/** OAuth2 strategy name */
export const OAUTH2_STRATEGY_NAME = 'oauth2';

/** Google strategy name (legacy) */
export const GOOGLE_STRATEGY_NAME = 'google';

/**
 * Fetch user profile from OAuth2 userinfo endpoint
 */
async function fetchUserProfile(userinfoUrl: string, accessToken: string): Promise<any> {
    const response = await fetch(userinfoUrl, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch user profile: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

/**
 * Normalize user profile from OAuth2 userinfo response
 */
function normalizeOAuth2Profile(userInfo: any): NormalizedProfile {
    return {
        id: userInfo.sub || userInfo.id,
        emails: userInfo.email ? [{ value: userInfo.email }] : [],
        email: userInfo.email,
        name: {
            givenName: userInfo.given_name || userInfo.name?.split(' ')[0] || 'SSO',
            familyName: userInfo.family_name || userInfo.name?.split(' ').slice(1).join(' ') || 'User',
        },
        displayName: userInfo.name || `${userInfo.given_name || ''} ${userInfo.family_name || ''}`.trim() || 'SSO User',
        provider: 'oauth',
    };
}

class OAuth2Provider implements SSOProvider {
    readonly name = 'OAuth2';
    readonly protocol = 'oauth2' as const;

    private useGoogle: boolean = false;

    /**
     * Check if custom OAuth2 endpoints are configured
     */
    private hasCustomEndpoints(): boolean {
        return !!(env.SSO_AUTHORIZATION_URL && env.SSO_TOKEN_URL);
    }

    /**
     * Check if provider is properly configured
     */
    isConfigured(): boolean {
        const hasClientId = !!env.SSO_CLIENT_ID;
        const hasClientSecret = !!env.SSO_CLIENT_SECRET;

        if (!hasClientId || !hasClientSecret) {
            return false;
        }

        // Either custom endpoints OR Google OAuth is configured
        return this.hasCustomEndpoints() || hasClientId;
    }

    /**
     * Get strategy name for passport
     */
    getStrategyName(): string {
        return this.useGoogle ? GOOGLE_STRATEGY_NAME : OAUTH2_STRATEGY_NAME;
    }

    /**
     * Initialize passport strategy
     */
    async initialize(passport: PassportStatic): Promise<void> {
        if (!this.isConfigured()) {
            log.warn('OAuth2 provider not configured - missing credentials', logMeta);
            return;
        }

        const clientID = env.SSO_CLIENT_ID;
        const clientSecret = env.SSO_CLIENT_SECRET;
        const callbackURL = env.SSO_CALLBACK_URL || '/v1/auth/sso/oauth/callback';

        // Use custom OAuth2 if endpoints are provided, otherwise Google
        if (this.hasCustomEndpoints()) {
            this.useGoogle = false;
            await this.initializeCustomOAuth2(passport, clientID, clientSecret, callbackURL);
        } else {
            this.useGoogle = true;
            await this.initializeGoogleOAuth2(passport, clientID, clientSecret, callbackURL);
        }
    }

    /**
     * Initialize custom OAuth2 strategy (Logto, Keycloak, etc.)
     */
    private async initializeCustomOAuth2(
        passport: PassportStatic,
        clientID: string,
        clientSecret: string,
        callbackURL: string,
    ): Promise<void> {
        const authorizationURL = env.SSO_AUTHORIZATION_URL;
        const tokenURL = env.SSO_TOKEN_URL;
        const userinfoURL = env.SSO_USERINFO_URL;

        log.info('Initializing custom OAuth2 strategy', {
            ...logMeta,
            authorizationURL,
            tokenURL,
            hasUserinfoURL: !!userinfoURL,
        });

        passport.use(OAUTH2_STRATEGY_NAME, new OAuth2Strategy({
            authorizationURL,
            tokenURL,
            clientID,
            clientSecret,
            callbackURL,
            passReqToCallback: true,
            scope: ['openid', 'profile', 'email'],
        }, async (req: any, accessToken: string, refreshToken: string, params: any, profile: any, done: any) => {
            try {
                // Store tokens for later use (logout, refresh)
                if (req.sessionID) {
                    const tokens: SSOTokens = {
                        accessToken,
                        refreshToken,
                        expiresIn: params.expires_in,
                        tokenType: params.token_type,
                        idToken: params.id_token,
                    };
                    // We'll link to user after processing
                    // Store temporarily with session ID
                    ssoTokenStore.store(req.sessionID, 'pending', tokens);
                }

                // Fetch user profile from userinfo endpoint
                let normalizedProfile: NormalizedProfile;

                if (userinfoURL) {
                    const userInfo = await fetchUserProfile(userinfoURL, accessToken);
                    log.debug('Fetched user info from OAuth2 provider', { ...logMeta, userInfo });
                    normalizedProfile = normalizeOAuth2Profile(userInfo);
                } else if (profile && Object.keys(profile).length > 0) {
                    // Use profile from token if no userinfo URL
                    normalizedProfile = ssoUserService.normalizeProfile(profile, 'oauth');
                } else {
                    throw new Error('No userinfo URL configured and no profile in token');
                }

                // Process user through user service
                await ssoUserService.processUserCallback(normalizedProfile, 'oauth', (err, user) => {
                    if (err) return done(err);

                    // Update token store with actual user ID
                    if (req.sessionID && user) {
                        const stored = ssoTokenStore.get(req.sessionID);
                        if (stored) {
                            ssoTokenStore.store(req.sessionID, user._id.toString(), stored);
                        }
                    }

                    done(null, user);
                });
            } catch (error) {
                log.error('Error in OAuth2 callback', { ...logMeta, error });
                done(error);
            }
        }));

        log.info('Custom OAuth2 strategy initialized', logMeta);
    }

    /**
     * Initialize Google OAuth2 strategy (legacy)
     */
    private async initializeGoogleOAuth2(
        passport: PassportStatic,
        clientID: string,
        clientSecret: string,
        callbackURL: string,
    ): Promise<void> {
        log.info('Initializing Google OAuth2 strategy', logMeta);

        passport.use(GOOGLE_STRATEGY_NAME, new GoogleStrategy({
            clientID,
            clientSecret,
            callbackURL,
            passReqToCallback: true,
        }, async (req: any, accessToken: string, refreshToken: string, profile: any, done: any) => {
            try {
                // Store tokens
                if (req.sessionID) {
                    const tokens: SSOTokens = {
                        accessToken,
                        refreshToken,
                    };
                    ssoTokenStore.store(req.sessionID, 'pending', tokens);
                }

                // Process user
                await ssoUserService.processUserCallback(profile, 'oauth', (err, user) => {
                    if (err) return done(err);

                    // Update token store with actual user ID
                    if (req.sessionID && user) {
                        const stored = ssoTokenStore.get(req.sessionID);
                        if (stored) {
                            ssoTokenStore.store(req.sessionID, user._id.toString(), stored);
                        }
                    }

                    done(null, user);
                });
            } catch (error) {
                log.error('Error in Google OAuth2 callback', { ...logMeta, error });
                done(error);
            }
        }));

        log.info('Google OAuth2 strategy initialized', logMeta);
    }
}

export const oauth2Provider = new OAuth2Provider();
export { OAuth2Provider };
