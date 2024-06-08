import express from 'express';
import { checkController } from '@controllers';

import { ensureLoggedIn } from '@middlewares/ensureLogin';
import { Midleware } from '../../../types/Midleware';

const router = express.Router();

router
    .route('/')
    .get(ensureLoggedIn(), checkController.get as Midleware);

router
    .route('/:id')
    .delete(ensureLoggedIn(), checkController.remove as Midleware);

// update
router.route('/:id')
    .put(ensureLoggedIn(), checkController.update as Midleware);

router.route('/accept/:id')
    .put(ensureLoggedIn(), checkController.accept as Midleware);

router.route('/get_via_post')
    .post(ensureLoggedIn(), checkController.getViaPost as Midleware);

export default router;
