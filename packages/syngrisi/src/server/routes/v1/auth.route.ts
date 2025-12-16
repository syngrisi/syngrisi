import express from 'express';
import crypto from 'crypto';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import * as authController from '@controllers/auth.controller';
import { Midleware } from '@types';
import { validateRequest } from '@utils/validateRequest';
import { AuthLoginSchema, AuthChangePasswordSchema, AuthApiKeyRespSchema, AuthLoginSuccessRespSchema, AuthChangePasswordFirstRunSchema } from '@schemas/Auth.schema';
import { createApiResponse, createApiEmptyResponse } from '@api-docs/openAPIResponseBuilders';
import { SkipValid } from '../../schemas/SkipValid.schema';
import { createRequestBodySchema } from '../../schemas/utils/createRequestBodySchema';
import { createRequestOpenApiBodySchema } from '../../schemas/utils/createRequestOpenApiBodySchema';
import { ensureSameOrigin, authLimiter } from '@middlewares';
import passport from 'passport';
import { AppSettings } from '../../models';
import { initSSOStrategies, getSSOSecretsStatus, getOAuth2StrategyName, AUTH_STRATEGY } from '../../services/auth-sso.service';
import { samlProvider } from '../../services/sso';
import { env } from '../../envConfig';
import log from '@logger';

const logMeta = { scope: 'auth.route', msgType: 'SSO' };

export const registry = new OpenAPIRegistry();
const router = express.Router();

registry.registerPath({
    method: 'get',
    path: '/v1/auth/logout',
    summary: 'Logout the current user.',
    tags: ['Auth'],
    responses: createApiEmptyResponse('Logout success'),
});

router.get(
    '/logout',
    ensureSameOrigin,
    validateRequest(SkipValid, 'get, /v1/auth/logout'),
    authController.logout as Midleware
);

registry.registerPath({
    method: 'get',
    path: '/v1/auth/apikey',
    summary: 'Generate a new API key for the current user.',
    tags: ['Auth'],
    responses: createApiResponse(AuthApiKeyRespSchema, 'API Key generated'),
});

router.get(
    '/apikey',
    ensureSameOrigin,
    validateRequest(SkipValid, 'get, /v1/auth/apikey'),
    authController.apikey as Midleware
);

registry.registerPath({
    method: 'post',
    path: '/v1/auth/login',
    summary: 'Login a user with username and password.',
    tags: ['Auth'],
    request: { body: createRequestOpenApiBodySchema(AuthLoginSchema) },
    responses: createApiResponse(AuthLoginSuccessRespSchema, 'Login success'),
});

router.post(
    '/login',
    ensureSameOrigin,
    authLimiter,
    validateRequest(createRequestBodySchema(AuthLoginSchema), 'post, /v1/auth/login'),
    authController.login as Midleware
);

registry.registerPath({
    method: 'post',
    path: '/v1/auth/change',
    summary: 'Change the password for the current user.',
    tags: ['Auth'],
    request: { body: createRequestOpenApiBodySchema(AuthChangePasswordSchema) },
    responses: createApiEmptyResponse('Password changed'),
});

router.post(
    '/change',
    ensureSameOrigin,
    validateRequest(createRequestBodySchema(AuthChangePasswordSchema), 'post, /v1/auth/change'),
    authController.changePassword as Midleware
);

registry.registerPath({
    method: 'post',
    path: '/v1/auth/change_first_run',
    summary: 'Change the password for the first run.',
    tags: ['Auth'],
    request: { body: createRequestOpenApiBodySchema(AuthChangePasswordFirstRunSchema) },
    responses: createApiEmptyResponse('First run password changed'),
});

router.post(
    '/change_first_run',
    ensureSameOrigin,
    validateRequest(createRequestBodySchema(AuthChangePasswordFirstRunSchema), 'post, /v1/auth/change_first_run'),
    authController.changePasswordFirstRun as Midleware
);

// SSO Routes

// Get SSO status (public endpoint)
router.get('/sso/status', async (req, res) => {
    const ssoEnabledSetting = await AppSettings.findOne({ name: 'sso_enabled' });
    const isEnabled = process.env.SSO_ENABLED === 'true' || (ssoEnabledSetting?.value as unknown as string) === 'true';
    res.json({ ssoEnabled: isEnabled });
});

// Get SSO secrets configuration status (for admin UI)
router.get('/sso/secrets-status', async (req, res) => {
    const status = getSSOSecretsStatus();
    res.json(status);
});

/**
 * SP Metadata endpoint
 * Returns SAML Service Provider metadata in XML format
 * Used by IdP administrators to configure trust relationship
 */
router.get('/sso/metadata', async (req, res) => {
    try {
        // Check if SAML is configured
        if (env.SSO_PROTOCOL !== 'saml') {
            return res.status(400).json({
                error: 'SAML not configured',
                message: 'SP metadata is only available when SSO_PROTOCOL=saml',
            });
        }

        // Check if SAML provider is properly configured
        if (!samlProvider.isConfigured()) {
            return res.status(400).json({
                error: 'SAML not initialized',
                message: 'SAML provider is not properly configured',
            });
        }

        const metadata = samlProvider.generateMetadata(passport);

        if (!metadata) {
            return res.status(500).json({
                error: 'Metadata generation failed',
                message: 'Could not generate SP metadata',
            });
        }

        res.set('Content-Type', 'application/xml');
        res.set('Content-Disposition', 'inline; filename="sp-metadata.xml"');
        res.send(metadata);
    } catch (error) {
        log.error('Error generating SP metadata', { ...logMeta, error });
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Re-initialize SSO strategies (only in test mode)
if (process.env.NODE_ENV === 'test' || process.env.SYNGRISI_TEST_MODE === 'true') {
    router.post('/sso/reinit', async (req, res) => {
        await initSSOStrategies(passport);
        res.json({ success: true });
    });
}



// Main SSO entry point with CSRF protection via state parameter
router.get('/sso', authLimiter, async (req, res, next) => {
    try {
        const settings = await AppSettings.find({
            name: { $in: ['sso_enabled', 'sso_protocol'] }
        });
        const getSetting = (name: string) => {
            const envName = name.toUpperCase();
            if (process.env[envName]) return process.env[envName];
            return settings.find(s => s.name === name)?.value as string | undefined;
        };

        if (getSetting('sso_enabled') !== 'true') {
            return res.redirect('/auth?error=sso_disabled');
        }

        const protocol = getSetting('sso_protocol');

        // Generate CSRF state token for OAuth2
        if (protocol === AUTH_STRATEGY.OAUTH2) {
            const state = crypto.randomBytes(16).toString('hex');
            // Store state in session for validation in callback
            (req.session as any).oauthState = state;

            const strategyName = getOAuth2StrategyName();
            log.debug(`Using OAuth2 strategy: ${strategyName}`, logMeta);

            passport.authenticate(strategyName, {
                scope: ['openid', 'profile', 'email'],
                state: state
            })(req, res, next);
        } else if (protocol === AUTH_STRATEGY.SAML) {
            // SAML uses RelayState and InResponseTo for CSRF protection
            passport.authenticate(AUTH_STRATEGY.SAML, { failureRedirect: '/auth?error=saml_fail' })(req, res, next);
        } else {
            res.redirect('/auth?error=invalid_protocol');
        }
    } catch (error) {
        log.error('SSO initiation error', { ...logMeta, error });
        next(error);
    }
});

// OAuth callback with state validation
router.get('/sso/oauth/callback', authLimiter, async (req, res, next) => {
    // Validate CSRF state parameter
    const stateFromQuery = req.query.state as string | undefined;
    const stateFromSession = (req.session as any).oauthState;

    if (!stateFromQuery || stateFromQuery !== stateFromSession) {
        log.warn('OAuth callback state mismatch - possible CSRF attack', logMeta);
        return res.redirect('/auth?error=invalid_state');
    }

    // Clear the state from session after validation
    delete (req.session as any).oauthState;

    // Use the same strategy that was used for initiation
    const strategyName = getOAuth2StrategyName();
    log.debug(`OAuth callback using strategy: ${strategyName}`, logMeta);

    passport.authenticate(strategyName, {
        failureRedirect: '/auth?error=oauth_fail',
        successRedirect: '/',
    })(req, res, next);
});

// SAML callback
router.post('/sso/saml/callback',
    authLimiter,
    passport.authenticate(AUTH_STRATEGY.SAML, { failureRedirect: '/auth?error=saml_fail' }),
    (req, res) => {
        res.redirect('/');
    }
);

export default router;
