/* eslint-disable @typescript-eslint/no-explicit-any */

import express from 'express';
import { checkController } from '../../controllers';
import { ensureLoggedIn } from '../../middlewares/ensureLogin';

const router = express.Router();

router
    .route('/')
    .get(ensureLoggedIn(), checkController.get);

router
    .route('/:id')
    .delete(ensureLoggedIn(), checkController.remove);

// update
router.route('/:id')
    .put(ensureLoggedIn(), checkController.update);

router.route('/accept/:id')
    .put(ensureLoggedIn(), checkController.accept);

router.route('/get_via_post')
    .post(ensureLoggedIn(), checkController.getViaPost);

export default router;
