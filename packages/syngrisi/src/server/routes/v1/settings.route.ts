import express from 'express';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import * as settingsController from '@controllers/settings.controller';
import { Midleware } from '@types';
import { ensureLoggedIn } from '@middlewares/ensureLogin';
import { authorization } from '@middlewares/authorization';
import { validateRequest } from '@utils/validateRequest';
import { SettingsNameParamSchema, SettingsResponseSchema, SettingsUpdateSchema } from '@schemas/Settings.schema';
import { createApiResponse } from '@api-docs/openAPIResponseBuilders';
import { SkipValid } from '@schemas/SkipValid.schema';
import { createRequestOpenApiBodySchema } from '@schemas/utils/createRequestOpenApiBodySchema';
import { createRequestBodySchema } from '@schemas/utils/createRequestBodySchema';
import { createRequestParamsSchema } from '@schemas/utils/createRequestParamsSchema';
import { commonValidations } from '@schemas/utils';

export const registry = new OpenAPIRegistry();
const router = express.Router();

registry.registerPath({
    method: 'get',
    path: '/v1/settings',
    summary: "Get application settings",
    tags: ['Settings'],
    responses: createApiResponse(SettingsResponseSchema, 'Success'),
});

router.get(
    '/',
    ensureLoggedIn(),
    authorization('admin') as Midleware,
    validateRequest(SkipValid, 'get, /v1/settings'),
    settingsController.getSettings as Midleware
);

registry.registerPath({
    method: 'get',
    path: '/v1/settings/public',
    summary: "Get public application settings",
    tags: ['Settings'],
    responses: createApiResponse(SettingsResponseSchema, 'Success'),
});

router.get(
    '/public',
    ensureLoggedIn(),
    validateRequest(SkipValid, 'get, /v1/settings/public'),
    settingsController.getPublicSettings as Midleware
);

registry.registerPath({
    method: 'patch',
    path: '/v1/settings/{name}',
    summary: "Update a setting by name",
    tags: ['Settings'],
    request: { params: SettingsNameParamSchema, body: createRequestOpenApiBodySchema(SettingsUpdateSchema) },
    responses: createApiResponse(commonValidations.success, 'Success'),
});

const validateSchema = createRequestParamsSchema(SettingsNameParamSchema)
    .merge(createRequestBodySchema(SettingsUpdateSchema));
router.patch(
    '/:name',
    ensureLoggedIn(),
    authorization('admin') as Midleware,
    validateRequest(validateSchema, 'patch, /v1/settings/{name}'),
    settingsController.updateSetting as Midleware
);

export default router;
