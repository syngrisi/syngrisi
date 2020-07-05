const compareImages = require('resemblejs/compareImages');
const resemble = require('resemblejs');
const fs = require("fs").promises;
const {rect, PngImage, decode, encode} = require("node-libpng");

const SHIFTING = {
    verticalShiftStablePixels: 1
}
const DEFAULT_OPTIONS = {
    output: {
        // errorType: 'movement', //flat | movement | flatDifferenceIntensity | movementDifferenceIntensity | diffOnly):
        largeImageThreshold: 0,
        outputDiff: true,
        errorType: "flat",
        transparency: 0,
    },
    // scaleToSameSize: true,
    // isSameDimensions: false,
    // useOriginalSize: true,
    ignore: 'antialiasing' // nothing,less, antialiasing, colors, alpha
};

function makeDiff(imgData1, imgData2, options = {}) {
    const opts = Object.assign(DEFAULT_OPTIONS, options)
    // The parameters can be Node Buffers
    // data is the same as usual with an additional getBuffer() function
    resemble.outputSettings({ignoredBoxes: options.ignoredBoxes})
    return compareImages(
        imgData1,
        imgData2,
        opts
    );
}

async function compareWithVerticalShifting(baselineOrigin, actualOrigin, method, opts) {
    return new Promise(async function (resolve, reject) {
        try {
            let image1 = new PngImage(baselineOrigin.encode())
            let image2 = new PngImage(actualOrigin.encode())
            let diff = []
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

                result.method = method;
                result.iteration = i;
                result.topStablePixels = SHIFTING.verticalShiftStablePixels;
                diff.push(result);
            }
            resolve(diff);
        } catch (e) {
            console.log(`Error in compareWithTopShifting: '${e}'`)
            return reject(e)
        }
    })
}

function getDiff(baselineBufferPromise, actualBufferPromise, opts = {}) {
    return new Promise(async function (resolve, reject) {
        try {
            const baselineOrigin = decode(await baselineBufferPromise);
            const actualOrigin = decode(await actualBufferPromise)

            let executionTimer = process.hrtime()
            // direct comparison
            const directDiff = await makeDiff(baselineOrigin.encode(), actualOrigin.encode(), opts);
            directDiff.executionTotalTime = process.hrtime(executionTimer).toString()
            console.log({directDiff})

            if (directDiff.rawMisMatchPercentage === 0.00)
                return resolve(directDiff)
            // Compare/analyse with shifting
            let diffs = [directDiff]
            /**
             * up/down shifting:
             *   eg.: baseline (right) image has top-margin: 0 and actual(wrong) - 1
             * down/up shifting
             *   eg.: baseline (right) image has top-margin: 1 and actual(wrong) - 2
             */
            diffs = [...diffs, ...(await compareWithVerticalShifting(baselineOrigin, actualOrigin, 'updown', opts))]
            diffs = [...diffs, ...(await compareWithVerticalShifting(baselineOrigin, actualOrigin, 'downup', opts))]

            Promise.all(diffs).then((values) => {
                console.table(values, ['method', 'iteration', 'topStablePixels', 'rawMisMatchPercentage', 'analysisTime'])
                // values.forEach(function (value, index) {
                //     fs.writeFile(`diff_${index}.png`, value.getBuffer(), () => {
                //         console.log('diff is written...');
                //     });
                // })

                // search result with lowest misMatchPercentage
                const moreFittingResult = values.reduce(function (prev, current) {
                    return (prev.misMatchPercentage < current.misMatchPercentage) ? prev : current
                });
                moreFittingResult.executionTotalTime = process.hrtime(executionTimer).toString()
                console.log({moreFittingResult})
                return resolve(moreFittingResult);
            })
        } catch (e) {
            console.log(`Error in getDiff: '${e}'`)
            return reject(e);
        }
    })
}

exports.getDiff = getDiff;
