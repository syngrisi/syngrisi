/* eslint-disable @typescript-eslint/no-explicit-any */

import express from 'express';
import { ensureLoggedIn } from '../../middlewares/ensureLogin';
import { authorization } from '../../middlewares';
import { tasksController } from '../../controllers';

const router = express.Router();

router
    .route('/task_test')
    .get(
        ensureLoggedIn(),
        authorization('admin'),
        tasksController.task_test
    );

router
    .route('/task_handle_old_checks')
    .get(
        ensureLoggedIn(),
        authorization('admin'),
        tasksController.task_handle_old_checks
    );

router
    .route('/task_handle_database_consistency')
    .get(
        ensureLoggedIn(),
        authorization('admin'),
        tasksController.task_handle_database_consistency
    );

router
    .route('/task_remove_old_logs')
    .get(
        ensureLoggedIn(),
        authorization('admin'),
        tasksController.task_remove_old_logs
    );

router
    .route('/loadTestUser')
    .get(
        ensureLoggedIn(),
        tasksController.loadTestUser
    );

router
    .route('/status')
    .get(
        tasksController.status
    );

router
    .route('/screenshots')
    .get(
        tasksController.screenshots
    );

export default router;
