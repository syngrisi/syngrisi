/* global log */
let compareImages;

const $this = this;
$this.logMeta = {
    scope: 'comparator',
    msgType: 'COMPARE',
};

if (process.env['COMPARE_METHOD'] === '2') {
    compareImages = require('resemblejs/compareImages');
} else {
    compareImages = require('./compareImagesNode');
}

const {
    rect,
    PngImage,
} = require('node-libpng');

const SHIFTING = {
    verticalShiftStablePixels: parseInt(process.env['V_SHIFTING'], 10) || 0,
};
const DEFAULT_OPTIONS = {
    output: {
        // errorType: 'movement', //flat | movement | flatDifferenceIntensity | movementDifferenceIntensity | diffOnly):
        largeImageThreshold: 0,
        outputDiff: true,
        errorType: 'flat',
        transparency: 0,
    },
    // scaleToSameSize: true,
    // isSameDimensions: false,
    // useOriginalSize: true,
    ignore: 'nothing', // nothing,less, antialiasing, colors, alpha
};

async function makeDiff(imgData1, imgData2, options = {}) {
    const opts = Object.assign(DEFAULT_OPTIONS, options);
    // The parameters can be Node Buffers
    // data is the same as usual with an additional getBuffer() function
    opts.ignoreRectangles = options.ignoredBoxes;
    const compareData = await compareImages(
        imgData1,
        imgData2,
        opts
    );
    return compareData;
}

async function compareWithStabilization(baselineOrigin, actualOrigin, method, opts) {
    try {
        const image1 = new PngImage(baselineOrigin.encode());
        const image2 = new PngImage(actualOrigin.encode());
        const diff = [];
        for (let i = 1; i <= SHIFTING.verticalShiftStablePixels; i++) {
            if (method === 'downup') {
                image1.crop(rect(0, 0, image1.width, (image1.height - i)));
                image2.crop(rect(0, i, image2.width, (image2.height - i)));
            }
            if (method === 'updown') {
                image1.crop(rect(0, i, image1.width, (image1.height - i)));
                image2.crop(rect(0, 0, image2.width, (image2.height - i)));
            }

            const result = await makeDiff(image1.encode(), image2.encode(), opts);

            result.stabMethod = method;
            result.vOffset = i;
            result.topStablePixels = SHIFTING.verticalShiftStablePixels;
            diff.push(result);
        }
        return diff;
    } catch (e) {
        const errMsg = `error in compareWithTopShifting: '${e}'`;
        log.debug(errMsg, $this);
        throw new Error(errMsg);
    }
}

async function getDiff(baselineOrigin, actualOrigin, opts = {}) {
    const logOpts = {
        scope: 'getDiff',
        itemType: 'image',
        msgType: 'GET_DIFF',
    };
    try {
        const executionTimer = process.hrtime();
        // direct comparison
        log.debug(`SAMPLE #1: ${process.hrtime(executionTimer)
            .toString()}`, $this, logOpts);

        const directDiff = await makeDiff(baselineOrigin, actualOrigin, opts);
        log.debug(`SAMPLE #2: ${process.hrtime(executionTimer)
            .toString()}`, $this, logOpts);

        directDiff.executionTotalTime = process.hrtime(executionTimer)
            .toString();

        if (directDiff.rawMisMatchPercentage.toString() === '0') {
            return directDiff;
        }
        // Compare/analyse with shifting
        let diffs = [directDiff];
        if (process.env['V_SHIFTING']) {
            /**
             * up/down shifting:
             *   eg.: baseline (right) image has top-margin: 0 and actual(wrong) - 1
             * down/up shifting
             *   eg.: baseline (right) image has top-margin: 1 and actual(wrong) - 2
             */
            diffs = [...diffs, ...(await compareWithStabilization(baselineOrigin, actualOrigin, 'updown', opts))];
            diffs = [...diffs, ...(await compareWithStabilization(baselineOrigin, actualOrigin, 'downup', opts))];
        }
        log.debug(`SAMPLE #3: ${process.hrtime(executionTimer)
            .toString()}`, $this, logOpts);

        const values = await Promise.all(diffs);
        console.table(values, ['stabMethod', 'vOffset', 'topStablePixels', 'rawMisMatchPercentage', 'analysisTime']);

        // search result with lowest misMatchPercentage
        const moreFittingResult = values.reduce((prev, current) => {
            return (prev.misMatchPercentage < current.misMatchPercentage) ? prev : current;
        });
        moreFittingResult.executionTotalTime = process.hrtime(executionTimer)
            .toString();
        log.debug(moreFittingResult, $this, logOpts);
        return moreFittingResult;
    } catch (e) {
        const errMsg = e.stack ? e.stack.split('\n') : e;
        log.error(errMsg, $this, logOpts);
        throw new Error(e);
    }
}

exports.getDiff = getDiff;
