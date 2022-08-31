const express = require('express');
const authRoute = require('./auth.route');
const appRoute = require('./app.route');
const testsRoute = require('./test.route');
const usersRoute = require('./users.route');
const logsRoute = require('./logs.route');

const router = express.Router();

const defaultRoutes = [
    {
        path: '/auth',
        route: authRoute,
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
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;
