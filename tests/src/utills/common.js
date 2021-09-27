// const moment = require('moment');
const ImageJS = require('imagejs');
const YAML = require('yaml');
const faker = require('faker');
const moment = require('moment');
const {
    format,
    subDays,
} = require('date-fns');

const saveRandomImage = async function saveRandomImage(fullPath) {
    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    const size = 30;
    return new Promise((resolve) => {
        const bitmap = new ImageJS.Bitmap({
            width: size,
            height: size
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
            const output = execSync(`npx kill-port ${port}`).toString();
            console.log({ output });
            return true;
        } catch (e) {
            console.log({ err: e.stdout.toString() });
        }
    }, {
        timeout: 40000,
    });
};

const startSession = async function (sessOpts) {
    sessOpts.suiteName = sessOpts.suiteName || 'Integration suite';
    sessOpts.suiteId = sessOpts.suiteId || sessOpts.suiteName.replace(' ', '_');
    sessOpts.appName = sessOpts.appName || 'Integration Test App';

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
    }, browser.config.apiKey);
};

const checkWithFile = async function () {
    browser.pause(300);
    const imageBuffer = fs.readFileSync(`${browser.config.rootPath}/${filePath}`);
    const checkResult = await checkVRS(checkName, imageBuffer);
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
        }
    );
};

module.exports = {
    saveRandomImage,
    startSession,
    fillCommonPlaceholders,
    killServer,
};
