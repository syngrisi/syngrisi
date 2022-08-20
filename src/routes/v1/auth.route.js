const express = require('express');
const authController = require('../../controllers/auth.controller');

const router = express.Router();

router.get('/logout', authController.logout);
router.post('/login', authController.login);
router.post('/change', authController.changePassword);

module.exports = router;
