/* eslint-disable camelcase */
// const httpStatus = require('http-status');
const { catchAsync } = require('../utils');
const { pick } = require('../utils');
const { tasksService } = require('../services');

const task_test = catchAsync(async (req, res) => {
    const { options } = pick(req.query, ['options']);
    await tasksService.task_test(options, req, res);
});

const task_handle_old_checks = catchAsync(async (req, res) => {
    const options = pick(req.query, ['days', 'remove']);
    await tasksService.task_handle_old_checks(options, res);
});

const task_handle_database_consistency = catchAsync(async (req, res) => {
    const options = pick(req.query, ['days', 'clean']);
    await tasksService.task_handle_database_consistency(options, res);
});

const task_remove_old_logs = catchAsync(async (req, res) => {
    const options = pick(req.query, ['days', 'statistics']);
    await tasksService.task_remove_old_logs(options, res);
});

const status = catchAsync(async (req, res) => {
    res.send(await tasksService.status(req.user));
});

const screenshots = catchAsync(async (req, res) => {
    res.send(await tasksService.screenshots(req.user));
});

const loadTestUser = catchAsync(async (req, res) => {
    res.send(await tasksService.loadTestUser(req.user));
});

module.exports = {
    task_test,
    task_handle_old_checks,
    task_handle_database_consistency,
    task_remove_old_logs,
    status,
    loadTestUser,
    screenshots,
};
