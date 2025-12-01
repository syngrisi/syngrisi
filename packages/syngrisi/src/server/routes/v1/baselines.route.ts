import express from 'express';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import * as baselineController from '@controllers/baseline.controller';
import { Midleware } from '@types';
import { validateRequest } from '@utils/validateRequest';
import { BaselineGetSchema, BaselinePutSchema } from '@schemas/Baseline.schema';
import { createApiEmptyResponse, createApiResponse, createPaginatedApiResponse } from '@api-docs/openAPIResponseBuilders';
import { ApiErrorSchema } from '@schemas/common/ApiError.schema';
import StatusCodes from 'http-status';
import { ensureLoggedIn } from '@middlewares/ensureLogin';
import { createRequestQuerySchema } from '@schemas/utils/createRequestQuerySchema';
import { RequestPaginationSchema } from '@schemas/common/RequestPagination.schema';
import { createRequestOpenApiBodySchema } from '@schemas/utils/createRequestOpenApiBodySchema';
import { createRequestBodySchema } from '@schemas/utils/createRequestBodySchema';
import { commonValidations } from '@schemas/utils';
import { getByIdParamsSchema } from '@schemas/utils/createRequestParamsSchema';
import { ensureLoggedInOrApiKey } from '../../middlewares/ensureLogin/ensureLoggedIn';

export const registry = new OpenAPIRegistry();
const router = express.Router();

registry.registerPath({
    method: 'get',
    path: '/v1/baselines',
    summary: "List of baselines with pagination, and optional filtering and sorting.",
    tags: ['Baselines'],
    request: { query: RequestPaginationSchema },
    responses: createPaginatedApiResponse(BaselineGetSchema, 'Success'),
});

router.get(
    '/',
    ensureLoggedInOrApiKey(),
    validateRequest(createRequestQuerySchema(RequestPaginationSchema), 'get, /v1/baselines'),

    baselineController.get as Midleware
);

registry.registerPath({
    method: 'put',
    path: '/v1/baselines/{id}',
    summary: "Only for testing purposes for now",
    tags: ['Baselines'],
    request: { params: commonValidations.paramsId.params, body: createRequestOpenApiBodySchema(BaselinePutSchema) },
    responses: createApiEmptyResponse('Success'),
});

router.put(
    '/:id',
    ensureLoggedIn(),
    validateRequest(getByIdParamsSchema().merge(createRequestBodySchema(BaselinePutSchema)), 'put, /v1/baselines/{id}'),
    baselineController.put as Midleware
);

registry.registerPath({
    method: 'delete',
    path: '/v1/baselines/{id}',
    summary: "Remove a baseline by ID",
    description: "Remove a baseline by ID",
    tags: ['Baselines'],
    request: commonValidations.paramsId,
    responses: {
        ...createApiResponse(BaselineGetSchema, 'Success'),
        ...createApiResponse(ApiErrorSchema, 'ApiError', StatusCodes.NOT_FOUND),
    },
});

router.delete(
    '/:id',
    ensureLoggedIn(),
    validateRequest(getByIdParamsSchema(), 'delete, /v1/baselines/{id}'),
    baselineController.remove as Midleware
);

export default router;
