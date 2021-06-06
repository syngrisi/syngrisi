const express = require('express');
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
const passport = require('passport');

const User = mongoose.model('VRSUser');
const LocalStrategy = require('passport-local').Strategy;

const logger = require('pino-http')(
    {
        name: 'vrs',
        level: 'info',
        autoLogging: true,
        useLevel: 'debug',
    },
    pino.destination('./application.log')
);

const winston = require('winston');

global.log = winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
        }),
    ],
});

const { config } = require('./config.js');

app.use(expressSession);

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger);

app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect(config.connectionString, { useNewUrlParser: true });

const viewPath = path.join(__dirname, 'mvc/views');

app.set('views', viewPath);

app.set('view engine', 'ejs');

app.use(express.json({ limit: '50mb' }));
app.use('/snapshoots', express.static(config.defaultBaselinePath));
app.use('/static', express.static('./static'));
app.use('/lib', express.static('./mvc/views/lib'));
const routes = require('./mvc/routes/vrsRoutes');

routes(app); // register the route

app.use((req, res) => {
    res.status(404)
        .send({ url: `${req.originalUrl} not found` });
});
app.listen(config.port, () => {
    require('./lib/onStart');
});

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

console.log(`Syngrisi started on port: '${config.port}'`);
