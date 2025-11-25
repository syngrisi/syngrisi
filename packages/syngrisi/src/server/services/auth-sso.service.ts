import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as SamlStrategy } from 'passport-saml';
import { AppSettings, User } from '../models';
import { UserDocument } from '../models/User.model';
import log from '@logger';
import { v4 as uuidv4 } from 'uuid';
import { LogOpts } from '@types';

const logMeta: LogOpts = { scope: 'auth-sso.service', msgType: 'SSO' };

export const processSSOUser = async (profile: any, provider: 'oauth' | 'saml', done: (error: any, user?: any) => void) => {
    try {
        const email = profile.emails?.[0]?.value || profile.email || profile.nameID;
        const providerId = profile.id || profile.nameID || profile.uid;
        const firstName = profile.name?.givenName || profile.firstName || 'SSO';
        const lastName = profile.name?.familyName || profile.lastName || 'User';

        if (!email) {
            return done(new Error('No email found in SSO profile'));
        }

        // 1. Find by providerId
        let user = await User.findOne({ providerId, provider });

        if (user) {
            log.info(`SSO login successful for ${email} via ${provider}`, logMeta);
            return done(null, user);
        }

        // 2. Find by email
        user = await User.findOne({ username: email });

        if (user) {
            // Link account if local
            if (user.provider === 'local') {
                user.provider = provider;
                user.providerId = providerId;
                await user.save();
                log.info(`SSO login successful for ${email} via ${provider} (account linked)`, logMeta);
                return done(null, user);
            }
            // If provider is different but email same? (e.g. switched from saml to oauth)
            // For now, let's assume we update it or just log it in.
            // The plan says "If found by email and provider='local': Link account".
            // It doesn't specify what to do if provider is already 'saml' but we are logging in via 'oauth' (unlikely if we only enable one).
            // But let's update providerId just in case.
            user.provider = provider;
            user.providerId = providerId;
            await user.save();
            log.info(`SSO login successful for ${email} via ${provider}`, logMeta);
            return done(null, user);
        }

        // 3. Create new user
        const defaultRole = process.env.SSO_DEFAULT_ROLE || 'user';
        const newUser = new User({
            username: email,
            firstName,
            lastName,
            role: defaultRole,
            provider,
            providerId,
            password: uuidv4(), // Random password
            apiKey: uuidv4(),
        });

        await newUser.save();
        log.info(`SSO login successful for ${email} via ${provider} (new user created with role: ${defaultRole})`, logMeta);
        return done(null, newUser);

    } catch (error) {
        log.error('Error processing SSO user', { ...logMeta, error });
        return done(error);
    }
};

// Helper to get SSO setting - env vars take priority, secrets ONLY from env vars
const getSSOSetting = (name: string, settings: any[], secretsOnlyFromEnv = false): string | undefined => {
    const envName = name.toUpperCase();
    const envValue = process.env[envName];

    // For secrets, ONLY use env vars (never from DB for security)
    if (secretsOnlyFromEnv) {
        return envValue;
    }

    // For non-secrets, env vars take priority, then DB
    if (envValue) return envValue;
    return settings.find(s => s.name === name)?.value as string | undefined;
};

// Check if SSO secrets are configured via environment variables
export const getSSOSecretsStatus = () => {
    return {
        clientSecretConfigured: !!process.env.SSO_CLIENT_SECRET,
        certConfigured: !!process.env.SSO_CERT,
    };
};

export const initSSOStrategies = async (passportInstance: passport.PassportStatic) => {
    try {
        // Only fetch non-secret settings from DB
        const settings = await AppSettings.find({
            name: { $in: ['sso_enabled', 'sso_protocol', 'sso_entry_point', 'sso_issuer', 'sso_client_id'] }
        });

        const ssoEnabled = getSSOSetting('sso_enabled', settings) === 'true';
        if (!ssoEnabled) {
            log.info('SSO is disabled', logMeta);
            return;
        }

        const protocol = getSSOSetting('sso_protocol', settings);

        if (protocol === 'oauth2') {
            const clientID = getSSOSetting('sso_client_id', settings);
            // Client secret ONLY from env var (security: never from DB)
            const clientSecret = getSSOSetting('sso_client_secret', settings, true);

            if (!clientSecret) {
                log.warn('OAuth2 SSO enabled but SSO_CLIENT_SECRET env var not set', logMeta);
                return;
            }

            if (clientID && clientSecret) {
                passportInstance.use(new GoogleStrategy({
                    clientID,
                    clientSecret,
                    callbackURL: '/v1/auth/sso/oauth/callback',
                    passReqToCallback: true
                }, (req: any, accessToken: string, refreshToken: string, profile: any, done: any) => {
                    if (process.env.SYNGRISI_TEST_MODE === 'true' && req.query.code === 'mock_auth_code') {
                        return processSSOUser({
                            emails: [{ value: 'sso-user@test.com' }],
                            id: 'mock-sso-id',
                            name: { givenName: 'SSO', familyName: 'User' }
                        }, 'oauth', done);
                    }
                    processSSOUser(profile, 'oauth', done);
                }));
                log.info('Google OAuth2 strategy initialized', logMeta);
            }
        } else if (protocol === 'saml') {
            const entryPoint = getSSOSetting('sso_entry_point', settings);
            const issuer = getSSOSetting('sso_issuer', settings);
            // Certificate ONLY from env var (security: never from DB)
            const cert = getSSOSetting('sso_cert', settings, true);

            if (!cert) {
                log.warn('SAML SSO enabled but SSO_CERT env var not set', logMeta);
                return;
            }

            if (entryPoint && issuer && cert) {
                passportInstance.use(new SamlStrategy({
                    entryPoint,
                    issuer,
                    cert,
                    path: '/v1/auth/sso/saml/callback',
                    passReqToCallback: true
                }, (req: any, profile: any, done: any) => {
                    processSSOUser(profile, 'saml', done);
                }));
                log.info('SAML strategy initialized', logMeta);
            }
        }
    } catch (error) {
        log.error('Error initializing SSO strategies', { ...logMeta, error });
    }
};
