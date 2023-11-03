const ImageJS = require('imagejs');
const YAML = require('yaml');
const faker = require('faker');
const moment = require('moment');
/* eslint-disable no-console */
const {
    subDays,
} = require('date-fns');
const { got } = require('got-cjs');
const { spawn, execSync } = require('child_process');
const { SyngrisiDriver } = require('@syngrisi/syngrisi-wdio-sdk');
const hasha = require('hasha');

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
        // eslint-disable-next-line no-unused-vars
        for (const val of [...Array(size)]) {
            bitmap.setPixel(getRandomInt(size), getRandomInt(size), 255, 1, 1, 255);
        }
        bitmap.writeFile(fullPath, { type: ImageJS.ImageType.PNG })
            .then(() => {
                resolve();
            });
    });
};

const killServer = (port) => {
    browser.waitUntil(() => {
        console.log(`Try to kill apps on port: '${port}'`);
        try {
            const output = execSync(`npx kill-port ${port}`)
                .toString();
            console.log({ output });
            return true;
        } catch (e) {
            console.log({ error: e.stdout.toString() });
        }
        return false;
    }, {
        timeout: 40000,
    });
};

const startSession = async (sessOpts) => {
    sessOpts.appName = sessOpts.appName || 'Integration Test App';
    sessOpts.branch = sessOpts.branch || 'integration';
    const opts = {
        app: sessOpts.appName,
        test: sessOpts.testName,
        suite: sessOpts.suiteName,
        run: process.env.RUN_NAME || 'integration_run_name',
        runident: process.env.RUN_IDENT || 'integration_run_ident',
        branch: sessOpts.branch,
    };
    if (sessOpts.suiteName === 'EMPTY') {
        delete opts.suite;
    }
    await browser.vDriver.startTestSession({ params: opts });
};

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
            'currentDate-20': subDays(new Date(), 20),
            'currentDate-30': subDays(new Date(), 30),
            testPlatform: browser.config.testPlatform,
            syngrisiUrl: `http://${browser.config.serverDomain}:${browser.config.serverPort}/`,
            serverDomain: browser.config.serverDomain,
            serverPort: browser.config.serverPort,
            hashedApiKey: hasha(browser.config.apiKey),
        }
    );
};

const requestWithLastSessionSid = async function requestWithLastSessionSid(uri, $this, opts = { method: 'GET' }, body) {
    const sessionSid = $this.getSavedItem('lastSessionId');

    const res = await got(
        `${uri}`,
        {
            headers: {
                cookie: `connect.sid=${sessionSid}`,
            },
            form: opts.form,
            json: opts.json,
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

const getCid = function getCid() {
    if (process.env.DOCKER === '1') return 100;
    return parseInt(process.argv.filter((x) => x.includes('CID'))[0].split('-')[1], 10);
};

module.exports.removeConsoleColors = (string) => {
    return string.replace(
        /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, ''
    );
};

const startServer = (params) => {
    // const srvOpts = YAML.parse(params) || {};
    const cid = getCid();

    const databaseName = 'SyngrisiDbTest';
    const cmdPath = '../';
    const cidPort = 3002 + cid;
    const env = { ...process.env };
    env.SYNGRISI_DISABLE_FIRST_RUN = process.env.SYNGRISI_DISABLE_FIRST_RUN || '1';
    env.SYNGRISI_AUTH = process.env.SYNGRISI_AUTH || '0';
    env.SYNGRISI_APP_PORT = cidPort;
    env.SYNGRISI_COVERAGE = 'true';
    browser.config.serverPort = cidPort;
    browser.config.testScreenshotsFolder = `./baselinesTest/${cid}/`;
    if (process.env.DOCKER !== '1') env.SYNGRISI_IMAGES_PATH = browser.config.testScreenshotsFolder;

    if (process.env.DOCKER !== '1') env.SYNGRISI_DB_URI = `mongodb://localhost/${databaseName}${cid}`;

    const fs = require('fs');
    const stream = fs.createWriteStream(`./logs/${cid}_server_log.log`);
    let child;
    if (process.env.DOCKER === '1') {
        child = spawn('docker-compose',
            ['up', '-d'], {
                env,
                shell: process.platform === 'win32',
                cwd: cmdPath,
            });
    } else {
        // const nodePath = process.env.SYNGRISI_TEST_SERVER_NODE_PATH || 'node';
        // const nodePath = 'c8';
        child = spawn('c8',
            ['node', 'server.js', `syngrisi_test_server_${cid}`], {
                env,
                shell: process.platform === 'win32',
                cwd: cmdPath,
            });
    }
    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (data) => {
        // stream.write(removeConsoleColors(data));
        stream.write(data);
        if (process.env.DBG === '1') {
            console.log(`SERVER_${cid}: ${data}`);
        }
    });

    child.stderr.setEncoding('utf8');

    child.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });

    browser.pause(2500);
    let timeoutMsg = '';
    browser.waitUntil(async () => {
        const response = got.get(`http://${browser.config.serverDomain}:`
            + `${cidPort}/v1/tasks/status`, { throwHttpErrors: false });
        // console.log({ response });
        const jsonResp = await response.json();
        console.log({ isAlive: jsonResp.alive });
        timeoutMsg = `Cannot connect to server,  statusCode: '${(await response).status}'`
            + `\n serverRespBody: '${(await response).body}'`;
        return (jsonResp.alive === true);
    }, { timeout: 10000, timeoutMsg });
    browser.pause(2500);
    console.log(`SERVER IS STARTED, PID: '${child.pid}' port: '${cidPort}'`);
    browser.syngrisiServer = child;
};

const stopServer = () => {
    try {
        let output;
        if (process.env.DOCKER === '1') {
            output = execSync('docker-compose stop')
                .toString();
        } else {
            output = execSync(`pkill -SIGINT -f syngrisi_test_server_${getCid()}`)
                .toString();
        }
    } catch (e) {
        console.log('WARNING: cannot stop te Syngrisi server');
        // console.log(e);
    }
};

const clearDatabase = (removeBaselines = true) => {
    const cmdPath = '../';
    let result;
    const taskNamePrefix = `${process.env.DOCKER === '1' ? 'docker_' : ''}`;
    if (removeBaselines) {
        result = execSync(`CID=${getCid()} npm run ${taskNamePrefix}clear_test`, { cwd: cmdPath })
            .toString('utf8');
    } else {
        result = execSync(`CID=${getCid()} npm run ${taskNamePrefix}clear_test_db_only`, { cwd: cmdPath })
            .toString('utf8');
    }

    console.log({ result });
};

const clearScreenshotsFolder = () => {
    const cmdPath = '../';
    const result = execSync(`CID=${getCid()} npm run clear_test_screenshots_only`, { cwd: cmdPath })
        .toString('utf8');
    console.log({ result });
};

const startDriver = (params) => {
    const drvOpts = YAML.parse(params) || {};
    browser.vDriver = new SyngrisiDriver({
        url: drvOpts.url || `http://${browser.config.serverDomain}:${browser.config.serverPort}/`,
        apiKey: browser.config.apiKey,
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
    getCid,
    clearScreenshotsFolder,
};
