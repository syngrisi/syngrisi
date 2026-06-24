import express from 'express';
import { aiController } from '@controllers/ai.controller';
import { ensureLoggedInOrApiKey } from '@middlewares/ensureLogin/ensureLoggedIn';

import { Midleware } from '@types';

const router = express.Router();

router.use(ensureLoggedInOrApiKey());

router.get('/', aiController.getIndex as Midleware);
router.get('/checks', aiController.getChecks as Midleware);
router.get('/checks/:id', aiController.getCheckDetails as Midleware);
router.get('/analysis/:id', aiController.getAnalysis as Midleware);
router.post('/batch', aiController.batchUpdate as Midleware);
router.post('/webhooks', aiController.registerWebhook as Midleware);
router.post('/triage/test', aiController.triageTest as Midleware);
// queue routes must precede '/triage/:id/...' so "queue" is not captured as an :id
router.get('/triage/queue', aiController.triageQueue as Midleware);
router.post('/triage/queue/cancel', aiController.triageQueueCancel as Midleware);
router.post('/triage/queue/restart', aiController.triageQueueRestart as Midleware);
router.post('/triage/:id/run', aiController.triageRun as Midleware);
router.post('/triage/:id/cancel', aiController.triageCancel as Midleware);

export default router;
