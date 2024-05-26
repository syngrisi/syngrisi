const express = require('express');
const { testsController } = require('../../controllers');
const { ensureLoggedIn } = require('../../lib/ensureLogin');

const router = express.Router();

router
    .route('/:id')
    .get(
        ensureLoggedIn(),
        testsController.distinct
    );

module.exports = router;
