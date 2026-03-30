import { Router } from 'express';
import { ensureLoggedIn } from '@middlewares/ensureLogin/ensureLoggedIn';
import { authorization } from '@middlewares';
import * as adminDataController from '@controllers/admin-data.controller';

const router = Router();

router.use(ensureLoggedIn());
router.use(authorization('admin'));

router.get('/jobs', adminDataController.listJobs);
router.get('/jobs/:id', adminDataController.getJob);
router.get('/jobs/:id/log', adminDataController.getJobLog);
router.get('/jobs/:id/download', adminDataController.downloadJobArchive);
router.post('/jobs/:id/cancel', adminDataController.cancelJob);
router.delete('/jobs/:id', adminDataController.deleteJob);

router.post('/db/backup', adminDataController.createDbBackup);
router.post('/db/restore', adminDataController.createDbRestore);
router.post('/screenshots/backup', adminDataController.createScreenshotsBackup);
router.post('/screenshots/restore', adminDataController.createScreenshotsRestore);

export default router;
