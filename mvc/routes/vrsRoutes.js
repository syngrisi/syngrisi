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
        // SDK !!!!!!!!!!!!
        .post('/tests', ensureApiKey(), async (req, res, next) => {
            req.log.trace('post \'/tests\' queue pending count: ', queue.pending);
            await queue.add(() => API.createTest(req, res)
                .catch(next));
        })
        .post('/session/:testid', ensureApiKey(), async (req, res, next) => {
            API.stopSession(req, res)
                .catch(next);
        })
        .post('/checks', ensureApiKey(), async (req, res, next) => {
            req.log.trace('post \'/checks\' queue pending count: ', queue.pending);
            await queue.add(() => API.createCheck(req, res)
                .catch(next));
        })
        .get('/ident', ensureLoggedInOrApiKey(), (req, res) => {
            API.getIdent(req, res);
        })
        .get('/check_if_screenshot_has_baselines', ensureLoggedInOrApiKey(), (req, res) => {
            API.checkIfScreenshotHasBaselines(req, res);
        });
};
