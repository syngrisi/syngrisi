const express = require('express');
const { usersController } = require('../../controllers');

const router = express.Router();

router.get('/current', usersController.current);

module.exports = router;
