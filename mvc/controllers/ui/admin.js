const mongoose = require('mongoose');
const { fatalError } = require('../utils');

const App = mongoose.model('VRSApp');

exports.admin = async function (req, res) {
    try {
        const currentAppId = req.cookies.project;
        res.render('pages/admin', {
            user: req.user,
            apps: null,
            currentAppId,
        });
    } catch (e) {
        fatalError(req, res, e);
    }
};
