import express from 'express';
import StatusCodes from 'http-status';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { Midleware } from '@types';
import { usersController } from '@controllers';
import { ensureLoggedIn } from '@middlewares/ensureLogin';
import { authorization } from '@middlewares';
import { validateRequest } from '@utils/validateRequest';
import { GetUserSchema, UserCreateReqSchema, UserCreateRespSchema, UserCurrentRespSchema, UserGetRespSchema, UserSchema } from '@root/src/server/schemas/User.schema';
import { SkipValid } from '@schemas/SkipValid.schema';
import { createApiEmptyResponse, createApiResponse, createMultipleApiResponse } from '@api-docs/openAPIResponseBuilders';
import { ReqGetMultipleSchema, } from '@schemas/common/ReqGetMultiple.schema';
import { getReqBodySchema } from '@schemas/common/getReqBodySchema';
import { getReqQueryMultipleSchema } from '@schemas/common/getReqQuerySchema';
import { getOAPIBodySchema } from '@schemas/common/getOAPIBodySchema';

export const registry = new OpenAPIRegistry();
const router = express.Router();

registry.registerPath({
    method: 'get',
    path: '/v1/users/current',
    tags: ['User'],
    // request: { params: GetUserSchema.shape.params },
    responses: createApiResponse(UserCurrentRespSchema, 'Success'),
});

router.get('/current',
    validateRequest(SkipValid),
    usersController.current as Midleware);

registry.registerPath({
    method: 'get',
    path: '/v1/users/',
    tags: ['User'],
    request: { query: ReqGetMultipleSchema },
    responses: createMultipleApiResponse(UserSchema, 'Success'),
});

registry.registerPath({
    method: 'post',
    path: '/v1/users/',
    tags: ['User'],
    request: { body: getOAPIBodySchema(UserCreateReqSchema) },
    responses: createApiResponse(UserCreateRespSchema, 'Success'),
});

router
    .route('/')
    .get(
        ensureLoggedIn(),
        authorization('user') as Midleware,
        validateRequest(getReqQueryMultipleSchema(ReqGetMultipleSchema)),
        usersController.get as Midleware
    )
    .post(
        ensureLoggedIn(),
        authorization('admin') as Midleware,
        validateRequest(getReqBodySchema(UserCreateReqSchema)),
        usersController.create as Midleware
    );

registry.registerPath({
    method: 'get',
    path: '/v1/users/{userId}',
    tags: ['User'],
    request: { params: GetUserSchema.shape.params },
    responses: createApiResponse(UserGetRespSchema, 'Success'),
});

registry.registerPath({
    method: 'patch',
    path: '/v1/users/{userId}',
    tags: ['User'],
    request: { params: GetUserSchema.shape.params, body: getOAPIBodySchema(UserSchema) },
    responses: createApiResponse(UserGetRespSchema, 'Success'),
});

registry.registerPath({
    method: 'delete',
    path: '/v1/users/{userId}',
    tags: ['User'],
    request: { params: GetUserSchema.shape.params },
    responses: createApiEmptyResponse('No Content', StatusCodes.NO_CONTENT),
});

router
    .route('/:userId')
    .get(
        ensureLoggedIn(),
        authorization('admin') as Midleware,
        validateRequest(GetUserSchema),
        usersController.getById as Midleware
    )
    .patch(
        ensureLoggedIn(),
        authorization('admin') as Midleware,
        validateRequest(GetUserSchema),
        usersController.update as Midleware
    )
    .delete(
        ensureLoggedIn(),
        authorization('admin') as Midleware,
        validateRequest(GetUserSchema),

        usersController.remove as Midleware
    );

export default router;
