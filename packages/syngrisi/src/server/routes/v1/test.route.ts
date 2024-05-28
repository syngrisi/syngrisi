/* eslint-disable @typescript-eslint/no-explicit-any */

import express from 'express';
import { testController } from '../../controllers';
import { ensureLoggedIn } from '../../middlewares/ensureLogin';

const router = express.Router();

router.route('/')
    .get(ensureLoggedIn(), testController.getTest);

router.route('/distinct')
    .get(ensureLoggedIn(), testController.distinct);
router
    .route('/:id')
    .delete(ensureLoggedIn(), testController.remove);

router
    .route('/accept/:id')
    .put(ensureLoggedIn(), testController.accept);

export default router;
