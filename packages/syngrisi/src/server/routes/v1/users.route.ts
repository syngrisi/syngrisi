import express from 'express';
import { usersController } from '../../controllers';
import { ensureLoggedIn } from '../../middlewares/ensureLogin';
import { authorization } from '../../middlewares';
import { Midleware } from '../../../types/Midleware';

const router = express.Router();

router.get('/current', usersController.current as Midleware);

router
    .route('/')
    .post(
        ensureLoggedIn(),
        authorization('admin') as Midleware,
        usersController.createUser as Midleware
    )
    .get(
        ensureLoggedIn(),
        authorization('user') as Midleware,
        usersController.getUsers as Midleware
    );

router
    .route('/:userId')
    .patch(
        ensureLoggedIn(),
        authorization('admin') as Midleware,
        usersController.updateUser as Midleware
    )
    .delete(
        ensureLoggedIn(),
        authorization('admin') as Midleware,
        usersController.deleteUser as Midleware
    );

export default router;
