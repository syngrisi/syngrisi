const express = require('express');
const { userController } = require('../../controllers');
const { ensureLoggedIn } = require('../../lib/ensureLogin');
const { authorization } = require('../../middlewares/authorization');

const router = express.Router();

router.get('/current', userController.current);

router
    .route('/')
    .post(
        ensureLoggedIn(),
        authorization('admin'),
        userController.createUser
    )
    .get(
        ensureLoggedIn(),
        authorization('user'),
        userController.getUsers
    );

router
    .route('/:userId')
    .patch(
        ensureLoggedIn(),
        authorization('admin'),
        userController.updateUser
    )
    .delete(
        ensureLoggedIn(),
        authorization('admin'),
        userController.deleteUser
    );

module.exports = router;
