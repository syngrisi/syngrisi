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

        return directDiff;
    } catch (e) {
        const errMsg = e.stack ? e.stack.split('\n') : e;
        log.error(errMsg, $this, logOpts);
        throw new Error(e);
    }
}

exports.getDiff = getDiff;
