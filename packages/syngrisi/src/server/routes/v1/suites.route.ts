import express from 'express';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import * as suiteController from '@controllers/suite.controller';
import { Midleware } from '@types';
import { validateRequest } from '@utils/validateRequest';
import { SuiteGetSchema } from '@schemas/Suite.schema';
import { createApiResponse, createPaginatedApiResponse } from '@api-docs/openAPIResponseBuilders';
import { ensureLoggedIn } from '@middlewares/ensureLogin';
import { commonValidations } from '@schemas/utils';
import { getByIdParamsSchema } from '@schemas/utils/createRequestParamsSchema';
import { SkipValid } from '@schemas/SkipValid.schema';
import { ApiErrorSchema } from '@schemas/common/ApiError.schema';
import StatusCodes from 'http-status';

export const registry = new OpenAPIRegistry();
const router = express.Router();

registry.registerPath({
    method: 'get',
    path: '/v1/suites',
    summary: "List of suites",
    tags: ['Suites'],
    responses: createPaginatedApiResponse(SuiteGetSchema, 'Success'),
});

router.get(
    '/',
    ensureLoggedIn(),
    validateRequest(SkipValid, 'get, /v1/suites'),
    suiteController.get as Midleware
);

registry.registerPath({
    method: 'delete',
    path: '/v1/suites/{id}',
    summary: "Delete a suite by ID",
    tags: ['Suites'],
    request: commonValidations.paramsId,
    responses: {
        ...createApiResponse(SuiteGetSchema, 'Success'),
        ...createApiResponse(ApiErrorSchema, 'ApiError', StatusCodes.NOT_FOUND),
    },
});

router.delete(
    '/:id',
    ensureLoggedIn(),
    validateRequest(getByIdParamsSchema(), 'delete, /v1/suites/{id}'),
    suiteController.remove as Midleware
);

export default router;
