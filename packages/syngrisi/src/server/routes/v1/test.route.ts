import express from 'express';
import { testController } from '../../controllers';
import { ensureLoggedIn } from '../../middlewares/ensureLogin';
import { Midleware } from '../../../types/Midleware';

const router = express.Router();

router.route('/')
    .get(ensureLoggedIn(), testController.getTest as Midleware);

router.route('/distinct')
    .get(ensureLoggedIn(), testController.distinct as Midleware);
router
    .route('/:id')
    .delete(ensureLoggedIn(), testController.remove as Midleware);

router
    .route('/accept/:id')
    .put(ensureLoggedIn(), testController.accept as Midleware);

export default router;
