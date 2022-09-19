const express = require('express');
const { settingsController } = require('../../controllers');
const { ensureLoggedIn } = require('../../../lib/ensureLogin/ensureLoggedIn');
const { authorization } = require('../../middlewares/authorization');

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

// router
//     .route('/distinct')
//     .get(ensureLoggedIn(), logsController.distinct);

module.exports = router;
