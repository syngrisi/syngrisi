const express = require('express');
const { runsController } = require('../../controllers');
const { ensureLoggedIn } = require('../../lib/ensureLogin/ensureLoggedIn');

const router = express.Router();

router
    .route('/')
    .get(ensureLoggedIn(), runsController.get);

router
    .route('/:id')
    .delete(ensureLoggedIn(), runsController.remove);

module.exports = router;
