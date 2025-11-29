import { parentPort, workerData } from 'node:worker_threads';
import compareImages from './compareImagesNode';
import { getPngDimensions } from '../../utils/imageUtils';

const run = async () => {
    const { baselineOrigin, actualOrigin, options } = workerData as {
        baselineOrigin: Buffer;
        actualOrigin: Buffer;
        options: Record<string, unknown>;
    };

    try {
        // Perform heavy image diff work off the main thread.
        const compareResult = await compareImages(baselineOrigin, actualOrigin, options);
        const resultBuffer = typeof compareResult?.getBuffer === 'function'
            ? await compareResult.getBuffer()
            : null;

        // Functions are not structured-cloneable; remove all function props and send plain data plus buffer.
        const plainResult = Object.fromEntries(Object.entries(compareResult || {}).filter(([_, v]) => typeof v !== 'function'));

        try {
            (plainResult as any).baselineDimensions = getPngDimensions(baselineOrigin);
            (plainResult as any).actualDimensions = getPngDimensions(actualOrigin);
        } catch (e) {
            // ignore errors reading dimensions
        }

        parentPort?.postMessage({
            ok: true,
            result: plainResult,
            diffBuffer: resultBuffer,
        });
    } catch (error) {
        parentPort?.postMessage({
            ok: false,
            error: error instanceof Error ? error.message : String(error),
        });
    }
};

void run();
