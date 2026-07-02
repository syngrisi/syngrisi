import express from 'express';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { appController } from '@controllers';
import { Midleware } from '@types';
import { validateRequest } from '@utils/validateRequest';
import { AppInfoRespSchema, AppRespSchema } from '@root/src/server/schemas/App.schema';
import { AppTriagePolicyUpdateSchema } from '@root/src/server/schemas/AppTriagePolicy.schema';
import {
    createApiResponse,
    createPaginatedApiResponse,
} from '@api-docs/openAPIResponseBuilders';
import { SkipValid } from '@schemas/SkipValid.schema';
import { ensureLoggedIn } from '@middlewares/ensureLogin';
import { ensureLoggedInOrApiKey } from '@middlewares/ensureLogin/ensureLoggedIn';
import { authorization } from '@middlewares';
import { createRequestBodySchema } from '../../schemas/utils/createRequestBodySchema';
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
    validateRequest(SkipValid, 'get, /v1/app/info'),
    appController.info as Midleware
);

registry.registerPath({
    method: 'get',
    path: '/v1/app/system-info',
    summary: "The current Syngrisi system information including Node.js version, MongoDB version, and auth type.",
    tags: ['App'],
    responses: createApiResponse(AppInfoRespSchema, 'Success'),
});

router.get(
    '/system-info',
    validateRequest(SkipValid, 'get, /v1/app/system-info'),
    appController.systemInfo as Midleware
);

registry.registerPath({
    method: 'get',
    path: '/v1/app',
    summary: "List of applications (projects) with pagination, and optional filtering and sorting.",
    tags: ['App'],
    request: { query: RequestPaginationSchema },
    responses: createPaginatedApiResponse(AppRespSchema, 'Success'),
});

router.get(
    '/',
    ensureLoggedInOrApiKey(),
    validateRequest(createRequestQuerySchema(RequestPaginationSchema), 'get, /v1/app'),
    appController.get as Midleware
);

router.patch(
    '/:id/triage-policy',
    ensureLoggedIn(),
    authorization('admin') as Midleware,
    validateRequest(createRequestBodySchema(AppTriagePolicyUpdateSchema), 'patch, /v1/app/:id/triage-policy'),
    appController.updateTriagePolicy as Midleware
);

export default router;
