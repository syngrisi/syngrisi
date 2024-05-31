/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import express from 'express';
// @ts-ignore
// import Bottleneck from 'bottleneck';
import { clientController } from '../../controllers';
import { ensureApiKey } from '../../middlewares/ensureLogin';
import { Midleware } from '../../../types/Midleware';

const router = express.Router();

// const limiter:object = (global as any ).limiter ;

// if (limiter) {
//     limiter = {};
//   }


// const startSessionLimiter = new Bottleneck({
//     maxConcurrent: 1,
// });

// router
//     .route('/startSession')
//     .post(ensureApiKey(),
//         async (req, res, next) => startSessionLimiter.schedule(
//             async () => clientController.startSession(req, res, next)
//         ));

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
