import express from 'express';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { appController } from '@controllers';
import { Midleware } from '@types';
import { validateRequest } from '@utils/validateRequest';
import { AppInfoRespSchema, AppRespSchema } from '@root/src/server/schemas/App.schema';
import {
    createApiResponse,
    createMultipleApiResponse,
} from '@api-docs/openAPIResponseBuilders';
import { SkipValid } from '@schemas/SkipValid.schema';
import { RequestPaginationSchema } from '../../schemas/common/RequestPagination.schema';
import { createRequestQuerySchema } from '../../schemas/utils/createRequestQuerySchema';

export const registry = new OpenAPIRegistry();

const router = express.Router();

registry.registerPath({
    method: 'get',
    path: '/v1/app/info',
    summary: "The current Syngrisi instance information.",
    tags: ['App'],
    responses: createApiResponse(AppInfoRespSchema, 'Success'),
});

router.get(
    '/info',
    validateRequest(SkipValid),
    appController.info as Midleware
);

registry.registerPath({
    method: 'get',
    path: '/v1/app',
    summary: "List of applications (projects) with pagination, and optional filtering and sorting.",
    tags: ['App'],
    request: { query: RequestPaginationSchema },
    responses: createMultipleApiResponse(AppRespSchema, 'Success'),
});

router.get(
    '/',
    validateRequest(createRequestQuerySchema(RequestPaginationSchema)),
    appController.get as Midleware
);

export default router;
