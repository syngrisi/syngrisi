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
        // move to v1
        .put('/checksupdate/:id', ensureLoggedIn(), async (req, res, next) => {
            await queue.add(() => API.updateCheck(req, res)
                .catch(next));
        })
        .get('/ident', ensureLoggedInOrApiKey(), (req, res) => {
            API.getIdent(req, res);
        })
        .post('/checks', ensureApiKey(), async (req, res, next) => {
            req.log.trace('post \'/checks\' queue pending count: ', queue.pending);
            await queue.add(() => API.createCheck(req, res)
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
        });
};
