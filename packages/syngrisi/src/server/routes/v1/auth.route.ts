import express from 'express';
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
import { initSSOStrategies } from '../../services/auth-sso.service';

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
router.get('/sso/status', async (req, res) => {
    const ssoEnabledSetting = await AppSettings.findOne({ name: 'sso_enabled' });
    const isEnabled = process.env.SSO_ENABLED === 'true' || (ssoEnabledSetting?.value as unknown as string) === 'true';
    res.json({ ssoEnabled: isEnabled });
});

router.get('/sso', async (req, res, next) => {
    try {
        // Re-initialize SSO strategies to pick up any env var changes (for testing)
        await initSSOStrategies(passport);

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
        if (protocol === 'oauth2') {
            passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
        } else if (protocol === 'saml') {
            passport.authenticate('saml', { failureRedirect: '/auth?error=saml_fail' })(req, res, next);
        } else {
            res.redirect('/auth?error=invalid_protocol');
        }
    } catch (error) {
        next(error);
    }
});

router.get('/sso/oauth/callback', async (req, res, next) => {
    // Handle mocked SSO for testing
    if (process.env.SYNGRISI_TEST_MODE === 'true' && req.query.code === 'mock_auth_code') {
        try {
            const { processSSOUser } = await import('../../services/auth-sso.service');
            const mockProfile = {
                emails: [{ value: 'sso-user@test.com' }],
                id: 'mock-sso-id',
                name: { givenName: 'SSO', familyName: 'User' }
            };

            await new Promise((resolve, reject) => {
                processSSOUser(mockProfile, 'oauth', (error: any, user?: any) => {
                    if (error) return reject(error);
                    // Manually log in the user
                    req.login(user, (err) => {
                        if (err) return reject(err);
                        resolve(user);
                    });
                });
            });

            return res.redirect('/');
        } catch (error) {
            return next(error);
        }
    }

    // Normal OAuth flow
    passport.authenticate('google', { failureRedirect: '/auth?error=oauth_fail' })(req, res, next);
});

router.post('/sso/saml/callback',
    passport.authenticate('saml', { failureRedirect: '/auth?error=saml_fail' }),
    (req, res) => {
        res.redirect('/');
    }
);

export default router;
