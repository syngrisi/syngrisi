const express = require('express');
const { userController } = require('../../controllers');
const { ensureLoggedIn } = require('../../../lib/ensureLogin/ensureLoggedIn');

const router = express.Router();

router.get('/current', userController.current);
// router.get('/current', ensureLoggedIn(), userController.current);

router
    .route('/')
    .post(ensureLoggedIn(), userController.createUser)
    .get(ensureLoggedIn(), userController.getUsers);

router
    .route('/:userId')
    .patch(ensureLoggedIn(), userController.updateUser)
    .delete(ensureLoggedIn(), userController.deleteUser);

module.exports = router;
