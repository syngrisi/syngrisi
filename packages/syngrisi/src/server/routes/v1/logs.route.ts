import express from 'express';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import * as logsController from '@controllers/logs.controller';
import { Midleware } from '@types';
import { validateRequest } from '@utils/validateRequest';
import { LogGetSchema, LogCreateSchema, LogDistinctSchema, LogCreateRespSchema, LogDistinctResponseSchema } from '@schemas/Logs.schema';
import { createApiResponse, createPaginatedApiResponse } from '@api-docs/openAPIResponseBuilders';
import { ensureLoggedIn } from '@middlewares/ensureLogin';
import { createRequestQuerySchema } from '@schemas/utils/createRequestQuerySchema';
import { RequestPaginationSchema } from '@schemas/common/RequestPagination.schema';
import { createRequestOpenApiBodySchema } from '@schemas/utils/createRequestOpenApiBodySchema';
import { createRequestBodySchema } from '@schemas/utils/createRequestBodySchema';
import StatusCodes from 'http-status';

export const registry = new OpenAPIRegistry();
const router = express.Router();

registry.registerPath({
    method: 'get',
    path: '/v1/logs',
    summary: "List of logs with pagination, and optional filtering and sorting.",
    tags: ['Logs'],
    responses: createPaginatedApiResponse(LogGetSchema, 'Success'),
});

router.get(
    '/',
    ensureLoggedIn(),
    validateRequest(createRequestQuerySchema(RequestPaginationSchema), '/v1/logs'),
    logsController.getLogs as Midleware
);

registry.registerPath({
    method: 'get',
    path: '/v1/logs/distinct',
    summary: "Get distinct log fields",
    tags: ['Logs'],
    request: { query: createRequestQuerySchema(LogDistinctSchema) },
    responses: createApiResponse(LogDistinctResponseSchema, 'Success'),
});

router.get(
    '/distinct',
    ensureLoggedIn(),
    validateRequest(createRequestQuerySchema(LogDistinctSchema), '/v1/logs/distinct'),
    logsController.distinct as Midleware
);

registry.registerPath({
    method: 'post',
    path: '/v1/logs',
    summary: "Create a new log entry",
    tags: ['Logs'],
    request: { body: createRequestOpenApiBodySchema(LogCreateSchema) },
    responses: createApiResponse(LogCreateRespSchema, 'Success', StatusCodes.CREATED),
});

router.post(
    '/',
    ensureLoggedIn(),
    validateRequest(createRequestBodySchema(LogCreateSchema), '/v1/logs'),
    logsController.createLog as Midleware
);

export default router;
