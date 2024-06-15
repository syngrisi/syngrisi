import express from 'express';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import * as tasksController from '@controllers/tasks.controller';
import { Midleware } from '@types';
import { ensureLoggedIn } from '@middlewares/ensureLogin';
import { authorization } from '@middlewares';
import { SkipValid } from '@schemas/SkipValid.schema';
import { validateRequest } from '@utils/validateRequest';
import { createApiResponse } from '@api-docs/openAPIResponseBuilders';

export const registry = new OpenAPIRegistry();
const router = express.Router();

registry.registerPath({
    method: 'get',
    path: '/v1/tasks/task_test',
    summary: "Test task endpoint",
    tags: ['Tasks'],
    responses: createApiResponse(SkipValid, 'Success'),
});

router.get(
    '/task_test',
    ensureLoggedIn(),
    authorization('admin') as Midleware,
    validateRequest(SkipValid, 'get, /v1/tasks/task_test'),
    tasksController.task_test as Midleware
);

registry.registerPath({
    method: 'get',
    path: '/v1/tasks/task_handle_old_checks',
    summary: "Handle old checks task",
    tags: ['Tasks'],
    responses: createApiResponse(SkipValid, 'Success'),
});

router.get(
    '/task_handle_old_checks',
    ensureLoggedIn(),
    authorization('admin') as Midleware,
    validateRequest(SkipValid, 'get, /v1/tasks/task_handle_old_checks'),
    tasksController.task_handle_old_checks as Midleware
);

registry.registerPath({
    method: 'get',
    path: '/v1/tasks/task_handle_database_consistency',
    summary: "Handle database consistency task",
    tags: ['Tasks'],
    responses: createApiResponse(SkipValid, 'Success'),
});

router.get(
    '/task_handle_database_consistency',
    ensureLoggedIn(),
    authorization('admin') as Midleware,
    validateRequest(SkipValid, 'get, /v1/tasks/task_handle_database_consistency'),
    tasksController.task_handle_database_consistency as Midleware
);

registry.registerPath({
    method: 'get',
    path: '/v1/tasks/task_remove_old_logs',
    summary: "Remove old logs task",
    tags: ['Tasks'],
    responses: createApiResponse(SkipValid, 'Success'),
});

router.get(
    '/task_remove_old_logs',
    ensureLoggedIn(),
    authorization('admin') as Midleware,
    validateRequest(SkipValid, 'get, /v1/tasks/task_remove_old_logs'),
    tasksController.task_remove_old_logs as Midleware
);

registry.registerPath({
    method: 'get',
    path: '/v1/tasks/loadTestUser',
    summary: "Load test user",
    tags: ['Tasks'],
    responses: createApiResponse(SkipValid, 'Success'),
});

router.get(
    '/loadTestUser',
    ensureLoggedIn() as Midleware,
    validateRequest(SkipValid, 'get, /v1/tasks/loadTestUser'),
    tasksController.loadTestUser as Midleware
);

registry.registerPath({
    method: 'get',
    path: '/v1/tasks/status',
    summary: "Get status task, only for the test cases",
    tags: ['Tasks'],
    responses: createApiResponse(SkipValid, 'Success'),
});

router.get(
    '/status',
    validateRequest(SkipValid, 'get, /v1/tasks/status'),
    tasksController.status as Midleware
);

registry.registerPath({
    method: 'get',
    path: '/v1/tasks/screenshots',
    summary: "Get screenshots task",
    tags: ['Tasks'],
    responses: createApiResponse(SkipValid, 'Success'),
});

router.get(
    '/screenshots',
    validateRequest(SkipValid, 'get, /v1/tasks/screenshots'),
    tasksController.screenshots as Midleware
);

export default router;
