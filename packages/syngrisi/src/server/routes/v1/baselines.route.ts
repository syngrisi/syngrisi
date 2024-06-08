import express from 'express';
import { baselineController } from '@controllers';

import { ensureLoggedIn } from '@middlewares/ensureLogin';
import { Midleware } from '../../../types/Midleware';

const router = express.Router();

router
    .route('/')
    .get(ensureLoggedIn(), baselineController.get as Midleware);

router.route('/:id')
    .put(ensureLoggedIn(), baselineController.put as  Midleware);
baselineController
export default router;
