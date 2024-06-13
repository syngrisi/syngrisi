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
    validateRequest(SkipValid),
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
    validateRequest(SkipValid),
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
    validateRequest(createRequestBodySchema(AuthLoginSchema)),
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
    validateRequest(createRequestBodySchema(AuthChangePasswordSchema)),
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
    validateRequest(createRequestBodySchema(AuthChangePasswordFirstRunSchema)),
    authController.changePasswordFirstRun as Midleware
);

export default router;
