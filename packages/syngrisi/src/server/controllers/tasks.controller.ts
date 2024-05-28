/* eslint-disable @typescript-eslint/no-explicit-any */
import { catchAsync, pick } from '../utils';
import { tasksService } from '../services';

const task_test = catchAsync(async (req: any, res: any) => {
    const { options } = pick(req.query, ['options']);
    await tasksService.task_test(options, req, res);
});

const task_handle_old_checks = catchAsync(async (req: any, res: any) => {
    const options = pick(req.query, ['days', 'remove']);
    await tasksService.task_handle_old_checks(options, res);
});

const task_handle_database_consistency = catchAsync(async (req: any, res: any) => {
    const options = pick(req.query, ['days', 'clean']);
    await tasksService.task_handle_database_consistency(options, res);
});

const task_remove_old_logs = catchAsync(async (req: any, res: any) => {
    const options = pick(req.query, ['days', 'statistics']);
    await tasksService.task_remove_old_logs(options, res);
});

const status = catchAsync(async (req: any, res: any) => {
    res.send(await tasksService.status(req.user));
});

const screenshots = catchAsync(async (req: any, res: any) => {
    res.send(await tasksService.screenshots());
});

const loadTestUser = catchAsync(async (req: any, res: any) => {
    res.send(await tasksService.loadTestUser());
});

export {
    task_test,
    task_handle_old_checks,
    task_handle_database_consistency,
    task_remove_old_logs,
    status,
    loadTestUser,
    screenshots,
};
