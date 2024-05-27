const express = require('express');
const { logsController } = require('../../controllers');
const { ensureLoggedIn } = require('../../middlewares/ensureLogin');

const router = express.Router();

router
    .route('/')
    .get(ensureLoggedIn(), logsController.getLogs)
    .post(ensureLoggedIn(), logsController.createLog);

router
    .route('/distinct')
    .get(ensureLoggedIn(), logsController.distinct);

module.exports = router;
