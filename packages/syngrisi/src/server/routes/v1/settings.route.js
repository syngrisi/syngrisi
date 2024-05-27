const express = require('express');
const { settingsController } = require('../../controllers');
const { ensureLoggedIn } = require('../../middlewares/ensureLogin');
const { authorization } = require('../../middlewares');

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

module.exports = router;
