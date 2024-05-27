/* eslint-disable @typescript-eslint/no-explicit-any */

import log2 from "../logger2";
import compareImages from './compareImagesNode';

const fileLogMeta = {
    scope: 'comparator',
    msgType: 'COMPARE',
};

const DEFAULT_OPTIONS = {
    output: {
        largeImageThreshold: 0,
        outputDiff: true,
        errorType: 'flat',
        transparency: 0,
    },
    ignore: 'nothing',
};

async function makeDiff(imgData1: any, imgData2: any, options: any = {}): Promise<any> {
    const opts = Object.assign(DEFAULT_OPTIONS, options);
    opts.ignoreRectangles = options.ignoredBoxes;
    const compareData = await compareImages(imgData1, imgData2, opts);
    return compareData;
}

async function getDiff(baselineOrigin: any, actualOrigin: any, opts: any = {}): Promise<any> {
    const logOpts = {
        scope: 'getDiff',
        itemType: 'image',
        msgType: 'GET_DIFF',
    };
    try {
        const executionTimer = process.hrtime();

        log2.debug(`SAMPLE #1: ${process.hrtime(executionTimer).toString()}`, fileLogMeta, logOpts);

        const directDiff = await makeDiff(baselineOrigin, actualOrigin, opts);
        log2.debug(`SAMPLE #2: ${process.hrtime(executionTimer).toString()}`, fileLogMeta, logOpts);

        directDiff.executionTotalTime = process.hrtime(executionTimer).toString();

        log2.debug(`SAMPLE #3: ${process.hrtime(executionTimer).toString()}`, fileLogMeta, logOpts);
        log2.debug(`the diff is: ${JSON.stringify(directDiff, null, 4)}`, fileLogMeta, logOpts);

        return directDiff;
    } catch (e: any) {
        log2.error(e.stack || e.toString(), fileLogMeta, logOpts);
        throw new Error(e);
    }
}

export { getDiff };
