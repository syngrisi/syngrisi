import express from 'express';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import * as checkController from '@controllers/check.controller';
import { Midleware } from '@types';
import { validateRequest } from '@utils/validateRequest';
import { CheckGetSchema, CheckUpdateSchema, CheckAcceptSchema } from '@schemas/Check.schema';
import { createApiResponse, createPaginatedApiResponse } from '@api-docs/openAPIResponseBuilders';
import { ensureLoggedIn } from '@middlewares/ensureLogin';
import { createRequestQuerySchema } from '@schemas/utils/createRequestQuerySchema';
import { RequestPaginationSchema } from '@schemas/common/RequestPagination.schema';
import { createRequestOpenApiBodySchema } from '@schemas/utils/createRequestOpenApiBodySchema';
import { createRequestBodySchema } from '@schemas/utils/createRequestBodySchema';
import { SkipValid } from '@schemas/SkipValid.schema';
import { commonValidations } from '@schemas/utils';
import { getByIdParamsSchema } from '@schemas/utils/createRequestParamsSchema';

export const registry = new OpenAPIRegistry();
const router = express.Router();

registry.registerPath({
    method: 'get',
    path: '/v1/checks',
    summary: "List of checks with pagination, and optional filtering and sorting.",
    tags: ['Checks'],
    request: { query: RequestPaginationSchema },
    responses: createPaginatedApiResponse(CheckGetSchema, 'Success'),
});

router.get(
    '/',
    ensureLoggedIn(),
    validateRequest(createRequestQuerySchema(RequestPaginationSchema), '/v1/checks'),
    checkController.get as Midleware
);

registry.registerPath({
    method: 'delete',
    path: '/v1/checks/{id}',
    summary: "Delete a check by ID",
    tags: ['Checks'],
    request: commonValidations.paramsId,
    responses: createApiResponse(CheckGetSchema, 'Success'),
});

router.delete(
    '/:id',
    ensureLoggedIn(),
    validateRequest(getByIdParamsSchema(), '/v1/checks/{id}'),
    checkController.remove as Midleware
);

registry.registerPath({
    method: 'put',
    path: '/v1/checks/{id}',
    summary: "Update a check by ID",
    tags: ['Checks'],
    request: { params: commonValidations.paramsId.params, body: createRequestOpenApiBodySchema(CheckUpdateSchema) },
    responses: createApiResponse(CheckGetSchema, 'Success'),
});

router.put(
    '/:id',
    ensureLoggedIn(),
    validateRequest(getByIdParamsSchema().merge(createRequestBodySchema(CheckUpdateSchema)), '/v1/checks/{id}'),
    checkController.update as Midleware
);

registry.registerPath({
    method: 'put',
    path: '/v1/checks/accept/{id}',
    summary: "Accept a check by ID",
    tags: ['Checks'],
    request: { params: commonValidations.paramsId.params, body: createRequestOpenApiBodySchema(CheckAcceptSchema) },
    responses: createApiResponse(CheckGetSchema, 'Success'),
});

router.put(
    '/accept/:id',
    ensureLoggedIn(),
    validateRequest(createRequestBodySchema(CheckAcceptSchema), '/v1/checks/accept/{id}'),
    checkController.accept as Midleware
);

registry.registerPath({
    method: 'post',
    path: '/v1/checks/get_via_post',
    summary: "OBSOLETE!!! Get checks via POST request",
    tags: ['Checks'],
    responses: createPaginatedApiResponse(CheckGetSchema, 'Success'),
});

router.post(
    '/get_via_post',
    ensureLoggedIn(),
    validateRequest(SkipValid, '/v1/checks/get_via_post'),
    checkController.getViaPost as Midleware
);

export default router;
