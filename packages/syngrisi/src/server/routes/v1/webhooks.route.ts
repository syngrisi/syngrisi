import express from 'express';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import * as webhookController from '@controllers/webhook.controller';
import { Midleware } from '@types';
import { validateRequest } from '@utils/validateRequest';
import { WebhookGetSchema, WebhookCreateSchema, WebhookUpdateSchema } from '@schemas/Webhook.schema';
import { createApiResponse, createPaginatedApiResponse } from '@api-docs/openAPIResponseBuilders';
import { ensureLoggedIn } from '@middlewares/ensureLogin';
import { commonValidations } from '@schemas/utils';
import { getByIdParamsSchema } from '@schemas/utils/createRequestParamsSchema';
import { createRequestQuerySchema } from '@schemas/utils/createRequestQuerySchema';
import { createRequestBodySchema } from '@schemas/utils/createRequestBodySchema';
import { createRequestOpenApiBodySchema } from '@schemas/utils/createRequestOpenApiBodySchema';
import { RequestPaginationSchema } from '@schemas/common/RequestPagination.schema';
import { ApiErrorSchema } from '@schemas/common/ApiError.schema';
import { HttpStatus } from '@utils';

export const registry = new OpenAPIRegistry();
const router = express.Router();

registry.registerPath({
    method: 'get',
    path: '/v1/webhooks',
    summary: "List of webhooks with pagination, and optional filtering and sorting.",
    tags: ['Webhooks'],
    request: { query: RequestPaginationSchema },
    responses: createPaginatedApiResponse(WebhookGetSchema, 'Success'),
});

router.get(
    '/',
    ensureLoggedIn(),
    validateRequest(createRequestQuerySchema(RequestPaginationSchema), 'get, /v1/webhooks'),
    webhookController.get as Midleware
);

registry.registerPath({
    method: 'post',
    path: '/v1/webhooks',
    summary: "Register a new webhook.",
    tags: ['Webhooks'],
    request: { body: createRequestOpenApiBodySchema(WebhookCreateSchema) },
    responses: createApiResponse(WebhookGetSchema, 'Success', HttpStatus.CREATED),
});

router.post(
    '/',
    ensureLoggedIn(),
    validateRequest(createRequestBodySchema(WebhookCreateSchema), 'post, /v1/webhooks'),
    webhookController.create as Midleware
);

registry.registerPath({
    method: 'patch',
    path: '/v1/webhooks/{id}',
    summary: "Update a webhook by ID.",
    tags: ['Webhooks'],
    request: { params: commonValidations.paramsId.params, body: createRequestOpenApiBodySchema(WebhookUpdateSchema) },
    responses: {
        ...createApiResponse(WebhookGetSchema, 'Success'),
        ...createApiResponse(ApiErrorSchema, 'ApiError', HttpStatus.NOT_FOUND),
    },
});

router.patch(
    '/:id',
    ensureLoggedIn(),
    validateRequest(getByIdParamsSchema().merge(createRequestBodySchema(WebhookUpdateSchema)), 'patch, /v1/webhooks/{id}'),
    webhookController.update as Midleware
);

registry.registerPath({
    method: 'delete',
    path: '/v1/webhooks/{id}',
    summary: "Remove a webhook by ID.",
    tags: ['Webhooks'],
    request: commonValidations.paramsId,
    responses: {
        ...createApiResponse(WebhookGetSchema, 'Success'),
        ...createApiResponse(ApiErrorSchema, 'ApiError', HttpStatus.NOT_FOUND),
    },
});

router.delete(
    '/:id',
    ensureLoggedIn(),
    validateRequest(getByIdParamsSchema(), 'delete, /v1/webhooks/{id}'),
    webhookController.remove as Midleware
);

export default router;
