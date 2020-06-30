const compareImages = require('resemblejs/compareImages');
const resemble = require('resemblejs');

async function getDiff(imgData1, imgData2, options = {}) {
    const opts = Object.assign(defOptions, options)
    // The parameters can be Node Buffers
    // data is the same as usual with an additional getBuffer() function
    resemble.outputSettings({ignoredBoxes: options.ignoredBoxes})
    const diff = await compareImages(
        imgData1,
        imgData2,
        opts
    );
    return diff;
}

const defOptions = {
    output: {
        errorType: 'movement', //flat | movement | flatDifferenceIntensity | movementDifferenceIntensity | diffOnly):
        largeImageThreshold: 0,
        outputDiff: true
    },
    scaleToSameSize: false,
    ignore: 'alpha' // nothing,less, antialiasing, colors, alpha
};
exports.getDiff =  getDiff;
