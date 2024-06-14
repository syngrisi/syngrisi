import express from 'express';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import * as clientController from '@controllers/client.controller';
import { Midleware } from '@types';
import { validateRequest } from '@utils/validateRequest';
import { ClientStartSessionSchema, ClientCreateCheckSchema, ClientGetIdentSchema, ClientGetBaselinesSchema, ClientGetSnapshotsSchema, ClientStartSessionResponseSchema, ClientCreateCheckResponseSchema } from '@schemas/Client.schema';
import { createApiResponse, createPaginatedApiResponse } from '@api-docs/openAPIResponseBuilders';
import { ensureApiKey } from '@middlewares/ensureLogin';
import { createRequestQuerySchema } from '@schemas/utils/createRequestQuerySchema';
import { RequestPaginationSchema } from '@schemas/common/RequestPagination.schema';
import { createRequestOpenApiBodySchema } from '@schemas/utils/createRequestOpenApiBodySchema';
import { createRequestBodySchema } from '@schemas/utils/createRequestBodySchema';
import { commonValidations } from '@schemas/utils';
import { SkipValid } from '@schemas/SkipValid.schema';
import { getByIdParamsSchema } from '../../schemas/utils/createRequestParamsSchema';
import { IdentJSONStringSchema } from '../../schemas';

export const registry = new OpenAPIRegistry();
const router = express.Router();

registry.registerPath({
    method: 'post',
    path: '/v1/client/startSession',
    summary: "Start a client session",
    tags: ['Client'],
    request: { body: createRequestOpenApiBodySchema(ClientStartSessionSchema) },
    responses: createApiResponse(ClientStartSessionResponseSchema, 'Success'),
});

router.post(
    '/startSession',
    ensureApiKey(),
    validateRequest(createRequestBodySchema(ClientStartSessionSchema), '/v1/client/startSession'),
    clientController.startSession as Midleware
);

registry.registerPath({
    method: 'post',
    path: '/v1/client/stopSession/{testid}',
    summary: "Stop a client session by test ID",
    tags: ['Client'],
    request: commonValidations.paramsTestId,
    responses: createApiResponse(ClientStartSessionResponseSchema, 'Success'),
});

router.post(
    '/stopSession/:testid',
    ensureApiKey(),
    // validateRequest(SkipValid, '/v1/client/stopSession/{testid}'),
    validateRequest(getByIdParamsSchema('testid'), '/v1/client/stopSession/{testid}'),
    clientController.endSession as Midleware
);

registry.registerPath({
    method: 'post',
    path: '/v1/client/createCheck',
    summary: "Create a client check",
    tags: ['Client'],
    request: { body: createRequestOpenApiBodySchema(ClientCreateCheckSchema) },
    responses: createApiResponse(ClientCreateCheckResponseSchema, 'Success'),
});

router.post(
    '/createCheck',
    ensureApiKey(),
    validateRequest(createRequestBodySchema(ClientCreateCheckSchema), '/v1/client/createCheck'),
    clientController.createCheck as Midleware
);

registry.registerPath({
    method: 'get',
    path: '/v1/client/getIdent',
    summary: "Set of fields that identify checks and baselines",
    tags: ['Client'],
    responses: createApiResponse(ClientGetIdentSchema, 'Success'),
});

router.get(
    '/getIdent',
    ensureApiKey(),
    validateRequest(SkipValid, '/v1/client/getIdent'),
    clientController.getIdent as Midleware
);

const ExtRequestBaselineSchema = RequestPaginationSchema.extend(
    {
        filter: IdentJSONStringSchema,
    }
);
registry.registerPath({
    method: 'get',
    path: '/v1/client/baselines',
    summary: "Get client baselines",
    tags: ['Client'],
    // request: { query: RequestPaginationSchema },
    request: { query: ExtRequestBaselineSchema },
    responses: createPaginatedApiResponse(ClientGetBaselinesSchema, 'Success'),
});

router.get(
    '/baselines',
    ensureApiKey(),
    validateRequest(createRequestQuerySchema(ExtRequestBaselineSchema), '/v1/client/baselines'),
    clientController.getBaselines as Midleware
);

registry.registerPath({
    method: 'get',
    path: '/v1/client/snapshots',
    summary: "Get client snapshots",
    tags: ['Client'],
    request: { query: RequestPaginationSchema },
    responses: createPaginatedApiResponse(ClientGetSnapshotsSchema, 'Success'),
});

router.get(
    '/snapshots',
    ensureApiKey(),
    validateRequest(createRequestQuerySchema(RequestPaginationSchema), '/v1/client/snapshots'),
    clientController.getSnapshots as Midleware
);

export default router;
