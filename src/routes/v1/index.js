const express = require('express');
const authRoute = require('./auth.route');
const appRoute = require('./app.route');
const testRote = require('./test.route');

const router = express.Router();

const defaultRoutes = [
    {
        path: '/auth',
        route: authRoute,
    },
    {
        path: '/app',
        route: appRoute,
    },
    {
        path: '/tests',
        route: testRote,
    },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;
