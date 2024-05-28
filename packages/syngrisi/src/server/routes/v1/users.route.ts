/* eslint-disable @typescript-eslint/no-explicit-any */

import express from 'express';
import { usersController } from '../../controllers';
import { ensureLoggedIn } from '../../middlewares/ensureLogin';
import { authorization } from '../../middlewares';

const router = express.Router();

router.get('/current', usersController.current);

router
    .route('/')
    .post(
        ensureLoggedIn(),
        authorization('admin'),
        usersController.createUser
    )
    .get(
        ensureLoggedIn(),
        authorization('user'),
        usersController.getUsers
    );

router
    .route('/:userId')
    .patch(
        ensureLoggedIn(),
        authorization('admin'),
        usersController.updateUser
    )
    .delete(
        ensureLoggedIn(),
        authorization('admin'),
        usersController.deleteUser
    );

export default router;
