const { default: PQueue } = require('p-queue');

const queue = new PQueue({ concurrency: 1 });
const {
    ensureLoggedIn,
    ensureApiKey,
    ensureLoggedInOrApiKey,
} = require('../../lib/ensureLogin/ensureLoggedIn');

const API = require('../controllers/api/api_controller');

module.exports = async (app) => {
    await app
        .put('/checksupdate/:id', ensureLoggedIn(), async (req, res, next) => {
            await queue.add(() => API.updateCheck(req, res)
                .catch(next));
        })
        // .put('/baselines/:id', ensureLoggedIn(), async (req, res, next) => {
        //     API.updateBaseline(req, res)
        //         .catch(next);
        // })
        // .put('/baselines_by_snapshot_id/:id', ensureLoggedIn(), async (req, res, next) => {
        //     API.updateBaselineBySnapshotId(req, res)
        //         .catch(next);
        // })
        .get('/run/:id', ensureLoggedIn(), async (req, res, next) => {
            API.getRun(req, res)
                .catch(next);
        })
        .get('/checkview', ensureLoggedIn(), (req, res) => {
            const { id } = req.query;
            // backward compatibility
            res.redirect(`/?checkId=${id}&modalIsOpen=true`);
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
        // SDK method don't remove
        .post('/tests', ensureApiKey(), async (req, res, next) => {
            req.log.trace('post \'/tests\' queue pending count: ', queue.pending);
            await queue.add(() => API.createTest(req, res)
                .catch(next));
        })
        .get('/apikey/', ensureLoggedIn(), async (req, res, next) => {
            API.generateApiKey(req, res)
                .catch(next);
        })
        .post('/session/:testid', ensureApiKey(), async (req, res, next) => {
            API.stopSession(req, res)
                .catch(next);
        })
        .get('/screenshots', ensureLoggedIn(), async (req, res) => {
            API.getScreenshotList(req, res);
        })
        .get('/loadTestUser', ensureLoggedIn(), async (req, res, next) => {
            API.loadTestUser(req, res)
                .catch(next);
        })
        .get('/status', async (req, res, next) => {
            API.status(req, res)
                .catch(next);
        })
        // for testing purposes
        .get('/task_handle_old_checks', ensureLoggedInOrApiKey(), async (req, res, next) => {
            API.task_handle_old_checks(req, res, next)
                .catch(next);
        })
        .get('/task_handle_database_consistency', ensureLoggedInOrApiKey(), async (req, res, next) => {
            API.task_handle_database_consistency(req, res, next)
                .catch(next);
        })
        .get('/task_remove_old_logs', ensureLoggedInOrApiKey(), async (req, res, next) => {
            API.task_remove_old_logs(req, res, next)
                .catch(next);
        })
        .get('/task_test', ensureLoggedInOrApiKey(), async (req, res, next) => {
            await API.task_test(req, res, next)
                .catch(next);
        });
};
