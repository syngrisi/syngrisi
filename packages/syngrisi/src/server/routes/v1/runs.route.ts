import express from 'express';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import * as runController from '@controllers/runs.controller';
import { Midleware } from '@types';
import { validateRequest } from '@utils/validateRequest';
import { RunResponseSchema } from '@schemas/Runs.schema';
import { createApiResponse, createPaginatedApiResponse } from '@api-docs/openAPIResponseBuilders';
import { ensureLoggedIn } from '@middlewares/ensureLogin';
import { createRequestQuerySchema } from '@schemas/utils/createRequestQuerySchema';
import { RequestPaginationSchema } from '@schemas/common/RequestPagination.schema';
import { commonValidations } from '@schemas/utils';
import { getByIdParamsSchema } from '@schemas/utils/createRequestParamsSchema';

export const registry = new OpenAPIRegistry();
const router = express.Router();

registry.registerPath({
    method: 'get',
    path: '/v1/runs',
    summary: "List of runs with pagination, and optional filtering and sorting.",
    tags: ['Runs'],
    request: { query: RequestPaginationSchema },
    responses: createPaginatedApiResponse(RunResponseSchema, 'Success'),
});

router.get(
    '/',
    ensureLoggedIn(),
    validateRequest(createRequestQuerySchema(RequestPaginationSchema), 'get, /v1/runs'),
    runController.get as Midleware
);

registry.registerPath({
    method: 'delete',
    path: '/v1/runs/{id}',
    summary: "Delete a run by ID",
    tags: ['Runs'],
    request: commonValidations.paramsId,
    responses: createApiResponse(RunResponseSchema, 'Success'),
});

router.delete(
    '/:id',
    ensureLoggedIn(),
    validateRequest(getByIdParamsSchema(), 'delete, /v1/runs/{id}'),
    runController.remove as Midleware
);

export default router;
