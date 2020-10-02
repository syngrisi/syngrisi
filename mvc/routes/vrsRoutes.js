'use strict';
const {default: PQueue} = require('p-queue');
const queue = new PQueue({concurrency: 1});

module.exports = async function (app) {
    const UI = require('../controllers/ui/ui');
    const API = require('../controllers/api/api');

    await app
        .delete('/checks/:id', async (req, res, next) => {
            API.remove_check(req, res).catch(next);
        })
        .put('/checks/:id', async (req, res, next) => {
            API.update_check(req, res);
        })
        .put('/snapshots/:id', async (req, res, next) => {
            API.update_snapshot(req, res).catch(next);
        })
        .get('/', async function (req, res, next) {
            UI.index(req, res).catch(next).catch(next);
        })
        .get('/runs', async function (req, res, next) {
            UI.runs(req, res).catch(next).catch(next);
        })
        .get('/affectedelements', async function (req, res, next) {
            API.affectedelements(req, res).catch(next).catch(next);
        })
        .get('/checkview', async function (req, res, next) {
            UI.checkview(req, res).catch(next);
        })
        .get('/checksgroupview', async function (req, res, next) {
            UI.checksgroupview(req, res).catch(next);
        })
        .get('/snapshootview', async function (req, res, next) {
            UI.snapshootview(req, res).catch(next);
        })
        .get('/diffview', async function (req, res, next) {
            UI.diffview(req, res).catch(next);
        })
        .post('/checks', async (req, res, next) => {
            req.log.trace(`post '/checks' queue pending count: `, queue.pending);
            await queue.add(() => API.create_check(req, res).catch(next));
        })
        .post('/tests', async (req, res, next) => {
            req.log.trace(`post '/tests' queue pending count: `, queue.pending);
            await queue.add(() => API.create_test(req, res).catch(next));
        })
        .delete('/tests/:id', async (req, res, next) => {
            API.remove_test(req, res).catch(next);
        })
        .delete('/suites/:id', async (req, res, next) => {
            API.remove_suite(req, res).catch(next);
        })
        .put('/tests/:id', async (req, res, next) => {
            API.update_test(req, res).catch(next);
        })
        .post('/session/:testid', async (req, res, next) => {
            API.stop_session(req, res).catch(next);
        })
        .get('/checks', async (req, res, next) => {
            req.log.trace(`get '/checks' queue pending count: `, queue.pending);
            await queue.add(() => API.list_all_checks(req, res).catch(next));
        })
        .get('/snapshot/:id', async (req, res, next) => {
            API.get_snapshot(req, res).catch(next);
        })
        .get('/checks/byident/:testid', async (req, res, next) => {
            API.checks_group_by_ident(req, res).catch(next);
        })
        .get('/check/:id', async (req, res, next) => {
            API.get_check(req, res).catch(next);
        });
};
