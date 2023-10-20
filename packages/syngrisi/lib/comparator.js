const $this = this;
$this.logMeta = {
    scope: 'comparator',
    msgType: 'COMPARE',
};

const {
    rect,
    PngImage,
} = require('node-libpng');
const compareImages = require('./compareImagesNode');

// if (process.env['COMPARE_METHOD'] === '2') {
//     compareImages = require('resemblejs/compareImages');
// } else {
//     compareImages = require('./compareImagesNode');
// }

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
    // noinspection UnnecessaryLocalVariableJS
    const compareData = await compareImages(
        imgData1,
        imgData2,
        opts
    );
    return compareData;
}

async function compareWithVerticalShiftingStabilization(baselineOrigin, actualOrigin, method, opts) {
    const logOpts = {
        scope: 'compareWithVerticalShiftingStabilization',
        itemType: 'image',
        msgType: 'GET_DIFF',
    };
    try {
        const image1 = new PngImage(baselineOrigin);
        const image2 = new PngImage(actualOrigin);
        const diff = [];
        const vShifting = parseInt(opts.vShifting, 10);
        for (let i = 1; i <= vShifting; i += 1) {
            if (method === 'downup') {
                image1.crop(rect(0, 0, image1.width, (image1.height - i)));
                image2.crop(rect(0, i, image2.width, (image2.height - i)));
            }
            if (method === 'updown') {
                image1.crop(rect(0, i, image1.width, (image1.height - i)));
                image2.crop(rect(0, 0, image2.width, (image2.height - i)));
            }

            // eslint-disable-next-line no-await-in-loop
            const result = await makeDiff(image1.encode(), image2.encode(), opts);

            result.stabMethod = method;
            result.vOffset = i;
            result.topStablePixels = vShifting;
            diff.push(result);
        }
        return diff;
    } catch (e) {
        const errMsg = `error in compareWithVerticalShiftingStabilization ${e}\n ${e?.stack}`;
        log.error(errMsg, $this, logOpts);
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

        log.debug(`SAMPLE #3: ${process.hrtime(executionTimer)
            .toString()}`, $this, logOpts);
        log.debug(`the diff is: ${JSON.stringify(directDiff, null, 4)}`, $this, logOpts);

        if (directDiff.rawMisMatchPercentage.toString() === '0'
            || !opts.vShifting
            || (opts.vShifting && parseInt(opts.vShifting, 10) < 1)) {
            return directDiff;
        }

        // compare/analyse with vertical shifting
        let diffs = [directDiff];
        /**
         * up/down shifting:
         *   e.g.: baseline (right) image has top-margin: 0 and actual(wrong) - 1
         * down/up shifting
         *   e.g.: baseline (right) image has top-margin: 1 and actual(wrong) - 2
         */
        diffs = [...diffs,
            ...(await compareWithVerticalShiftingStabilization(baselineOrigin, actualOrigin, 'updown', opts))];
        diffs = [...diffs,
            ...(await compareWithVerticalShiftingStabilization(baselineOrigin, actualOrigin, 'downup', opts))];
        log.debug(`SAMPLE #4 (vShifting): ${process.hrtime(executionTimer)
            .toString()}`, $this, logOpts);
        const values = await Promise.all(diffs);
        console.table(values, ['stabMethod', 'vOffset', 'topStablePixels', 'rawMisMatchPercentage', 'analysisTime']);

        // search result with lowest misMatchPercentage
        const moreFittingResult = values.reduce(
            (prev, current) => ((prev.misMatchPercentage < current.misMatchPercentage) ? prev : current)
        );
        moreFittingResult.executionTotalTime = process.hrtime(executionTimer)
            .toString();
        log.silly(`${JSON.stringify(moreFittingResult, null, '  ')}`, $this, logOpts);
        return moreFittingResult;
    } catch (e) {
        log.error(e.stack, $this, logOpts);
        throw new Error(e);
    }
}

exports.getDiff = getDiff;
