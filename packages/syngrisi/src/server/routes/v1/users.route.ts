import express from 'express';
import StatusCodes from 'http-status';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { Midleware } from '@types';
import { usersController } from '@controllers';
import { ensureLoggedIn } from '@middlewares/ensureLogin';
import { authorization } from '@middlewares';
import { validateRequest } from '@utils/validateRequest';
import { UserCreateReqSchema, UserCreateRespSchema, UserCurrentRespSchema, UserGetRespSchema, UserSchema } from '@schemas/User.schema';
import { SkipValid } from '@schemas/SkipValid.schema';
import { createApiEmptyResponse, createApiResponse, createPaginatedApiResponse } from '@api-docs/openAPIResponseBuilders';
import { RequestPaginationSchema } from '@schemas/common/RequestPagination.schema';
import { createRequestOpenApiBodySchema } from '@schemas/utils/createRequestOpenApiBodySchema';
import { createRequestQuerySchema } from '@schemas/utils/createRequestQuerySchema';
import { createRequestBodySchema } from '@schemas/utils/createRequestBodySchema';
import { getByIdParamsSchema } from '@schemas/utils/createRequestParamsSchema';

export const registry = new OpenAPIRegistry();
const router = express.Router();

registry.registerPath({
    method: 'get',
    path: '/v1/users/current',
    summary: 'Retrieve current user details.',
    tags: ['Users'],
    responses: createApiResponse(UserCurrentRespSchema, 'Success'),
});

router.get('/current',
    validateRequest(SkipValid, '/v1/users/current'),
    usersController.current as Midleware);

registry.registerPath({
    method: 'get',
    path: '/v1/users/',
    summary: 'List users with pagination, and optional filtering and sorting.',
    tags: ['Users'],
    request: { query: RequestPaginationSchema },
    responses: createPaginatedApiResponse(UserSchema, 'Success'),
});

registry.registerPath({
    method: 'post',
    path: '/v1/users/',
    summary: 'Create a new user.',
    tags: ['Users'],
    request: { body: createRequestOpenApiBodySchema(UserCreateReqSchema) },
    responses: createApiResponse(UserCreateRespSchema, 'Success'),
});

router
    .route('/')
    .get(
        ensureLoggedIn(),
        authorization('user') as Midleware,
        validateRequest(createRequestQuerySchema(RequestPaginationSchema), '/v1/users/'),
        usersController.get as Midleware
    )
    .post(
        ensureLoggedIn(),
        authorization('admin') as Midleware,
        validateRequest(createRequestBodySchema(UserCreateReqSchema), '/v1/users/'),
        usersController.create as Midleware
    );

registry.registerPath({
    method: 'get',
    path: '/v1/users/{userId}',
    summary: 'Retrieve user details by user ID.',
    tags: ['Users'],
    request: {params: getByIdParamsSchema('userId')},
    responses: createApiResponse(UserGetRespSchema, 'Success'),
});

registry.registerPath({
    method: 'patch',
    path: '/v1/users/{userId}',
    summary: 'Update user details by user ID.',
    tags: ['Users'],
    request: { params: getByIdParamsSchema('userId'), body: createRequestOpenApiBodySchema(UserSchema) },
    responses: createApiResponse(UserGetRespSchema, 'Success'),
});

registry.registerPath({
    method: 'delete',
    path: '/v1/users/{userId}',
    summary: 'Remove user by user ID.',
    tags: ['Users'],
    request: { params: getByIdParamsSchema('userId') },
    responses: createApiEmptyResponse('No Content', StatusCodes.NO_CONTENT),
});

router
    .route('/:userId')
    .get(
        ensureLoggedIn(),
        authorization('admin') as Midleware,
        validateRequest(getByIdParamsSchema('userId'), '/v1/users/{userId}'),
        usersController.getById as Midleware
    )
    .patch(
        ensureLoggedIn(),
        authorization('admin') as Midleware,
        validateRequest(getByIdParamsSchema('userId'), '/v1/users/{userId}'),
        usersController.update as Midleware
    )
    .delete(
        ensureLoggedIn(),
        authorization('admin') as Midleware,
        validateRequest(getByIdParamsSchema('userId'), '/v1/users/{userId}'),

        usersController.remove as Midleware
    );

export default router;
