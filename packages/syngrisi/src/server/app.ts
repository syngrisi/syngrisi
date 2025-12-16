import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import fileUpload from 'express-fileupload';
import { cookieParser } from '@utils';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import path from 'path';
import log from '@logger';
import { config } from '@config';
import { baseDir } from '@lib/baseDir';
import routes from './routes/v1/index.route';
import authRoutes from './routes/ui/auth';
import adminRoutes from './routes/ui/admin';
import uiRoutes from './routes/ui';
import aiRoutes from './routes/ai.route';

import { compressionFilter, disableCors, apiLimiter } from './middlewares';
import { User } from './models';
import httpLoggerMiddleware from '@lib/httpLoggerWinston';
import errorHandler from './middlewares/errorHandler';
import { openAPIRouter } from './api-docs/openAPIRouter';
import { LogOpts } from '../types';
import { env } from './envConfig';
import { ensureLoggedInOrApiKey } from './middlewares/ensureLogin/ensureLoggedIn';
import { initSSOStrategies } from './services/auth-sso.service';

const logMeta: LogOpts = { scope: 'app.ts', msgType: "Init" };

log.info('Init the application', logMeta);
const app = express();

log.info('\t- basic http conf', logMeta);

app.use(helmet(config.helmet));
app.use(disableCors);

app.use(compression({ filter: compressionFilter }));
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(fileUpload({ limits: { fileSize: config.fileUploadMaxSize } }));
app.use(express.json({ limit: config.jsonLimit }));
if (config.enableHttpLogger) app.use(httpLoggerMiddleware);

log.info('\t- authentication', logMeta);
// Session and Passport setup
app.use(session({
    secret: config.storeSessionKey,
    resave: false,
    saveUninitialized: false,
    cookie: {
        // secure: env.NODE_ENV === 'production',
        secure: false,
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
    store: MongoStore.create({ mongoUrl: config.connectionString }),
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({}, User.authenticate()));
initSSOStrategies(passport);

passport.serializeUser(User.serializeUser() as ((user: Express.User, done: (err: unknown) => void) => void));
passport.deserializeUser(User.deserializeUser());

log.info('\t- static files', logMeta);
app.use(
    '/snapshoots',
    ensureLoggedInOrApiKey(),
    express.static(config.defaultImagesPath)
);
app.use('/assets', express.static(path.join(baseDir, './mvc/views/react/assets'), {
    setHeaders: (res) => {
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'GET');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
    }
}));
app.use('/static', express.static(path.join(baseDir, './src/server/static/static')));

log.info('\t- routes', logMeta);
app.use('/v1', apiLimiter, routes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/ai', aiRoutes);
app.use('/', uiRoutes);

app.use('/swagger', openAPIRouter);

app.use(errorHandler());

export default app;
