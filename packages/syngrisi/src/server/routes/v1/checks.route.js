const express = require('express');
const { checksController } = require('../../controllers');
const { ensureLoggedIn } = require('../../middlewares/ensureLogin');

const router = express.Router();

router
    .route('/')
    .get(ensureLoggedIn(), checksController.get);

router
    .route('/:id')
    .delete(ensureLoggedIn(), checksController.remove);

// update
router.route('/:id')
    .put(ensureLoggedIn(), checksController.update);

router.route('/accept/:id')
    .put(ensureLoggedIn(), checksController.accept);

router.route('/get_via_post')
    .post(ensureLoggedIn(), checksController.getViaPost);

module.exports = router;
