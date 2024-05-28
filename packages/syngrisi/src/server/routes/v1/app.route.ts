/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from 'express';
import * as appController from '../../controllers/app.controller';

const router = Router();

router.get('/info', appController.info);
router.get('/', appController.get);

export default router;
