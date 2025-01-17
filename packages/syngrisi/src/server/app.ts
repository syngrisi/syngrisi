import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import path from 'path';
import log from '@logger';
import { config } from '@config';
import routes from './routes/v1/index.route';
import authRoutes from './routes/ui/auth';
import adminRoutes from './routes/ui/admin';
import uiRoutes from './routes/ui';

import { compressionFilter, disableCors } from './middlewares';
import { User } from './models';
import httpLogger from '@lib/httpLogger';
import errorHandler from './middlewares/errorHandler';
import { openAPIRouter } from './api-docs/openAPIRouter';
import { LogOpts } from '../types';

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
if (config.enableHttpLogger) app.use(httpLogger);

log.info('\t- authentication', logMeta);
// Session and Passport setup
app.use(session({
  secret: config.storeSessionKey,
  resave: true,
  saveUninitialized: false,
  cookie: { secure: false },
  store: MongoStore.create({ mongoUrl: config.connectionString }),
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({}, User.authenticate()));

passport.serializeUser(User.serializeUser() as ((user: Express.User, done: (err: unknown) => void) => void));
passport.deserializeUser(User.deserializeUser());

log.info('\t- static files', logMeta);
const baseDir = path.resolve(__dirname, '..', '..');
const baseProcessDir = path.resolve(process.cwd());
app.use('/snapshoots', express.static(path.join(baseProcessDir, config.defaultImagesPath)));
app.use('/assets', express.static(path.join(baseDir, './mvc/views/react/assets'), {
    setHeaders: (res) => {
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'GET');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
    }
}));
app.use('/static', express.static(path.join(baseDir, './src/server/static/static')));

log.info('\t- routes', logMeta);
app.use('/v1', routes);
app.use('/auth', authRoutes);
app.use('/admin*', adminRoutes);
app.use('/', uiRoutes);

app.use('/swagger', openAPIRouter);

app.use(errorHandler());

export default app;
