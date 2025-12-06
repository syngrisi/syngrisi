import { parentPort } from 'worker_threads';
import { createRequire } from 'module';
import compareImages from './compareImagesNode';

// Even though this file will be executed via child_process.fork (CommonJS-like IPC),
// we keep ESM-friendly imports. parentPort is unused but imported to avoid tree-shake issues.
void parentPort;

export interface DiffRequest {
    id: string;
    baselineOrigin: Buffer;
    actualOrigin: Buffer;
    options: Record<string, unknown>;
}

const require = createRequire(import.meta.url);

let currentId: string | null = null;

const sendError = (id: string | null, error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    process.send?.({ id, ok: false, error: message });
};

process.on('message', async (payload: DiffRequest) => {
    if (!payload) return;
    const { id, baselineOrigin, actualOrigin, options } = payload;
    currentId = id;

    try {
        const baselineBuffer = Buffer.isBuffer(baselineOrigin) ? baselineOrigin : Buffer.from(baselineOrigin);
        const actualBuffer = Buffer.isBuffer(actualOrigin) ? actualOrigin : Buffer.from(actualOrigin);

        if (!baselineBuffer?.length || !actualBuffer?.length) {
            throw new Error('Input file is missing or empty');
        }

        const compareResult = await compareImages(baselineBuffer, actualBuffer, options);
        const diffBuffer = typeof compareResult?.getBuffer === 'function'
            ? await compareResult.getBuffer()
            : null;
        const plainResult: Record<string, unknown> = {};
        if (compareResult && typeof compareResult === 'object') {
            for (const [key, value] of Object.entries(compareResult)) {
                if (typeof value === 'function') continue;
                plainResult[key] = value;
            }
        }
        process.send?.({ id, ok: true, result: plainResult, diffBuffer });
        currentId = null;
    } catch (error) {
        sendError(id, error);
        currentId = null;
    }
});

process.on('uncaughtException', (error) => {
    sendError(currentId, error);
});

process.on('unhandledRejection', (reason) => {
    sendError(currentId, reason as unknown);
});

// Keep the process alive until explicitly killed by parent.
process.on('disconnect', () => {
    process.exit(0);
});
