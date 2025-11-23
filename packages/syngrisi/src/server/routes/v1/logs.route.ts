import express from 'express';
import { z } from 'zod';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import * as logsController from '@controllers/logs.controller';
import { Midleware } from '@types';
import { validateRequest } from '@utils/validateRequest';
import { LogGetSchema, LogCreateSchema, LogDistinctSchema, LogCreateRespSchema, LogDistinctResponseSchema } from '@schemas/Logs.schema';
import { createApiResponse, createPaginatedApiResponse } from '@api-docs/openAPIResponseBuilders';
import { ensureLoggedInOrApiKey } from '@middlewares/ensureLogin';
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
    ensureLoggedInOrApiKey(),
    validateRequest(createRequestQuerySchema(RequestPaginationSchema), 'get, /v1/logs'),
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
    ensureLoggedInOrApiKey(),
    validateRequest(createRequestQuerySchema(LogDistinctSchema), 'get, /v1/logs/distinct'),
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
    ensureLoggedInOrApiKey(),
    validateRequest(createRequestBodySchema(LogCreateSchema), 'post, /v1/logs'),
    logsController.createLog as Midleware
);

registry.registerPath({
    method: 'post',
    path: '/v1/logs/bulk',
    summary: "Create multiple log entries",
    tags: ['Logs'],
    request: { body: createRequestOpenApiBodySchema(z.array(LogCreateSchema)) },
    responses: createApiResponse(LogCreateRespSchema, 'Success', StatusCodes.CREATED),
});

router.post(
    '/bulk',
    ensureLoggedInOrApiKey(),
    validateRequest(createRequestBodySchema(z.array(LogCreateSchema)), 'post, /v1/logs/bulk'),
    logsController.createMany as Midleware
);

export default router;
