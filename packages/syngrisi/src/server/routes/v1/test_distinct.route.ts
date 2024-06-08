import express from 'express';
import { testController } from '@controllers';
import { ensureLoggedIn } from '@middlewares/ensureLogin';
import { Midleware } from '../../../types/Midleware';

const router = express.Router();

router
    .route('/:id')
    .get(
        ensureLoggedIn(),
        testController.distinct as Midleware
    );

export default router;
