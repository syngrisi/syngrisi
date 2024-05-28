/* eslint-disable @typescript-eslint/no-explicit-any */

import express from 'express';
import { snapshotsController } from '../../controllers';
import { ensureLoggedIn } from '../../middlewares/ensureLogin';

const router = express.Router();

router
    .route('/')
    .get(ensureLoggedIn(), snapshotsController.get);

export default router;
