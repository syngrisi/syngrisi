/* eslint-disable @typescript-eslint/no-explicit-any */
import { Worker } from 'node:worker_threads';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { errMsg } from "@utils";
import log from "@logger";

const DEFAULT_OPTIONS = {
    output: {
        largeImageThreshold: 0,
        outputDiff: true,
        errorType: 'flat',
        errorColor: { red: 255, green: 0, blue: 255 },
        transparency: 0,
    },
    ignore: 'nothing',
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resolveWorkerScript = (): string | null => {
    const local = path.join(__dirname, 'imageDiffWorker.js');
    if (fs.existsSync(local)) return local;
    const bundled = path.join(process.cwd(), 'dist', 'server', 'lib', 'comparison', 'imageDiffWorker.js');
    if (fs.existsSync(bundled)) return bundled;
    return null;
};

const normalizeOptions = (options: any = {}) => {
    const mergedOutput = { ...DEFAULT_OPTIONS.output, ...(options.output || {}) };
    return {
        ...DEFAULT_OPTIONS,
        ...options,
        output: mergedOutput,
        ignoreRectangles: options.ignoredBoxes,
    };
};

const runDiffInWorker = (baselineOrigin: Buffer, actualOrigin: Buffer, options: any) => new Promise<any>((resolve, reject) => {
    const script = resolveWorkerScript();
    if (!script) throw new Error('Image diff worker script is missing');

    const worker = new Worker(script, {
        workerData: {
            baselineOrigin,
            actualOrigin,
            options: normalizeOptions(options),
        }
    });

    worker.on('message', (message: any) => {
        if (!message.ok) {
            reject(new Error(message.error || 'Image diff worker failed'));
            return;
        }
        const diff = message.result || {};
        if (message.diffBuffer) {
            const bufferCopy = Buffer.from(message.diffBuffer);
            diff.getBuffer = () => bufferCopy;
        }
        resolve(diff);
    });

    worker.on('error', (err) => {
        reject(err);
    });

    worker.on('exit', (code) => {
        if (code !== 0) {
            reject(new Error(`Image diff worker stopped with exit code ${code}`));
        }
    });
});

async function getDiff(baselineOrigin: any, actualOrigin: any, opts: any = {}): Promise<any> {
    const logOpts = {
        scope: 'getDiff',
        itemType: 'image',
        msgType: 'GET_DIFF',
    };
    try {
        const executionTimer = process.hrtime();

        log.debug(`SAMPLE #1: ${process.hrtime(executionTimer).toString()}`, logOpts);
        // Offload CPU-heavy diff work to a worker thread to avoid blocking the event loop.
        const directDiff = await runDiffInWorker(baselineOrigin, actualOrigin, opts);
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
