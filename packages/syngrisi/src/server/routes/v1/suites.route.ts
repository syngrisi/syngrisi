/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import { suiteController } from '../../controllers';
import { ensureLoggedIn } from '../../middlewares/ensureLogin';
import { Midleware } from '../../../types/Midleware';

const router = express.Router();

router
    .route('/')
    .get(ensureLoggedIn(), suiteController.get  as Midleware);

router
    .route('/:id')
    .delete(ensureLoggedIn(), suiteController.remove  as Midleware);

export default router;
