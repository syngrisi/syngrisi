const express = require('express');
const Bottleneck = require('bottleneck/es5');
const { clientController } = require('../../controllers');
const { ensureApiKey } = require('../../middlewares/ensureLogin');

const router = express.Router();

global.limiter.startSession = new Bottleneck({
    maxConcurrent: 1,
});

router
    .route('/startSession')
    .post(ensureApiKey(),
        async (req, res, next) => global.limiter.startSession.schedule(
            () => clientController.startSession(req, res, next)
        ));

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

module.exports = router;
