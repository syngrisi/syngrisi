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
import { ReqGetMultipleSchema } from '@schemas/common/ReqGetMultiple.schema';
import { getReqQueryMultipleSchema } from '@schemas/common/getReqQuerySchema';

export const registry = new OpenAPIRegistry();

const router = express.Router();

registry.registerPath({
    method: 'get',
    path: '/v1/app/info',
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
    tags: ['App'],
    request: { query: ReqGetMultipleSchema },
    responses: createMultipleApiResponse(AppRespSchema, 'Success'),
});

router.get(
    '/',
    validateRequest(getReqQueryMultipleSchema(ReqGetMultipleSchema)),
    appController.get as Midleware
);

export default router;
