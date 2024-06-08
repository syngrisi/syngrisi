/* eslint-disable @typescript-eslint/no-explicit-any */
import { errMsg } from "@utils";
import log from "../logger";
import compareImages from './compareImagesNode';

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

        log.debug(`SAMPLE #1: ${process.hrtime(executionTimer).toString()}`, logOpts);

        const directDiff = await makeDiff(baselineOrigin, actualOrigin, opts);
        log.debug(`SAMPLE #2: ${process.hrtime(executionTimer).toString()}`, logOpts);

        directDiff.executionTotalTime = process.hrtime(executionTimer).toString();

        log.debug(`SAMPLE #3: ${process.hrtime(executionTimer).toString()}`, logOpts);
        log.debug(`the diff is: ${JSON.stringify(directDiff, null, 4)}`, logOpts);

        return directDiff;
    } catch (e: unknown) {
        log.error(errMsg(e), logOpts);
        throw new Error(errMsg(e));
    }
}

export { getDiff };
