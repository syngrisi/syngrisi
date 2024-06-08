import express from 'express';
import { runsController } from '@controllers';
import { ensureLoggedIn } from '@middlewares/ensureLogin';
import { Midleware } from '../../../types/Midleware';

const router = express.Router();

router
    .route('/')
    .get(ensureLoggedIn(), runsController.get  as Midleware);

router
    .route('/:id')
    .delete(ensureLoggedIn(), runsController.remove  as Midleware);

export default router;
