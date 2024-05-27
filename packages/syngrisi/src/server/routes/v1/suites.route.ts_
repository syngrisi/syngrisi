/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import { suiteController } from '../../controllers';
import { ensureLoggedIn } from '../../middlewares/ensureLogin';

const router = express.Router();

router
    .route('/')
    .get(ensureLoggedIn(), suiteController.get);

router
    .route('/:id')
    .delete(ensureLoggedIn(), suiteController.remove);

export default router;
