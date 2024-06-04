import { Router } from 'express';
import * as appController from '../../controllers/app.controller';
import { Midleware } from '../../../types/Midleware';

const router = Router();

router.get('/info', appController.info as Midleware);
router.get('/', appController.get as Midleware);

export default router;
