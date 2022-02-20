const mongoose = require('mongoose');
const { removeEmptyProperties, buildQuery, getSuitesByTestsQuery, fatalError } = require('../utils');

const Suite = mongoose.model('VRSSuite');
const App = mongoose.model('VRSApp');

exports.index = async function (req, res) {
    this.logMeta = { scope: 'index' };
    try {
        const opts = removeEmptyProperties(req.query);
        let sortBy;
        if ((opts.sortprop === 'name')
            || (opts.sortprop === 'status')
            || (opts.sortprop === 'browserName')
            || (opts.sortprop === 'suite')
            || (opts.sortprop === 'os')
            || (opts.sortprop === 'calculatedViewport')
            || (opts.sortprop === 'updatedDate')) {
            sortBy = opts.sortprop;
        }
        sortBy = sortBy || 'updatedDate';
        const sortOrder = opts.sortorder ? opts.sortorder : -1;
        const sortFilter = {};
        sortFilter[sortBy] = sortOrder;
        const suite = await Suite.findOne({ name: opts.filter_suitename_eq })
            .exec();

        let query = buildQuery(opts);

        if (req.user.role === 'user') {
            query.creatorUsername = req.user.username;
        }
        const currentAppId = req.cookies.project;
        const projectFilter = req.cookies.project ? { app: currentAppId } : {};
        query = { ...query, ...projectFilter };
        const suites = await getSuitesByTestsQuery(query);
        const currentUser = req.user;
        const apps = await App.find({})
            .exec();

        res.render('pages/index', {
            suites,
            currentSuite: suite,
            user: currentUser,
            opts,
            apps,
            currentAppId,
        });
    } catch (e) {
        fatalError(req, res, e);
    }
};
