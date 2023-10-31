const express = require('express');

const { clientController } = require('../../controllers');
const { ensureApiKey } = require('../../lib/ensureLogin/ensureLoggedIn');

const router = express.Router();

router
    .route('/startSession')
    .post(ensureApiKey(),
        async (req, res, next) => {
            await global.queue.add(
                () => clientController.startSession(req, res, next)
            );
        });

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
    .route('/baselines')
    .get(ensureApiKey(), clientController.getBaselines);

router
    .route('/snapshots')
    .get(ensureApiKey(), clientController.getSnapshots);

// router
//     .route('/checkIfScreenshotHasBaselines')
//     .get(ensureApiKey(), clientController.checkIfScreenshotHasBaselines);

module.exports = router;
