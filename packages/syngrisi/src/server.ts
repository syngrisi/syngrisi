#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import v8 from 'v8';
import 'source-map-support/register';
import express from 'express';

// @ts-ignore
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo';
import chalk from 'chalk';

// @ts-ignore
import session from 'express-session';
import fs from 'fs';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
// @ts-ignore
import fileUpload from 'express-fileupload';
import pino from 'pino';
import path from 'path';
// @ts-ignore
import compression from 'compression';
import passport from 'passport';
import PQueue from 'p-queue';
import crypto from 'crypto';

// @ts-ignore
import { Strategy as LocalStrategy } from 'passport-local';
import pinoLogger from 'pino-http';

import { User } from './server/models';
import { AppSettings } from './server/lib/AppSettings';

import { config } from './config';

import { disableCors } from './server/middlewares';

import log from './server/lib/logger';

import routes from './server/routes/v1/index.route';
import authRoutes from './server/routes/ui/auth';
import adminRoutes from './server/routes/ui/admin';
import uiRoutes from './server/routes/ui';
// import { vi } from 'vitest';

// @ts-ignore
global.queue = new PQueue({ concurrency: 1 });

// @ts-ignore
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

function compressionFilter(req: express.Request, res: express.Response) {
    if (req.headers['x-no-compression']) {
        return false;
    }
    return compression.filter(req, res);
}

const app = express();
// @ts-ignore
app.use(compression({ filter: compressionFilter }));

app.use(disableCors);

const storeSessionKey = process.env.SYNGRISI_SESSION_STORE_KEY || crypto.randomBytes(64).toString('hex');

const expressSession = session({
    secret: storeSessionKey,
    resave: true,
    saveUninitialized: false,
    cookie: { secure: false },
    store: MongoStore.create({ mongoUrl: config.connectionString }),
});

// @ts-ignore
app.use(expressSession);

log.info('Init passport', logMeta);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({}, User.authenticate()));
// @ts-ignore
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (config.enableHttpLogger === 'true') {
    app.use(
        pinoLogger(
            {
                name: 'vrs',
                autoLogging: true,
                useLevel: 'info',
            },
            pino.destination(config.httpLoggerFilePath)
        )
    );
}

// @ts-ignore
app.use(cookieParser());

// @ts-ignore
app.use(
    // @ts-ignore
    fileUpload({ limits: { fileSize: 50 * 1024 * 1024 }, })
);


log.info('Init static middlewares', logMeta);
const baseDir = process.cwd();
const viewPath = path.join(baseDir, './mvc/views/');

app.set('views', viewPath);
app.set('view engine', 'ejs');

app.use(express.json({ limit: '50mb' }));

const screenshotsPath = path.join(baseDir, config.defaultImagesPath);

app.use('/snapshoots', express.static(screenshotsPath));
const staticPath = path.join(baseDir, './src/server/static/static');

app.use('../static', express.static(staticPath));
const assetsPath = path.join(baseDir, './mvc/views/react/assets');
app.use('/assets', express.static(assetsPath));


log.info('Init routes', logMeta);

app.use('/v1', routes);
app.use('/auth', authRoutes);
app.use('/admin*', adminRoutes);
app.use('/', uiRoutes);

app.use((req, res) => {
    res.status(404).json({ url: `${req.originalUrl} not found` });
});

log.info('Connect to database', this);

mongoose.Promise = global.Promise;

// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// let server: any;
mongoose.set('strictQuery', false);
mongoose
    // .connect(config.connectionString, { useUnifiedTopology: true })
    .connect(config.connectionString)
    .then(async () => {
        log.info('Connected to MongoDB');
        log.info('Load application setting', logMeta);
        // @ts-ignore
        global.AppSettings = await (new AppSettings()).init();  

        log.debug('run onStart jobs', logMeta);
        const startUp = await import('./server/lib/startup');
        startUp.createTempDir();
        await startUp.createBasicUsers();
        await startUp.createInitialSettings();
        if (process.env.SYNGRISI_TEST_MODE === '1') await startUp.createTestsUsers();

        log.info('Get Application version', logMeta);
        (global as any).version = (await import('../package.json')).version;

        log.info('Load devices list', logMeta);
        (global as any).devices = (await import('./server/data/devices.json')).default;

        if (fs.existsSync('./src/data/custom_devices.json')) {
            (global as any).devices = [...(global as any).devices, ...(await import('./server/data/custom_devices.json')).default];
        }

        app.listen(config.port, () => {
            log.info(
                chalk.green(`Syngrisi version: ${chalk.blue((global as any).version)} started at http://localhost:${config.port}`),
                logMeta
            );
            log.info(chalk.whiteBright('Press <Ctrl+C> to exit'), logMeta);
        });

    });
