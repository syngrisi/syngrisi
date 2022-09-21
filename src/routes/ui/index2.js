const express = require('express');
const path = require('path');
const httpStatus = require('http-status');

const catchAsync = require('../../utils/catchAsync');
const { ensureLoggedIn } = require('../../../lib/ensureLogin/ensureLoggedIn');

const router = express.Router();

router.get(
    '*',
    ensureLoggedIn(),
    catchAsync(async (req, res) => {
        res.status(httpStatus.OK)
            .sendFile(path.normalize(path.join(`${__dirname}./../../../mvc/views/react/index2/index.html`)));
    })
);

module.exports = router;
