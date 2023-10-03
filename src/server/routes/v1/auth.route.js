const express = require('express');
const authController = require('../../controllers/auth.controller');

const router = express.Router();

router.get('/logout', authController.logout);
router.post('/login', authController.login);
router.post('/change', authController.changePassword);
router.post('/change_first_run', authController.changePasswordFirstRun);

module.exports = router;
