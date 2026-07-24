import express from 'express';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import * as corsEmbedController from '@controllers/corsEmbed.controller';
import { Midleware } from '@types';
import { ensureLoggedIn } from '@middlewares/ensureLogin';
import { authorization } from '@middlewares/authorization';
import { validateRequest } from '@utils/validateRequest';
import { SkipValid } from '@schemas/SkipValid.schema';

export const registry = new OpenAPIRegistry();
const router = express.Router();

registry.registerPath({
    method: 'get',
    path: '/v1/cors-embed',
    summary: 'Get CORS & Embed integration settings (admin)',
    tags: ['CORS Embed'],
    responses: {},
});

router.get(
    '/',
    ensureLoggedIn(),
    authorization('admin') as Midleware,
    validateRequest(SkipValid, 'get, /v1/cors-embed'),
    corsEmbedController.getSettings as Midleware,
);

registry.registerPath({
    method: 'put',
    path: '/v1/cors-embed',
    summary: 'Update CORS & Embed integration settings (admin)',
    tags: ['CORS Embed'],
    responses: {},
});

router.put(
    '/',
    ensureLoggedIn(),
    authorization('admin') as Midleware,
    validateRequest(SkipValid, 'put, /v1/cors-embed'),
    corsEmbedController.updateSettings as Midleware,
);

registry.registerPath({
    method: 'get',
    path: '/v1/cors-embed/csrf',
    summary: 'Issue CSRF token for cross-origin credentialed API calls',
    tags: ['CORS Embed'],
    responses: {},
});

router.get(
    '/csrf',
    ensureLoggedIn(),
    validateRequest(SkipValid, 'get, /v1/cors-embed/csrf'),
    corsEmbedController.getCsrf as Midleware,
);

registry.registerPath({
    method: 'post',
    path: '/v1/cors-embed/prepare-cookie',
    summary: 'Re-issue session cookie for cross-site credentialed use (SameSite=None when configured)',
    tags: ['CORS Embed'],
    responses: {},
});

router.post(
    '/prepare-cookie',
    ensureLoggedIn(),
    validateRequest(SkipValid, 'post, /v1/cors-embed/prepare-cookie'),
    corsEmbedController.prepareCookie as Midleware,
);

registry.registerPath({
    method: 'get',
    path: '/v1/cors-embed/status',
    summary: 'Public status for the current Origin (logged-in)',
    tags: ['CORS Embed'],
    responses: {},
});

router.get(
    '/status',
    ensureLoggedIn(),
    validateRequest(SkipValid, 'get, /v1/cors-embed/status'),
    corsEmbedController.getStatus as Midleware,
);

export default router;
