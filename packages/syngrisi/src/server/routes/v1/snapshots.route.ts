import express from 'express';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import * as snapshotsController from '@controllers/snapshots.controller';
import { Midleware } from '@types';
import { ensureLoggedIn } from '@middlewares/ensureLogin';
import { validateRequest } from '@utils/validateRequest';
import { SnapshotsResponseSchema } from '@schemas/Snapshots.schema'
import { createPaginatedApiResponse } from '@api-docs/openAPIResponseBuilders';
import { createRequestQuerySchema } from '@schemas/utils/createRequestQuerySchema';
import { RequestPaginationSchema } from '@schemas/common/RequestPagination.schema';

export const registry = new OpenAPIRegistry();
const router = express.Router();

registry.registerPath({
    method: 'get',
    path: '/v1/snapshots',
    summary: "List of snapshots with pagination, and optional filtering and sorting.",
    tags: ['Snapshots'],
    request: { query: RequestPaginationSchema },
    responses: createPaginatedApiResponse(SnapshotsResponseSchema, 'Success'),

});

router.get(
    '/',
    ensureLoggedIn(),
    validateRequest(createRequestQuerySchema(RequestPaginationSchema), '/v1/snapshots'),
    snapshotsController.get as Midleware
);

export default router;
