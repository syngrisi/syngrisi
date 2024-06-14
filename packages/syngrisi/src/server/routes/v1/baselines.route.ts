import express from 'express';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import * as baselineController from '@controllers/baseline.controller';
import { Midleware } from '@types';
import { validateRequest } from '@utils/validateRequest';
import { BaselineGetSchema, BaselinePutSchema } from '@schemas/Baseline.schema';
import { createApiEmptyResponse, createPaginatedApiResponse } from '@api-docs/openAPIResponseBuilders';
import { ensureLoggedIn } from '@middlewares/ensureLogin';
import { createRequestQuerySchema } from '@schemas/utils/createRequestQuerySchema';
import { RequestPaginationSchema } from '@schemas/common/RequestPagination.schema';
import { createRequestOpenApiBodySchema } from '@schemas/utils/createRequestOpenApiBodySchema';
import { createRequestBodySchema } from '@schemas/utils/createRequestBodySchema';
import { commonValidations } from '@schemas/utils';
import { getByIdParamsSchema } from '@schemas/utils/createRequestParamsSchema';

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
    ensureLoggedIn(),
    validateRequest(createRequestQuerySchema(RequestPaginationSchema)),

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
    validateRequest(getByIdParamsSchema().merge(createRequestBodySchema(BaselinePutSchema))),
    baselineController.put as Midleware
);

export default router;
