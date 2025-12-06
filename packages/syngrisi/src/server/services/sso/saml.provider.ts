/**
 * SAML Provider
 *
 * Implements SSO authentication via SAML 2.0 protocol.
 */

import { Strategy as SamlStrategy } from '@node-saml/passport-saml';
import type { PassportStatic } from 'passport';
import log from '@logger';
import { env } from '../../envConfig';
import { ssoUserService } from './sso-user.service';
import type { SSOProvider, NormalizedProfile } from './types';
import { LogOpts } from '@types';

const logMeta: LogOpts = { scope: 'saml-provider', msgType: 'SSO' };

/** SAML strategy name */
export const SAML_STRATEGY_NAME = 'saml';

/**
 * Normalize SAML assertion profile to common format
 */
function normalizeSAMLProfile(profile: any): NormalizedProfile {
    // SAML profiles can have various attribute names
    const email = profile.nameID
        || profile.email
        || profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']
        || profile['urn:oid:0.9.2342.19200300.100.1.3'];

    const firstName = profile.firstName
        || profile.givenName
        || profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname']
        || profile['urn:oid:2.5.4.42'];

    const lastName = profile.lastName
        || profile.surname
        || profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname']
        || profile['urn:oid:2.5.4.4'];

    const id = profile.nameID
        || profile.uid
        || profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];

    return {
        id,
        email,
        emails: email ? [{ value: email }] : [],
        name: {
            givenName: firstName || 'SSO',
            familyName: lastName || 'User',
        },
        displayName: profile.displayName || `${firstName || 'SSO'} ${lastName || 'User'}`,
        provider: 'saml',
        _json: profile,
    };
}

class SAMLProvider implements SSOProvider {
    readonly name = 'SAML';
    readonly protocol = 'saml' as const;

    /**
     * Check if provider is properly configured
     */
    isConfigured(): boolean {
        const hasEntryPoint = !!env.SSO_ENTRY_POINT;
        const hasIssuer = !!env.SSO_ISSUER;
        const hasCert = !!env.SSO_CERT;

        return hasEntryPoint && hasIssuer && hasCert;
    }

    /**
     * Get strategy name for passport
     */
    getStrategyName(): string {
        return SAML_STRATEGY_NAME;
    }

    /**
     * Initialize passport strategy
     */
    async initialize(passport: PassportStatic): Promise<void> {
        if (!this.isConfigured()) {
            log.warn('SAML provider not configured - missing required settings', {
                ...logMeta,
                hasEntryPoint: !!env.SSO_ENTRY_POINT,
                hasIssuer: !!env.SSO_ISSUER,
                hasCert: !!env.SSO_CERT,
            });
            return;
        }

        const entryPoint = env.SSO_ENTRY_POINT;
        const issuer = env.SSO_ISSUER;
        const cert = env.SSO_CERT;
        const idpIssuer = env.SSO_IDP_ISSUER;

        log.info('Initializing SAML strategy', {
            ...logMeta,
            entryPoint,
            issuer,
            hasIdpIssuer: !!idpIssuer,
        });

        // Build callback URL from SSO_CALLBACK_URL or default
        const callbackPath = '/v1/auth/sso/saml/callback';
        // For @node-saml/passport-saml v5+, callbackUrl must be a full URL
        // We'll use the issuer as base URL since it typically contains the service provider URL
        const callbackUrl = issuer.endsWith('/')
            ? `${issuer.slice(0, -1)}${callbackPath}`
            : `${issuer}${callbackPath}`;

        const samlConfig: any = {
            entryPoint,
            issuer,
            cert,
            callbackUrl,
            passReqToCallback: true,
            // Security: require signed assertions (recommended for production)
            wantAssertionsSigned: true,
            wantAuthnResponseSigned: false, // Some IdPs don't sign the response envelope
        };

        // Add IdP issuer if configured (for issuer validation)
        if (idpIssuer) {
            samlConfig.idpIssuer = idpIssuer;
        }

        log.debug('SAML config', { ...logMeta, callbackUrl, hasIdpIssuer: !!idpIssuer });

        passport.use(SAML_STRATEGY_NAME, new SamlStrategy(
            samlConfig,
            async (req: any, profile: any, done: any) => {
                try {
                    log.debug('SAML assertion received', {
                        ...logMeta,
                        nameID: profile?.nameID,
                        issuer: profile?.issuer,
                    });

                    const normalizedProfile = normalizeSAMLProfile(profile);

                    // Process user through user service
                    await ssoUserService.processUserCallback(normalizedProfile, 'saml', done);
                } catch (error) {
                    log.error('Error in SAML callback', { ...logMeta, error });
                    done(error);
                }
            },
        ));

        log.info('SAML strategy initialized', logMeta);
    }

    /**
     * Generate SAML metadata for this service provider
     *
     * This can be used to configure the IdP
     */
    generateMetadata(passport: PassportStatic): string | null {
        try {
            // Access internal passport strategy registry
            const passportAny = passport as any;
            const strategy = passportAny._strategy?.(SAML_STRATEGY_NAME) || passportAny._strategies?.[SAML_STRATEGY_NAME];
            if (strategy && typeof strategy.generateServiceProviderMetadata === 'function') {
                return strategy.generateServiceProviderMetadata();
            }
        } catch (error) {
            log.warn('Could not generate SAML metadata', { ...logMeta, error });
        }
        return null;
    }
}

export const samlProvider = new SAMLProvider();
export { SAMLProvider };
