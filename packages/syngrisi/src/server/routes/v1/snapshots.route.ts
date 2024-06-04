import express from 'express';
import { snapshotsController } from '../../controllers';
import { ensureLoggedIn } from '../../middlewares/ensureLogin';
import { Midleware } from '../../../types/Midleware';

const router = express.Router();

router
    .route('/')
    .get(ensureLoggedIn(), snapshotsController.get  as Midleware);

export default router;
