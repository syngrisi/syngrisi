const express = require('express');
const { clientController } = require('../../controllers');
const { ensureApiKey } = require('../../lib/ensureLogin/ensureLoggedIn');

const router = express.Router();

router
    .route('/startSession')
    .post(ensureApiKey(), clientController.startSession);

router
    .route('/stopSession/:testid')
    .post(ensureApiKey(), clientController.endSession);

router
    .route('/createCheck')
    .post(ensureApiKey(), clientController.createCheck);

router
    .route('/getIdent')
    .get(ensureApiKey(), clientController.getIdent);

router
    .route('/checkIfScreenshotHasBaselines')
    .get(ensureApiKey(), clientController.checkIfScreenshotHasBaselines);

module.exports = router;
