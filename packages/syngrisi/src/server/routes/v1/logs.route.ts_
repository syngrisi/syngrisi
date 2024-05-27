/* eslint-disable @typescript-eslint/no-explicit-any */
import express from 'express';
import { logsController } from '../../controllers';
import { ensureLoggedIn } from '../../middlewares/ensureLogin';

const router = express.Router();

router
    .route('/')
    .get(ensureLoggedIn(), logsController.getLogs)
    .post(ensureLoggedIn(), logsController.createLog);

router
    .route('/distinct')
    .get(ensureLoggedIn(), logsController.distinct);

export default router;
