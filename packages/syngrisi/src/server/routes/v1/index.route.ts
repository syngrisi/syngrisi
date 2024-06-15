import express from 'express';
import authRoute from './auth.route';
import appRoute from './app.route';
import testsRoute from './tests.route';
import usersRoute from './users.route';
import logsRoute from './logs.route';
import runsRoute from './runs.route';
import snapshotRoute from './snapshots.route';
import checkRoute from './checks.route';
import baselinesRoute from './baselines.route';
import suitesRoute from './suites.route';
import settingsRoute from './settings.route';
import testDistinctRoute from './test_distinct.route';
import tasksRoute from './tasks.route';
import clientRoute from './client.route';

const router = express.Router();

const defaultRoutes = [
    {
        path: '/auth',
        route: authRoute,
    },
    {
        path: '/client',
        route: clientRoute,
    },
    {
        path: '/tasks',
        route: tasksRoute,
    },
    {
        path: '/users',
        route: usersRoute,
    },
    {
        path: '/app',
        route: appRoute,
    },
    {
        path: '/tests',
        route: testsRoute,
    },
    {
        path: '/logs',
        route: logsRoute,
    },
    {
        path: '/runs',
        route: runsRoute,
    },
    {
        path: '/snapshots',
        route: snapshotRoute,
    },
    {
        path: '/checks',
        route: checkRoute,
    },
    {
        path: '/baselines',
        route: baselinesRoute,
    },
    {
        path: '/suites',
        route: suitesRoute,
    },
    {
        path: '/settings',
        route: settingsRoute,
    },
    {
        path: '/test-distinct',
        route: testDistinctRoute,
    },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;
