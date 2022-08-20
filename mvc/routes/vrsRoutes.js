const { default: PQueue } = require('p-queue');

const queue = new PQueue({ concurrency: 1 });
const {
    ensureLoggedIn,
    ensureApiKey,
    ensureLoggedInOrApiKey,
} = require('../../lib/ensureLogin/ensureLoggedIn');
const UI = require('../controllers/ui/ui_controller');
const { index } = require('../controllers/ui/index');
const { admin, admin2 } = require('../controllers/ui/admin');
const { runs } = require('../controllers/ui/runs');
const API = require('../controllers/api/api_controller');

module.exports = async (app) => {
    await app
        .delete('/checks/:id', ensureLoggedIn(), async (req, res, next) => {
            API.removeCheck(req, res)
                .catch(next);
        })
        // use only for accept
        .put('/acceptChecks/:id', ensureLoggedIn(), async (req, res, next) => {
            await queue.add(() => API.acceptCheck(req, res)
                .catch(next));
        })
        .put('/checksupdate/:id', ensureLoggedIn(), async (req, res, next) => {
            await queue.add(() => API.updateCheck(req, res)
                .catch(next));
        })
        .put('/snapshots/:id', ensureLoggedIn(), async (req, res, next) => {
            API.updateSnapshot(req, res)
                .catch(next);
        })
        .put('/baselines/:id', ensureLoggedIn(), async (req, res, next) => {
            API.updateBaseline(req, res)
                .catch(next);
        })
        .put('/baselines_by_snapshot_id/:id', ensureLoggedIn(), async (req, res, next) => {
            API.updateBaselineBySnapshotId(req, res)
                .catch(next);
        })
        .get('/', ensureLoggedIn(),
            (req, res, next) => {
                index(req, res)
                    .catch(next);
            })
        .get('/runs', ensureLoggedIn(),
            (req, res, next) => {
                runs(req, res)
                    .catch(next);
            })
        .get('/run/:id', ensureLoggedIn(), async (req, res, next) => {
            API.getRun(req, res)
                .catch(next);
        })
        .get('/affectedelements', ensureApiKey(), async (req, res, next) => {
            API.affectedElements(req, res)
                .catch(next);
        })
        .get('/checksgroupview', ensureLoggedIn(), async (req, res, next) => {
            UI.checksGroupView(req, res)
                .catch(next);
        })
        .get('/checkview', ensureLoggedIn(), (req, res, next) => {
            UI.checkView(req, res)
                .catch(next);
        })
        .get('/diffview', ensureLoggedIn(), (req, res, next) => {
            UI.diffView(req, res)
                .catch(next);
        })
        .get('/admin', ensureLoggedIn(), (req, res, next) => {
            admin(req, res)
                .catch(next);
        })
        .get('/admin2', ensureLoggedIn(), (req, res, next) => {
            admin2(req, res)
                .catch(next);
        })
        .get('/users', ensureLoggedIn(), async (req, res, next) => {
            API.getUsers(req, res)
                .catch(next);
        })
        .get('/ident', ensureLoggedInOrApiKey(), (req, res) => {
            API.getIdent(req, res);
        })
        .get('/check_if_screenshot_has_baselines', ensureLoggedInOrApiKey(), (req, res) => {
            API.checkIfScreenshotHasBaselines(req, res);
        })
        .post('/password', ensureLoggedIn(), (req, res) => {
            API.changePassword(req, res);
        })
        .post('/checks', ensureApiKey(), async (req, res, next) => {
            req.log.trace('post \'/checks\' queue pending count: ', queue.pending);
            await queue.add(() => API.createCheck(req, res)
                .catch(next));
        })
        .post('/users', ensureLoggedIn(), async (req, res, next) => {
            req.log.trace('post \'/users\' queue pending count: ', queue.pending);
            await queue.add(() => API.createUser(req, res)
                .catch(next));
        })
        .put('/users', ensureLoggedIn(), async (req, res, next) => {
            req.log.trace('put \'/users\' queue pending count: ', queue.pending);
            await queue.add(() => API.updateUser(req, res)
                .catch(next));
        })
        .post('/tests', ensureApiKey(), async (req, res, next) => {
            req.log.trace('post \'/tests\' queue pending count: ', queue.pending);
            await queue.add(() => API.createTest(req, res)
                .catch(next));
        })
        .delete('/tests/:id', ensureLoggedIn(), async (req, res, next) => {
            API.removeTest(req, res)
                .catch(next);
        })
        .delete('/users/:id', ensureLoggedIn(), async (req, res, next) => {
            API.removeUser(req, res)
                .catch(next);
        })
        .get('/apikey/', ensureLoggedIn(), async (req, res, next) => {
            API.generateApiKey(req, res)
                .catch(next);
        })
        .delete('/suites/:id', ensureLoggedIn(), async (req, res, next) => {
            API.removeSuite(req, res)
                .catch(next);
        })
        .delete('/runs/:id', ensureLoggedIn(), async (req, res, next) => {
            API.removeRun(req, res)
                .catch(next);
        })
        .post('/session/:testid', ensureApiKey(), async (req, res, next) => {
            API.stopSession(req, res)
                .catch(next);
        })
        .get('/checks', ensureLoggedIn(), async (req, res, next) => {
            req.log.trace(`get '/checks' queue pending count: ${queue.pending} `);
            await queue.add(() => API.getChecks(req, res)
                .catch(next));
        })
        .get('/checks2', ensureLoggedIn(), async (req, res, next) => {
            API.getChecks2(req, res)
                .catch(next);
        })
        .get('/snapshot/:id', ensureLoggedIn(), async (req, res, next) => {
            API.getSnapshot(req, res)
                .catch(next);
        })
        .get('/baselines/:id', ensureLoggedIn(), async (req, res, next) => {
            API.getBaseline(req, res)
                .catch(next);
        })
        .get('/all_baselines', ensureLoggedIn(), (req, res) => {
            API.getBaselines(req, res);
        })
        .get('/checkhistory/:id', ensureLoggedIn(), async (req, res, next) => {
            API.getCheckHistory(req, res)
                .catch(next);
        })
        .get('/check/:id', ensureLoggedIn(), async (req, res, next) => {
            API.getCheck(req, res)
                .catch(next);
        })
        .get('/checks/byident/:testid', async (req, res, next) => {
            API.checksGroupByIdent(req, res)
                .catch(next);
        })
        .get('/test/:id', ensureLoggedIn(), async (req, res, next) => {
            API.getTestById(req, res)
                .catch(next);
        })
        .get('/checks/byfilter', ensureLoggedIn(), async (req, res) => {
            API.checksByFilter(req, res);
        })
        .get('/snapshots/byfilter', ensureLoggedIn(), async (req, res) => {
            API.shapshotsByFilter(req, res);
        })
        .get('/tests/byfilter', ensureLoggedIn(), async (req, res) => {
            API.testsByFilter(req, res);
        })
        .put('/tests/:id', async (req, res, next) => {
            if (process.env.SYNGRISI_TEST_MODE !== '1') {
                res.status('400')
                    .json({ error: 'only in test mode' });
                return next;
            }
            API.updateTest(req, res)
                .catch(() => next);
        })
        .get('/screenshots', ensureLoggedIn(), async (req, res) => {
            API.getScreenshotList(req, res);
        })
        .get('/userinfo', ensureLoggedIn(), async (req, res, next) => {
            UI.userinfo(req, res)
                .catch(next);
        })
        // .get('/login', (req, res) => {
        //     UI.login(req, res);
        // })
        // .post('/login', (req, res, next) => {
        //     const origin = req.query.origin ? req.query.origin : '/';
        //     const $this = {};
        //     $this.logMeta = { scope: 'login' };
        //     passport.authenticate('local',
        //         (err, user, info) => {
        //             if (err) {
        //                 return next(err);
        //             }
        //
        //             if (!user) {
        //                 return res.redirect(`/login?info=${JSON.stringify(info)}`);
        //             }
        //
        //             req.logIn(user, (e) => {
        //                 if (e) {
        //                     return next(e);
        //                 }
        //
        //                 log.info('user was logged in', $this, { user: user.username });
        //                 // this is for tests http login purpose
        //                 if (req.query.noredirect) {
        //                     return res.status(200)
        //                         .json({
        //                             autoTests: true,
        //                         });
        //                 }
        //                 return res.redirect(origin);
        //             });
        //         })(req, res, next);
        // })
        // maintenance
        .get('/loadTestUser', ensureLoggedIn(), async (req, res, next) => {
            API.loadTestUser(req, res)
                .catch(next);
        })
        .get('/status', async (req, res, next) => {
            API.status(req, res)
                .catch(next);
        })
        // just for testing purposes
        .get('/status_with_api_key', ensureApiKey(), async (req, res, next) => {
            API.status(req, res)
                .catch(next);
        })
        .get('/status_with_logged_in', ensureLoggedIn(), async (req, res, next) => {
            API.status(req, res)
                .catch(next);
        })
        .get('/status_with_api_key_or_logged_in', ensureLoggedInOrApiKey(), async (req, res, next) => {
            API.status(req, res)
                .catch(next);
        })
        .get('/task_handle_old_checks', ensureLoggedInOrApiKey(), async (req, res, next) => {
            API.task_handle_old_checks(req, res)
                .catch(next);
        })
        .get('/task_handle_database_consistency', ensureLoggedInOrApiKey(), async (req, res, next) => {
            API.task_handle_database_consistency(req, res)
                .catch(next);
        })
        .get('/task_remove_old_logs', ensureLoggedInOrApiKey(), async (req, res, next) => {
            API.task_remove_old_logs(req, res)
                .catch(next);
        });
};
