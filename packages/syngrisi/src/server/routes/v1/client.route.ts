/* eslint-disable @typescript-eslint/ban-ts-comment */
import express from 'express';
// @ts-ignore
import { clientController } from '../../controllers';
import { ensureApiKey } from '../../middlewares/ensureLogin';
import { Midleware } from '../../../types/Midleware';

const router = express.Router();

router
    .route('/startSession')
    .post(ensureApiKey(), clientController.startSession as Midleware);

router
    .route('/stopSession/:testid')
    .post(ensureApiKey(), clientController.endSession as Midleware);

router
    .route('/createCheck')
    .post(ensureApiKey(), clientController.createCheck as Midleware);

router
    .route('/getIdent')
    .get(ensureApiKey(), clientController.getIdent as Midleware);

router
    .route('/baselines')
    .get(ensureApiKey(), clientController.getBaselines as Midleware);

router
    .route('/snapshots')
    .get(ensureApiKey(), clientController.getSnapshots as Midleware);

export default router;
