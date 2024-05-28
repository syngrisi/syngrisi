/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import express from 'express';
// @ts-ignore
import Bottleneck from 'bottleneck';
import { clientController } from '../../controllers';
import { ensureApiKey } from '../../middlewares/ensureLogin';

const router = express.Router();

// const limiter:object = (global as any ).limiter ;

// if (limiter) {
//     limiter = {};
//   }


const startSessionLimiter = new Bottleneck({
    maxConcurrent: 1,
});

router
    .route('/startSession')
    .post(ensureApiKey(),
        async (req, res, next) => startSessionLimiter.schedule(
            async () => clientController.startSession(req, res, next)
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

export default router;
