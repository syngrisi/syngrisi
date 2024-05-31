/* eslint-disable @typescript-eslint/no-explicit-any */

import express from 'express';
import { ensureLoggedIn } from '../../middlewares/ensureLogin';
import { authorization } from '../../middlewares';
import { tasksController } from '../../controllers';
import { Midleware } from '../../../types/Midleware';

const router = express.Router();

router
    .route('/task_test')
    .get(
        ensureLoggedIn(),
        authorization('admin') as Midleware,
        tasksController.task_test as Midleware
    );

router
    .route('/task_handle_old_checks')
    .get(
        ensureLoggedIn(),
        authorization('admin') as Midleware,
        tasksController.task_handle_old_checks as Midleware
    );

router
    .route('/task_handle_database_consistency')
    .get(
        ensureLoggedIn(),
        authorization('admin') as Midleware,
        tasksController.task_handle_database_consistency as Midleware
    );

router
    .route('/task_remove_old_logs')
    .get(
        ensureLoggedIn(),
        authorization('admin') as Midleware,
        tasksController.task_remove_old_logs as Midleware
    );

router
    .route('/loadTestUser')
    .get(
        ensureLoggedIn() as Midleware,
        tasksController.loadTestUser as Midleware
    );

router
    .route('/status')
    .get(
        tasksController.status as Midleware
    );

router
    .route('/screenshots')
    .get(
        tasksController.screenshots as Midleware
    );

export default router;
