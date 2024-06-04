import express from 'express';
import { settingsController } from '../../controllers';
import { ensureLoggedIn } from '../../middlewares/ensureLogin';
import { authorization } from '../../middlewares';
import { Midleware } from '../../../types/Midleware';

const router = express.Router();

router
    .route('/')
    .get(
        ensureLoggedIn(),
        authorization('admin') as Midleware,
        settingsController.getSettings as Midleware
    );
router
    .route('/:name')
    .patch(
        ensureLoggedIn(),
        authorization('admin') as Midleware,
        settingsController.updateSetting as Midleware
    );

export default router;
