const express = require('express');
const {config} = require('./config.js');
const app = express();
const port = config.port;
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const VRSModel = require('./mvc/models/vrsModel'); // created model loading here
const fileUpload = require('express-fileupload');
const {default: PQueue} = require('p-queue');
const pino = require('pino');
const path = require('path');
const fs = require('fs');
const logger = require('pino-http')(
    {
        name: 'vrs',
        level: 'info',
        autoLogging: true,
        useLevel: 'debug'
    },
    pino.destination('./application.log')
)
app.use(logger)

app.use(fileUpload({
    limits: {fileSize: 50 * 1024 * 1024},
}));

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect(config.connectionString);

var viewPath = path.join(__dirname, 'mvc/views');

app.set('views', viewPath);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.urlencoded({limit: '50mb'}));
app.use(express.json({limit: '50mb'}));
app.use('/snapshoots', express.static(config.defaultBaselinePath));
app.use('/static', express.static('./static'));
app.use('/lib', express.static('./mvc/views/lib'));
const routes = require('./mvc/routes/vrsRoutes');
routes(app); // register the route

app.use((req, res) => {
    res.status(404)
        .send({url: `${req.originalUrl} not found`});
});
app.listen(port, function () {
    const dir = './.tmp';
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
});

console.log(`Server started on: ${port}`);



