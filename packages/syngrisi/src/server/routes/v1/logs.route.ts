import express from 'express';
import { logsController } from '@controllers';
import { ensureLoggedIn } from '@middlewares/ensureLogin';
import { Midleware } from '../../../types/Midleware';

const router = express.Router();

router
    .route('/')
    .get(ensureLoggedIn(), logsController.getLogs as Midleware)
    .post(ensureLoggedIn(), logsController.createLog as Midleware);

router
    .route('/distinct')
    .get(ensureLoggedIn(), logsController.distinct as Midleware);

export default router;
