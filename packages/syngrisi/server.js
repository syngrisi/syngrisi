#!/usr/bin/env node
const v8 = require('v8');
const express = require('express');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const chalk = require('chalk');
const session = require('express-session');
const fs = require('fs');

const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const pino = require('pino');
const path = require('path');
const compression = require('compression');
const passport = require('passport');
const PQueue = require('p-queue').default;

global.queue = new PQueue({ concurrency: 1 });

const LocalStrategy = require('passport-local').Strategy;
const pinoLogger = require('pino-http');

const { User } = require('./src/server/models');
const { AppSettings } = require('./src/server/lib/AppSettings');

global.AppSettings = new AppSettings();

const { config } = require('./config');

const { disableCors } = require('./src/server/middlewares');

const log = require("./dist/src/server/lib/logger").default;

// object-container for bottleneck instances
global.limiter = {};

const logMeta = { scope: 'entrypoint' };
log.info('Init the application', logMeta);

const coverage = process.env.SYNGRISI_COVERAGE === 'true';
process.on('SIGINT', () => {
    if (coverage) {
        log.info('take coverage');
        v8.takeCoverage();
        v8.stopCoverage();
    }
    console.log('Program shutting down (Ctrl+C).');
    process.exit(1);
});

function compressionFilter(req, res) {
    if (req.headers['x-no-compression']) {
        return false;
    }
    return compression.filter(req, res);
}

app.use(compression({ filter: compressionFilter }));

app.use(disableCors);

const storeSessionKey = process.env.SYNGRISI_SESSION_STORE_KEY || require('crypto')
    .randomBytes(64)
    .toString('hex');

const expressSession = session({
    secret: storeSessionKey,
    resave: true,
    saveUninitialized: false,
    cookie: { secure: false },
    store: MongoStore.create({ mongoUrl: config.connectionString }),
});

app.use(expressSession);

log.info('Init passport', this);
app.use(passport.initialize());
// app.use(session({
//     store: MongoStore.create({ mongoUrl: 'mongodb://localhost/test-app' }),
//     secret: storeSessionKey,
//     resave: true,
//     saveUninitialized: true,
// }));
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (config.enableHttpLogger === 'true') {
    app.use(pinoLogger(
        {
            name: 'vrs',
            autoLogging: true,
            useLevel: 'info',
        },
        pino.destination(config.httpLoggerFilePath))
    );
}

app.use(cookieParser());

app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));

const viewPath = path.join(__dirname, 'mvc/views');

app.set('views', viewPath);
app.set('view engine', 'ejs');

app.use(express.json({ limit: '50mb' }));

app.use('/snapshoots', express.static(path.join(process.cwd(), config.defaultImagesPath)));

app.use('/static', express.static(`${__dirname}/static`));
app.use('/assets', express.static(`${__dirname}/mvc/views/react/assets`));
const routes = require('./src/server/routes/v1/index');

app.use('/v1', routes);

app.use('/auth', require('./dist/src/server/routes/ui/auth').default);
// app.use('/admin*', require('./src/server/routes/ui/admin'));
app.use('/admin*', require('./dist/src/server/routes/ui/admin').default);
app.use('/', require('./dist/src/server/routes/ui').default);

app.use((req, res) => {
    res.status(404)
        .json({ url: `${req.originalUrl} not found` });
});

log.info('Connect to database', this);

mongoose.Promise = global.Promise;

let server;
mongoose.set('strictQuery', false);
// mongoose instance connection url connection
mongoose.connect(config.connectionString, { useUnifiedTopology: true })
    .then(async () => {
        log.info('Connected to MongoDB');
        log.debug('run onStart jobs', logMeta);
        const startUp = await require('./src/server/lib/startup');
        startUp.createTempDir();
        await startUp.createBasicUsers();
        await startUp.createInitialSettings();
        if (process.env.SYNGRISI_TEST_MODE === '1') await startUp.createTestsUsers();

        log.info('Get Application version', logMeta);
        global.version = require('./package.json').version;

        log.info('Load devices list', logMeta);
        global.devices = require('./src/server/data/devices.json');

        if (fs.existsSync('./src/data/custom_devices.json')) {
            global.devices = [...global.devices, ...require('./src/server/data/custom_devices.json')];
        }

        server = app.listen(config.port, () => {
            log.info(chalk.green(`Syngrisi version: ${chalk.blue(global.version)} started at http://localhost:${config.port}`), logMeta);
            log.info(chalk.whiteBright('Press <Ctrl+C> to exit'), logMeta);
        });
    });
