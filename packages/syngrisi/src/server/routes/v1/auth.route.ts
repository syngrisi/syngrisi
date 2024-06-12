import express from 'express';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import * as authController from '@controllers/auth.controller';
import { Midleware } from '@types';
import { validateRequest } from '@utils/validateRequest';
import { AuthLoginSchema, AuthChangePasswordSchema, AuthApiKeyRespSchema, AuthLoginSuccessRespSchema, AuthChangePasswordFirstRunSchema } from '@schemas/Auth.schema';
import { createApiResponse, createApiEmptyResponse } from '@api-docs/openAPIResponseBuilders';
import { SkipValid } from '../../schemas/SkipValid.schema';
import { getOAPIBodySchema } from '../../schemas/common/getOAPIBodySchema';
import { getReqBodySchema } from '../../schemas/common/getReqBodySchema';

export const registry = new OpenAPIRegistry();
const router = express.Router();

registry.registerPath({
    method: 'get',
    path: '/v1/auth/logout',
    tags: ['Auth'],
    responses: createApiEmptyResponse('Logout success'),
});

router.get(
    '/logout',
    validateRequest(SkipValid),
    authController.logout as Midleware
);

// Register the OpenAPI documentation for the GET /apikey endpoint
registry.registerPath({
    method: 'get',
    path: '/v1/auth/apikey',
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
    tags: ['Auth'],
    request: { body: getOAPIBodySchema(AuthLoginSchema) },
    responses: createApiResponse(AuthLoginSuccessRespSchema, 'Login success'),
});

router.post(
    '/login',
    validateRequest(getReqBodySchema(AuthLoginSchema)),
    authController.login as Midleware
);

registry.registerPath({
    method: 'post',
    path: '/v1/auth/change',
    tags: ['Auth'],
    request: { body: getOAPIBodySchema(AuthChangePasswordSchema) },
    responses: createApiEmptyResponse('Password changed'),
});

router.post(
    '/change',
    validateRequest(getReqBodySchema(AuthChangePasswordSchema)),
    authController.changePassword as Midleware
);

registry.registerPath({
    method: 'post',
    path: '/v1/auth/change_first_run',
    tags: ['Auth'],
    request: { body: getOAPIBodySchema(AuthChangePasswordFirstRunSchema) },
    responses: createApiEmptyResponse('First run password changed'),
});

router.post(
    '/change_first_run',
    validateRequest(getReqBodySchema(AuthChangePasswordFirstRunSchema)),
    authController.changePasswordFirstRun as Midleware
);

export default router;
