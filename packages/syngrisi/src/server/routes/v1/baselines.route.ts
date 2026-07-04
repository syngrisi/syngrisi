import express from 'express';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import * as baselineController from '@controllers/baseline.controller';
import { Midleware } from '@types';
import { validateRequest } from '@utils/validateRequest';
import {
    BaselineGetSchema,
    BaselinePutSchema,
    BaselineHistoryQuerySchema,
    BaselineHistoryItemSchema,
    HistorySummaryBodySchema,
    HistorySummaryResponseSchema,
} from '@schemas/Baseline.schema';
import { createApiEmptyResponse, createApiResponse, createPaginatedApiResponse } from '@api-docs/openAPIResponseBuilders';
import { ApiErrorSchema } from '@schemas/common/ApiError.schema';
import { HttpStatus } from '@utils';
import { ensureLoggedIn } from '@middlewares/ensureLogin';
import { createRequestQuerySchema } from '@schemas/utils/createRequestQuerySchema';
import { RequestPaginationSchema } from '@schemas/common/RequestPagination.schema';
import { createRequestOpenApiBodySchema } from '@schemas/utils/createRequestOpenApiBodySchema';
import { createRequestBodySchema } from '@schemas/utils/createRequestBodySchema';
import { commonValidations } from '@schemas/utils';
import { getByIdParamsSchema } from '@schemas/utils/createRequestParamsSchema';
import { ensureLoggedInOrApiKey, ensureLoggedInOrApiKeyOrShareToken } from '../../middlewares/ensureLogin/ensureLoggedIn';

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
    ensureLoggedInOrApiKeyOrShareToken(),
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
        ...createApiResponse(ApiErrorSchema, 'ApiError', HttpStatus.NOT_FOUND),
    },
});

router.delete(
    '/:id',
    ensureLoggedIn(),
    validateRequest(getByIdParamsSchema(), 'delete, /v1/baselines/{id}'),
    baselineController.remove as Midleware
);

registry.registerPath({
    method: 'get',
    path: '/v1/baselines/{id}/dom',
    summary: "Get DOM snapshot for a baseline (for RCA feature)",
    tags: ['Baselines'],
    request: commonValidations.paramsId,
    responses: {
        200: {
            description: 'DOM snapshot content as JSON',
            content: {
                'application/json': {
                    schema: { type: 'object' },
                },
            },
        },
        404: { description: 'DOM snapshot not found' },
    },
});

router.get(
    '/:id/dom',
    ensureLoggedInOrApiKey(),
    validateRequest(getByIdParamsSchema(), 'get, /v1/baselines/{id}/dom'),
    baselineController.getDomSnapshot as Midleware
);

registry.registerPath({
    method: 'get',
    path: '/v1/baselines/history',
    summary: "Ordered accepted-baseline timeline for one check ident (baseline time machine)",
    tags: ['Baselines'],
    request: { query: BaselineHistoryQuerySchema },
    responses: createApiResponse(BaselineHistoryItemSchema.array(), 'Success'),
});

router.get(
    '/history',
    ensureLoggedInOrApiKeyOrShareToken(),
    validateRequest(createRequestQuerySchema(BaselineHistoryQuerySchema), 'get, /v1/baselines/history'),
    baselineController.getBaselineHistory as Midleware
);

registry.registerPath({
    method: 'post',
    path: '/v1/baselines/history-summary',
    summary: "AI-generated summary of the visual change between two baselines (baseline time machine)",
    tags: ['Baselines'],
    request: { body: createRequestOpenApiBodySchema(HistorySummaryBodySchema) },
    responses: createApiResponse(HistorySummaryResponseSchema, 'Success'),
});

router.post(
    '/history-summary',
    ensureLoggedIn(),
    validateRequest(createRequestBodySchema(HistorySummaryBodySchema), 'post, /v1/baselines/history-summary'),
    baselineController.getBaselineHistorySummary as Midleware
);

export default router;
