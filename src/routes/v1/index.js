const express = require('express');
const authRoute = require('./auth.route');
const appRoute = require('./app.route');
const testRoute = require('./test.route');
const usersRoute = require('./users.route');

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
        route: testRoute,
    },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;
