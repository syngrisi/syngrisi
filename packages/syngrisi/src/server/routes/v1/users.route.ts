import express from 'express';
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { usersController } from '@controllers';
import { ensureLoggedIn } from '@middlewares/ensureLogin';
import { authorization } from '@middlewares';
import { Midleware } from '../../../types/Midleware';
import { validateRequest } from '../../utils/validateRequest';
import { GetUserSchema, UserCreateReqSchema, UserCreateRespSchema, UserCurrentRespSchema, UserGetRespSchema, UserSchema, getBodySchema } from '../../schemas/user.schema';
import { createApiEmptyResponse, createApiResponse, createMultipleApiResponse } from '../../api-docs/openAPIResponseBuilders';
import StatusCodes from 'http-status';
import { SkipValid } from '../../schemas/SkipValid.schema';

export const userRegistry = new OpenAPIRegistry();

const router = express.Router();

userRegistry.registerPath({
    method: 'get',
    path: '/v1/users/current',
    tags: ['User'],
    // request: { params: GetUserSchema.shape.params },
    responses: createApiResponse(UserCurrentRespSchema, 'Success'),
});

router.get('/current',
    validateRequest(SkipValid),
    usersController.current as Midleware);

userRegistry.registerPath({
    method: 'get',
    path: '/v1/users/',
    tags: ['User'],
    responses: createMultipleApiResponse(UserSchema, 'Success'),
});

userRegistry.registerPath({
    method: 'post',
    path: '/v1/users/',
    tags: ['User'],
    request: { body: getBodySchema(UserCreateReqSchema) },
    responses: createApiResponse(UserCreateRespSchema, 'Success'),
});


router
    .route('/')
    .post(
        ensureLoggedIn(),
        authorization('admin') as Midleware,
        validateRequest(UserCreateReqSchema),
        usersController.create as Midleware
    )
    .get(
        ensureLoggedIn(),
        authorization('user') as Midleware,
        validateRequest(SkipValid),
        usersController.get as Midleware
    );


userRegistry.registerPath({
    method: 'get',
    path: '/v1/users/{userId}',
    tags: ['User'],
    request: { params: GetUserSchema.shape.params },
    responses: createApiResponse(UserGetRespSchema, 'Success'),
});

userRegistry.registerPath({
    method: 'patch',
    path: '/v1/users/{userId}',
    tags: ['User'],
    request: { params: GetUserSchema.shape.params, body: getBodySchema(UserSchema) },
    responses: createApiResponse(UserGetRespSchema, 'Success'),
});

userRegistry.registerPath({
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
