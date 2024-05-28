/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
// import { baselinesController } from '../../controllers';
import { baselineController } from '../../controllers';

import { ensureLoggedIn } from '../../middlewares/ensureLogin';

const router = express.Router();

router
    .route('/')
    .get(ensureLoggedIn(), baselineController.get);

router.route('/:id')
    .put(ensureLoggedIn(), baselineController.put);
baselineController
export default router;
