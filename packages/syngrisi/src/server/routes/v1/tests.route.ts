import express from 'express';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import * as testController from '@controllers/test.controller';
import { Midleware } from '@types';
import { validateRequest } from '@utils/validateRequest';
import { TestDistinctRequestFieldParamsSchema, TestGetSchema } from '@schemas/Test.schema';
import { createApiResponse, createPaginatedApiResponse } from '@api-docs/openAPIResponseBuilders';
import { ensureLoggedIn } from '@middlewares/ensureLogin';
import { RequestPaginationSchema } from '@schemas/common/RequestPagination.schema';
import { createRequestQuerySchema } from '@schemas/utils/createRequestQuerySchema';
import { commonValidations } from '@schemas/utils';
import { createRequestParamsSchema, getByIdParamsSchema } from '@schemas/utils/createRequestParamsSchema';
import { TestDistinctResponseSchema } from '@schemas/TestDistinct.schema';

export const registry = new OpenAPIRegistry();
const router = express.Router();

registry.registerPath({
    method: 'get',
    path: '/v1/tests',
    summary: "Get list of tests",
    tags: ['Tests'],
    request: { query: RequestPaginationSchema },
    responses: createPaginatedApiResponse(TestGetSchema, 'Success'),
});

router.get(
    '/',
    ensureLoggedIn(),
    validateRequest(createRequestQuerySchema(RequestPaginationSchema), 'get, /v1/checks'),
    testController.getTest as Midleware
);

registry.registerPath({
    method: 'get',
    path: '/v1/tests/distinct/{field}',
    summary: "List of certain unique fields across all tests",
    tags: ['Tests'],
    request: { params: TestDistinctRequestFieldParamsSchema, query: RequestPaginationSchema },
    responses: createPaginatedApiResponse(TestDistinctResponseSchema, 'Success'),
});

router.get(
    '/distinct/:field',
    ensureLoggedIn(),
    validateRequest(
        createRequestParamsSchema(TestDistinctRequestFieldParamsSchema)
            .merge(createRequestQuerySchema(RequestPaginationSchema)
            ),
        'get, /distinct/:field'
    ),
    testController.distinct_with_filter as Midleware
);

registry.registerPath({
    method: 'delete',
    path: '/v1/tests/{id}',
    summary: "Delete a test by ID",
    tags: ['Tests'],
    request: commonValidations.paramsId,
    responses: createApiResponse(TestGetSchema, 'Success'),
});

router.delete(
    '/:id',
    ensureLoggedIn(),
    // validateRequest(getByIdParamsSchema(), '/v1/runs/{id}'),

    validateRequest(getByIdParamsSchema(), 'delete, /v1/tests/{id}'),
    testController.remove as Midleware
);

registry.registerPath({
    method: 'put',
    path: '/v1/tests/accept/{id}',
    summary: "Accept a test by ID",
    tags: ['Tests'],
    request: commonValidations.paramsId,
    // request: { params: TestDistinctRequestParamsSchema, body: createRequestOpenApiBodySchema(TestAcceptSchema) },
    responses: createApiResponse(commonValidations.success, 'Success'),
});

router.put(
    '/accept/:id',
    ensureLoggedIn(),
    validateRequest(getByIdParamsSchema(), 'put, /v1/tests/accept/{id}'),
    testController.accept as Midleware
);

export default router;
