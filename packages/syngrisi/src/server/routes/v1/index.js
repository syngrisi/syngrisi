// const express = require('express');
// const authRoute = require('./auth.route');
// const appRoute = require('./app.route');
// const testsRoute = require('./test.route');
// const usersRoute = require('./users.route');
// const logsRoute = require('./logs.route');
// const runsRoute = require('./runs.route');
// const snapshotRoute = require('./snapshots.route');
// const checkRoute = require('./checks.route');
// const baselinesRoute = require('./baselines.route');
// const suitesRoute = require('./suites.route');
// const settingsRoute = require('./settings.route');
// const testDistinctRoute = require('./test_distinct.route');
// const tasksRoute = require('./tasks.route');
// const clientRoute = require('./client.route');

// const router = express.Router();

// const defaultRoutes = [
//     {
//         path: '/auth',
//         route: authRoute,
//     },
//     {
//         path: '/client',
//         route: clientRoute,
//     },
//     {
//         path: '/tasks',
//         route: tasksRoute,
//     },
//     {
//         path: '/users',
//         route: usersRoute,
//     },
//     {
//         path: '/app',
//         route: appRoute,
//     },
//     {
//         path: '/tests',
//         route: testsRoute,
//     },
//     {
//         path: '/logs',
//         route: logsRoute,
//     },
//     {
//         path: '/runs',
//         route: runsRoute,
//     },
//     {
//         path: '/snapshots',
//         route: snapshotRoute,
//     },
//     {
//         path: '/checks',
//         route: checkRoute,
//     },
//     {
//         path: '/baselines',
//         route: baselinesRoute,
//     },
//     {
//         path: '/suites',
//         route: suitesRoute,
//     },
//     {
//         path: '/settings',
//         route: settingsRoute,
//     },
//     {
//         path: '/test-distinct',
//         route: testDistinctRoute,
//     },
// ];

// defaultRoutes.forEach((route) => {
//     router.use(route.path, route.route);
// });

// module.exports = router;
