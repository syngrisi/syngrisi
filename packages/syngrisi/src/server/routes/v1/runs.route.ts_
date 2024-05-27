/* eslint-disable @typescript-eslint/no-explicit-any */

import express from 'express';
import { runsController } from '../../controllers';
import { ensureLoggedIn } from '../../middlewares/ensureLogin';

const router = express.Router();

router
    .route('/')
    .get(ensureLoggedIn(), runsController.get);

router
    .route('/:id')
    .delete(ensureLoggedIn(), runsController.remove);

export default router;
