const express = require('express');
const authController = require('../../controllers/auth.controller');

const router = express.Router();

router.post('/login', authController.login);
// router.get('/login', authController.login);
// router.get('/app', appController.login);
// router.post('/logout', validate(authValidation.logout), authController.logout);
// router.post('/reset-password', validate(authValidation.resetPassword), authController.resetPassword);

module.exports = router;
