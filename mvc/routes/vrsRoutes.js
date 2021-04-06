'use strict';
const {default: PQueue} = require('p-queue');
const queue = new PQueue({concurrency: 1});

module.exports = async function (app) {
    const UI = require('../controllers/ui/ui_controller');
    const API = require('../controllers/api/api_controller');

    await app
        .delete('/checks/:id', async (req, res, next) => {
            API.removeCheck(req, res).catch(next);
        })
        .put('/checks/:id', async (req, res, next) => {
            API.updateCheck(req, res);
        })
        .put('/snapshots/:id', async (req, res, next) => {
            API.updateSnapshot(req, res).catch(next);
        })
        .get('/', async function (req, res, next) {
            UI.index(req, res).catch(next).catch(next);
        })
        .get('/runs', async function (req, res, next) {
            UI.runs(req, res).catch(next).catch(next);
        })
        .get('/affectedelements', async function (req, res, next) {
            API.affectedElements(req, res).catch(next).catch(next);
        })
        .get('/checkview', async function (req, res, next) {
            UI.checkView(req, res).catch(next);
        })
        .get('/checksgroupview', async function (req, res, next) {
            UI.checksGroupView(req, res).catch(next);
        })
        .get('/snapshootview', async function (req, res, next) {
            UI.snapshotView(req, res).catch(next);
        })
        .get('/diffview', async function (req, res, next) {
            UI.diffView(req, res).catch(next);
        })
        .get('/admin', async function (req, res, next) {
            UI.admin(req, res).catch(next);
        })
        .get('/users', async function (req, res, next) {
            API.getUsers(req, res).catch(next);
        })
        .post('/checks', async (req, res, next) => {
            req.log.trace(`post '/checks' queue pending count: `, queue.pending);
            await queue.add(() => API.createCheck(req, res).catch(next));
        })
        .post('/users', async (req, res, next) => {
            req.log.trace(`post '/users' queue pending count: `, queue.pending);
            await queue.add(() => API.createUser(req, res).catch(next));
        })
        .put('/users', async (req, res, next) => {
            req.log.trace(`put '/users' queue pending count: `, queue.pending);
            await queue.add(() => API.updateUser(req, res).catch(next));
        })
        .post('/tests', async (req, res, next) => {
            req.log.trace(`post '/tests' queue pending count: `, queue.pending);
            await queue.add(() => API.createTest(req, res).catch(next));
        })
        .delete('/tests/:id', async (req, res, next) => {
            API.removeTest(req, res).catch(next);
        })
        .delete('/users/:id', async (req, res, next) => {
            API.removeUser(req, res).catch(next);
        })
        .delete('/suites/:id', async (req, res, next) => {
            API.removeSuite(req, res).catch(next);
        })
        .put('/tests/:id', async (req, res, next) => {
            API.updateTest(req, res).catch(next);
        })
        .post('/session/:testid', async (req, res, next) => {
            API.stopSession(req, res).catch(next);
        })
        .get('/checks', async (req, res, next) => {
            req.log.trace(`get '/checks' queue pending count: `, queue.pending);
            await queue.add(() => API.getChecks(req, res).catch(next));
        })
        .get('/removeEmptyTests', async (req, res, next) => {
            req.log.trace(`get '/removeEmptyTests' queue pending count: `, queue.pending);
            await queue.add(() => API.removeEmptyTests(req, res).catch(next));
        })
        .get('/snapshot/:id', async (req, res, next) => {
            API.getSnapshot(req, res).catch(next);
        })
        .get('/checks/byident/:testid', async (req, res, next) => {
            API.checksGroupByIdent(req, res).catch(next);
        })
        .get('/check/:id', async (req, res, next) => {
            API.getCheck(req, res).catch(next);
        });
};
