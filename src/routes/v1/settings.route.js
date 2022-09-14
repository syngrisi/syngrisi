const express = require('express');
const { settingsController } = require('../../controllers');
const { ensureLoggedIn } = require('../../../lib/ensureLogin/ensureLoggedIn');

const router = express.Router();

router
    .route('/')
    .get(ensureLoggedIn(), settingsController.getSettings);
router
    .route('/:name')
    .patch(ensureLoggedIn(), settingsController.updateSetting);

// router
//     .route('/distinct')
//     .get(ensureLoggedIn(), logsController.distinct);

module.exports = router;
