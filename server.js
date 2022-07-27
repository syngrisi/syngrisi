const express = require('express');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session')({
    secret: 'secret-sss',
    resave: true,
    saveUninitialized: false,
    cookie: { secure: false },
});

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
const { config } = require('./config');
const { Logger } = require('./lib/logger');

global.log = new Logger({ dbConnectionString: config.connectionString });
this.logMeta = { scope: 'entrypoint' };

function compressionFilter(req, res) {
    if (req.headers['x-no-compression']) {
        return false;
    }
    return compression.filter(req, res);
}

app.use(compression({ filter: compressionFilter }));
app.use(expressSession);
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger);

app.use(cookieParser());

app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect(config.connectionString, {});

const viewPath = path.join(__dirname, 'mvc/views');

app.set('views', viewPath);

app.set('view engine', 'ejs');

app.use(express.json({ limit: '50mb' }));
app.use('/snapshoots', express.static(config.defaultBaselinePath));
app.use('/static', express.static('./static'));
app.use('/public', express.static('./public'));
app.use('/lib', express.static('./mvc/views/lib'));
const routes = require('./mvc/routes/vrsRoutes');

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
});

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
const { version } = require('./package.json');

log.info(`Syngrisi version: ${version} started at 'http://localhost:${config.port}'`, this);
log.info('Press <Ctrl+C> to exit', this);
