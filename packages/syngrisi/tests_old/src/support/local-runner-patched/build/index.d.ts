/// <reference types="webdriverio/webdriverio-core" />
/// <reference types="@wdio/cucumber-framework" />
import { WritableStreamBuffer } from 'stream-buffers';
import WorkerInstance from './worker';
import type { WorkerRunPayload } from './types';
interface RunArgs extends WorkerRunPayload {
    command: string;
    args: any;
}
export default class LocalRunner {
    config: WebdriverIO.Config;
    workerPool: Record<string, WorkerInstance>;
    stdout: WritableStreamBuffer;
    stderr: WritableStreamBuffer;
    constructor(configFile: string, config: WebdriverIO.Config);
    initialise(): void;
    getWorkerCount(): number;
    run({ command, args, ...workerOptions }: RunArgs): WorkerInstance;
    shutdown(): Promise<void>;
}
export {};
//# sourceMappingURL=index.d.ts.map