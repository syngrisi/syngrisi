const express = require('express');
const { baselinesController } = require('../../controllers');
const { ensureLoggedIn } = require('../../middlewares/ensureLogin');

const router = express.Router();

router
    .route('/')
    .get(ensureLoggedIn(), baselinesController.get);

router.route('/:id')
    .put(ensureLoggedIn(), baselinesController.put);

module.exports = router;
