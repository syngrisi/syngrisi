/* eslint-disable @typescript-eslint/no-explicit-any */

import express from 'express';
import * as authController from '../../controllers/auth.controller';

const router = express.Router();

router.get('/logout', authController.logout);
router.get('/apikey', authController.apikey);
router.post('/login', authController.login);
router.post('/change', authController.changePassword);
router.post('/change_first_run', authController.changePasswordFirstRun);

export default router;
