const express = require('express');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');

const session = require('express-session');

const fs = require('fs');

const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('./mvc/models/vrsModel'); // created model loading here
const fileUpload = require('express-fileupload');
const pino = require('pino');
const path = require('path');
const compression = require('compression');
const passport = require('passport');

const User = mongoose.model('VRSUser');
const LocalStrategy = require('passport-local').Strategy;

const logger = require('pino-http')(
    {
        name: 'vrs',
        autoLogging: true,
        useLevel: 'info',
    },
    pino.destination('./application.log')
);
const { AppSettings } = require('./lib/AppSettings');

global.AppSettings = new AppSettings();

const { config } = require('./config');
const { Logger } = require('./lib/logger');

const { disableCors } = require('./src/middlewares/disableCors');

global.log = new Logger({ dbConnectionString: config.connectionString });
this.logMeta = { scope: 'entrypoint' };
log.info('Init the application', this);

function compressionFilter(req, res) {
    if (req.headers['x-no-compression']) {
        return false;
    }
    return compression.filter(req, res);
}

app.use(compression({ filter: compressionFilter }));

app.use(disableCors);

const expressSession = session({
    secret: process.env.SYNGRISI_SESSION_STORE_KEY || require('crypto')
        .randomBytes(64)
        .toString('hex'),
    resave: true,
    saveUninitialized: false,
    cookie: { secure: false },
    store: MongoStore.create({ mongoUrl: config.connectionString }),
});

app.use(expressSession);

log.info('Init passport', this);
app.use(passport.initialize());
app.use(session({
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost/test-app' }),
}));
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger);

app.use(cookieParser());

app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));

log.info('Connect to database', this);
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect(config.connectionString, {});

const viewPath = path.join(__dirname, 'mvc/views');

app.set('views', viewPath);
app.set('view engine', 'ejs');

app.use(express.json({ limit: '50mb' }));
app.use('/snapshoots', express.static(config.defaultBaselinePath));
app.use('/static', express.static('./static'));
app.use('/assets', express.static('./mvc/views/react/assets'));
app.use('/lib', express.static('./mvc/views/lib'));
const routes = require('./mvc/routes/vrsRoutes');
const routes2 = require('./src/routes/v1');

app.use('/v1', routes2);

app.use('/auth', require('./src/routes/ui/auth'));
app.use('/admin*', require('./src/routes/ui/admin'));
app.use('/', require('./src/routes/ui/index2'));

routes(app); // register the route

app.use((req, res) => {
    res.status(404)
        .json({ url: `${req.originalUrl} not found` });
});

app.listen(config.port, async () => {
    log.debug('run onStart jobs', this);
    const startUp = await require('./lib/onStart');
    startUp.createTempDir();
    await startUp.createBasicUsers();
    await startUp.createInitialSettings();
    if (process.env.SYNGRISI_TEST_MODE === '1') await startUp.createTestsUsers();
});

log.info('Get Application version', this);
global.version = require('./package.json').version;

log.info('Load devices list', this);
global.devices = require('./src/data/devices.json');

if (fs.existsSync('./src/data/custom_devices.json')) {
    global.devices = [...global.devices, ...require('./src/data/custom_devices.json')];
}

log.info(`Syngrisi version: ${global.version} started at 'http://localhost:${config.port}'`, this);
log.info('Press <Ctrl+C> to exit', this);
