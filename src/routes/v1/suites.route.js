const express = require('express');
const { suiteController } = require('../../controllers');
const { ensureLoggedIn } = require('../../../lib/ensureLogin/ensureLoggedIn');

const router = express.Router();

router
    .route('/')
    .get(ensureLoggedIn(), suiteController.get);

module.exports = router;
