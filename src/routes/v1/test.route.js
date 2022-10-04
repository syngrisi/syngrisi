const express = require('express');
const testController = require('../../controllers/test.controller');
const { ensureLoggedIn } = require('../../../lib/ensureLogin/ensureLoggedIn');

const router = express.Router();

router.route('/')
    .get(ensureLoggedIn(), testController.getTest);

router.route('/distinct')
    .get(ensureLoggedIn(), testController.distinct);

module.exports = router;
