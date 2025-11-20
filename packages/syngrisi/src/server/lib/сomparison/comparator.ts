/* eslint-disable @typescript-eslint/no-explicit-any */
import { fork, ChildProcess } from 'node:child_process';
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

const resolveProcessScript = (): string | null => {
    const local = path.join(__dirname, 'imageDiffProcess.js');
    if (fs.existsSync(local)) return local;
    const bundled = path.join(process.cwd(), 'dist', 'server', 'lib', 'сomparison', 'imageDiffProcess.js');
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

const runDiffInProcess = (baselineOrigin: Buffer, actualOrigin: Buffer, options: any) => new Promise<any>((resolve, reject) => {
    const script = resolveProcessScript();
    if (!script) throw new Error('Image diff process script is missing');

    const proc: ChildProcess = fork(script, [], { stdio: ['inherit', 'inherit', 'inherit', 'ipc'] });
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    const payload = {
        id,
        baselineOrigin,
        actualOrigin,
        options: normalizeOptions(options),
    };

    let settled = false;
    const cleanup = () => {
        proc.removeAllListeners();
        if (proc.connected) proc.disconnect();
    };

    proc.on('message', (message: any) => {
        if (message?.id !== id) return;
        settled = true;
        if (!message.ok) {
            cleanup();
            reject(new Error(message?.error || 'Image diff process failed'));
            return;
        }
        const diff = message.result || {};
        if (message.diffBuffer) {
            const bufferCopy = Buffer.from(message.diffBuffer);
            diff.getBuffer = () => bufferCopy;
        }
        cleanup();
        resolve(diff);
    });

    proc.on('exit', (code) => {
        if (settled) return;
        cleanup();
        reject(new Error(`Image diff process exited with code ${code}`));
    });

    proc.on('error', (err) => {
        if (settled) return;
        cleanup();
        reject(err);
    });

    proc.send(payload);
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
        // Offload CPU-heavy diff work to a child process to avoid blocking the event loop.
        const directDiff = await runDiffInProcess(baselineOrigin, actualOrigin, opts);
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
