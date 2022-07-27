const { fatalError } = require('../utils');

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

exports.admin2 = async function (req, res) {
    try {
        const currentAppId = req.cookies.project;
        res.render('pages/admin2', {
            user: req.user,
            apps: null,
            currentAppId,
        });
    } catch (e) {
        fatalError(req, res, e);
    }
};
