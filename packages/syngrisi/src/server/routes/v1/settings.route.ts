/* eslint-disable @typescript-eslint/no-explicit-any */

import express from 'express';
import { settingsController } from '../../controllers';
import { ensureLoggedIn } from '../../middlewares/ensureLogin';
import { authorization } from '../../middlewares';

const router = express.Router();

router
    .route('/')
    .get(
        ensureLoggedIn(),
        authorization('admin'),
        settingsController.getSettings
    );
router
    .route('/:name')
    .patch(
        ensureLoggedIn(),
        authorization('admin'),
        settingsController.updateSetting
    );

export default router;
