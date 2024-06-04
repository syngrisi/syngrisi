import express from 'express';
import * as authController from '../../controllers/auth.controller';
import { Midleware } from '../../../types/Midleware';

const router = express.Router();

router.get('/logout', authController.logout as Midleware);
router.get('/apikey', authController.apikey as Midleware);
router.post('/login', authController.login as Midleware);
router.post('/change', authController.changePassword as Midleware);
router.post('/change_first_run', authController.changePasswordFirstRun as Midleware);

export default router;
