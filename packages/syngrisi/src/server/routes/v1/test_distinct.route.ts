import express from 'express';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import * as testController from '@controllers/test.controller';
import { Midleware } from '@types';
import { validateRequest } from '@utils/validateRequest';
import { TestDistinctRequestParamsSchema, TestDistinctResponseSchema } from '@schemas/TestDistinct.schema';
import { createPaginatedApiResponse } from '@api-docs/openAPIResponseBuilders';
import { ensureLoggedIn } from '@middlewares/ensureLogin';
import { createRequestParamsSchema } from '@schemas/utils/createRequestParamsSchema';
import { RequestPaginationSchema } from '@schemas/common/RequestPagination.schema';

export const registry = new OpenAPIRegistry();
const router = express.Router();

registry.registerPath({
    method: 'get',
    path: '/v1/test-distinct/{id}',
    summary: "[Obsolete use '/v1/test/distict' instead] List of certain unique fields across all tests",
    tags: ['Tests'],
    request: { params: TestDistinctRequestParamsSchema, query: RequestPaginationSchema },
    responses: createPaginatedApiResponse(TestDistinctResponseSchema, 'Success'),
});

// TODO: [Obsolete] use '/v1/test/distict' instead of this
router.get(
    '/:id',
    ensureLoggedIn(),
    validateRequest(createRequestParamsSchema(TestDistinctRequestParamsSchema), 'get, /v1/test-distinct/{id}'),
    testController.distinct as Midleware
);

export default router;
