const ImageJS = require('imagejs');
const YAML = require('yaml');
const faker = require('faker');
const moment = require('moment');
/* eslint-disable no-console */
const {
    format,
    subDays,
} = require('date-fns');
const got = require('got');
const { spawn, execSync } = require('child_process');
const { SyngrisiDriver } = require('@syngrisi/syngrisi-wdio-sdk');

const saveRandomImage = async function saveRandomImage(fullPath) {
    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    const size = 30;
    return new Promise((resolve) => {
        const bitmap = new ImageJS.Bitmap({
            width: size,
            height: size,
        });
        for (const val of [...Array(size)]) {
            bitmap.setPixel(getRandomInt(size), getRandomInt(size), 255, 1, 1, 255);
        }
        bitmap.writeFile(fullPath, { type: ImageJS.ImageType.PNG })
            .then(() => {
                resolve();
            });
    });
};

const killServer = function (port) {
    const { execSync } = require('child_process');
    browser.waitUntil(() => {
        console.log(`Try to kill apps on port: '${port}'`);
        try {
            const output = execSync(`npx kill-port ${port}`)
                .toString();
            // console.log({ output });
            return true;
        } catch (e) {
            console.log({ error: e.stdout.toString() });
        }
        return false;
    }, {
        timeout: 40000,
    });
};

const startSession = async function (sessOpts) {
    sessOpts.suiteName = sessOpts.suiteName || 'Integration suite';
    sessOpts.suiteId = sessOpts.suiteId || sessOpts.suiteName.replace(' ', '_');
    sessOpts.appName = sessOpts.appName || 'Integration Test App';
    sessOpts.branch = sessOpts.branch || 'integration';

    const currentSuite = {
        name: sessOpts.suiteName || 'Integration suite',
        id: sessOpts.suiteId || sessOpts.suiteName.replace(' ', '_'),
    };

    if ((sessOpts.suiteName !== 'EMPTY')) {
        browser.vDriver.setCurrentSuite(currentSuite);
    }

    await browser.vDriver.startTestSession({
        app: sessOpts.appName,
        test: sessOpts.testName,
        run: process.env.RUN_NAME || 'integration_run_name',
        runident: process.env.RUN_IDENT || 'integration_run_ident',
        branch: sessOpts.branch,
    }, browser.config.apiKey);
};

// const checkWithFile = async function () {
//     browser.pause(300);
//     const imageBuffer = fs.readFileSync(`${browser.config.rootPath}/${filePath}`);
//     const checkResult = await checkVRS(checkName, imageBuffer);
// };

const fillCommonPlaceholders = function fillPlaceholders(str) {
    require('./extendString');
    return str.formatPlaceholders(
        {
            'YYYY-MM-DD': moment(new Date())
                .format('YYYY-MM-DD'),
            Email: faker.internet.email()
                .toLowerCase(),
            ShortSlug: faker.lorem.slug(2),
            Slug: faker.lorem.slug(),
            Uuid: faker.datatype.uuid(),
            'currentDate-10': subDays(new Date(), 10),
            testPlatform: browser.config.testPlatform,
            syngrisiUrl: `http://${browser.config.serverDomain}:${browser.config.serverPort}/`,
            serverDomain: browser.config.serverDomain,
            serverPort: browser.config.serverPort,
        }
    );
};

const requestWithLastSessionSid = async function requestWithLastSessionSid(uri, $this, opts = { method: 'GET' }, body,) {
    const sessionSid = $this.getSavedItem('lastSessionId');

    const res = await got(
        `${uri}`,
        {
            headers: {
                cookie: `connect.sid=${sessionSid}`,
            },
            form: opts.form,
            method: opts.method,
            body,
        },
    );
    let json;
    try {
        json = JSON.parse(res.body);
    } catch (e) {
        console.warn('Warning: cannot parse body as json');
        json = '';
    }
    return {
        raw: res,
        json,
    };
};

function getCid() {
    return parseInt(process.argv.filter((x) => x.includes('CID'))[0].split('-')[1], 10);
}

const startServer = (params) => {
    const srvOpts = YAML.parse(params) || {};
    const cid = getCid();
    const databaseName = srvOpts.databaseName || 'VRSdbTest';
    const cmdPath = '../';
    const cidPort = 3001 + cid;
    const env = Object.create(process.env);
    env.SYNGRISI_DISABLE_FIRST_RUN = process.env.SYNGRISI_DISABLE_FIRST_RUN || '1';
    env.SYNGRISI_AUTH = process.env.SYNGRISI_AUTH || '0';
    // env.VRS_PORT = srvOpts.port || browser.config.serverPort;
    env.VRS_PORT = cidPort;
    browser.config.serverPort = cidPort;
    browser.config.testScreenshotsFolder = `./baselinesTest/${cid}/`;
    env.VRS_BASELINE_PATH = srvOpts.baseLineFolder || browser.config.testScreenshotsFolder;
    env.VRS_CONN_STRING = `mongodb://localhost/${databaseName}${cid}`;
    const child = spawn('node',
        ['server.js', 'syngrisi_test_server'], {
            env,
            shell: process.platform === 'win32',
            cwd: cmdPath,
        });

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (data) => {
        console.log(`#: ${data}`);
    });

    child.stderr.setEncoding('utf8');
    child.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });

    browser.pause(2500);
    browser.waitUntil(async () => {
        const res = (await got.get(`http://${browser.config.serverDomain}:`
            + `${cidPort}/status`, { throwHttpErrors: false })
            .json());
        console.log({ isAlive: res.alive });
        return (res.alive === true);
    });
    console.log(`SERVER IS STARTED, PID: '${child.pid}' port: '${cidPort}'`);
    browser.syngrisiServer = child;
};

const stopServer = function () {
    try {
        console.log('try to kill server');
        const output = execSync('pkill -f syngrisi_test_server')
            .toString();
        // console.log({ output });
    } catch (e) {
        console.log('WARNING: cannot stop te Syngrisi server via child, try to kill process');
        killServer(browser.config.serverPort);
    }
};

const clearDatabase = function () {
    const cmdPath = '../';
    const result = execSync('npm run clear_test', { cwd: cmdPath })
        .toString('utf8');
    // console.log({ result });
};

const startDriver = function (params) {
    const drvOpts = YAML.parse(params) || {};
    browser.vDriver = new SyngrisiDriver({
        url: drvOpts.url || `http://${browser.config.serverDomain}:${browser.config.serverPort}/`,
    });
};

module.exports = {
    saveRandomImage,
    startSession,
    fillCommonPlaceholders,
    killServer,
    requestWithLastSessionSid,
    startServer,
    stopServer,
    clearDatabase,
    startDriver,
};
