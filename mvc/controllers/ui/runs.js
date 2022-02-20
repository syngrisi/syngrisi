const mongoose = require('mongoose');
const {
    removeEmptyProperties, buildQuery, getSuitesByTestsQuery, fatalError, getRunsByTestsQuery
} = require('../utils');

const App = mongoose.model('VRSApp');
const Test = mongoose.model('VRSTest');
const Run = mongoose.model('VRSRun');

function getCheckStatuses(tests) {
    const statuses = tests.map((x) => x.status);
    const groupStatusesCounts = {};
    statuses.forEach((x) => {
        groupStatusesCounts[x] = (groupStatusesCounts[x] || 0) + 1;
    });
    // console.log({ groupStatusesCounts });
    return Promise.resolve(groupStatusesCounts);
}

exports.runs = async function (req, res) {
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

        let query = buildQuery(opts);
        delete query.run;
        if (req.user.role === 'user') {
            query.creatorUsername = req.user.username;
        }
        const currentAppId = req.cookies.project;
        const projectFilter = req.cookies.project ? { app: currentAppId } : {};
        query = { ...query, ...projectFilter };
        const runs = await getRunsByTestsQuery(query, 150);
        const aggregateRuns = await Promise.all(runs.map(async (run) => {
            const resultRun = run;
            // eslint-disable-next-line dot-notation
            resultRun['statuses'] = await getCheckStatuses(await Test.find({ run: run.id }));
            return resultRun;
        }));

        // console.log({ runs });
        const currentRun = await Run.findById(opts.filter_run_eq)
            .exec();

        const apps = await App.find({})
            .exec();

        const currentUser = req.user;
        res.render('pages/runs', {
            runs: aggregateRuns,
            currentRun,
            user: currentUser,
            opts,
            apps,
            currentAppId,
        });
    } catch (e) {
        fatalError(req, res, e);
    }
};
