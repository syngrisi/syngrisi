'use strict';
const {default: PQueue} = require('p-queue');
const queue = new PQueue({concurrency: 1});

module.exports = async function (app) {
    const VRS = require('../controllers/vrsController');

    await app
        .delete('/checks/:id', async (req, res, next) => {
            VRS.remove_check(req, res).catch(next);
        })
        .put('/checks/:id', async (req, res, next) => {
            VRS.update_check(req, res);
        })
        .put('/snapshots/:id', async (req, res, next) => {
            VRS.update_snapshot(req, res).catch(next);
        })
        .get('/', async function (req, res, next) {
            VRS.index(req, res).catch(next).catch(next);
        })
        .get('/affectedelements', async function (req, res, next) {
            VRS.affectedelements(req, res).catch(next).catch(next);
        })
        .get('/checkview', async function (req, res, next) {
            VRS.checkview(req, res).catch(next);
        })
        .get('/checksgroupview', async function (req, res, next) {
            VRS.checksgroupview(req, res).catch(next);
        })
        .get('/snapshootview', async function (req, res, next) {
            VRS.snapshootview(req, res).catch(next);
        })
        .get('/diffview', async function (req, res, next) {
            VRS.diffview(req, res).catch(next);
        })
        .post('/checks', async (req, res, next) => {
            req.log.trace(`post '/checks' queue pending count: `, queue.pending);
            await queue.add(() => VRS.create_check(req, res).catch(next));
        })
        .post('/tests', async (req, res, next) => {
            req.log.trace(`post '/tests' queue pending count: `, queue.pending);
            await queue.add(() => VRS.create_test(req, res).catch(next));
        })
        .delete('/tests/:id', async (req, res, next) => {
            VRS.remove_test(req, res).catch(next);
        })
        .put('/tests/:id', async (req, res, next) => {
            VRS.update_test(req, res).catch(next);
        })
        .get('/checks', async (req, res, next) => {
            req.log.trace(`get '/checks' queue pending count: `, queue.pending);
            await queue.add(() => VRS.list_all_checks(req, res).catch(next));
        }).get('/snapshot/:id', async (req, res, next) => {
            VRS.get_snapshot(req, res).catch(next);
        }).get('/checks/byident/:testid', async (req, res, next) => {
            VRS.checks_group_by_ident(req, res).catch(next);
        }).get('/check/:id', async (req, res, next) => {
            VRS.get_check(req, res).catch(next);
        });
};
