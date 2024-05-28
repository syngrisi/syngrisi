/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import { testController } from '../../controllers';
import { ensureLoggedIn } from '../../middlewares/ensureLogin';

const router = express.Router();

router
    .route('/:id')
    .get(
        ensureLoggedIn(),
        testController.distinct
    );

export default router;
