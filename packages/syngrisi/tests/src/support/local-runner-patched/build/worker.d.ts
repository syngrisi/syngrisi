/// <reference types="webdriverio/webdriverio-core" />
/// <reference types="@wdio/cucumber-framework" />
/// <reference types="webdriver" />
/// <reference types="node" />
import child from 'child_process';
import { EventEmitter } from 'events';
import type { WritableStreamBuffer } from 'stream-buffers';
import type { ChildProcess } from 'child_process';
import type { WorkerRunPayload } from './types';
export default class WorkerInstance extends EventEmitter {
    cid: string;
    config: WebdriverIO.Config;
    configFile: string;
    caps: WebDriver.Capabilities;
    specs: string[];
    execArgv: string[];
    retries: number;
    stdout: WritableStreamBuffer;
    stderr: WritableStreamBuffer;
    childProcess?: ChildProcess;
    sessionId?: string;
    server?: Record<string, any>;
    instances?: Record<string, {
        sessionId: string;
    }>;
    isMultiremote?: boolean;
    isBusy: boolean;
    constructor(config: WebdriverIO.Config, { cid, configFile, caps, specs, execArgv, retries }: WorkerRunPayload, stdout: WritableStreamBuffer, stderr: WritableStreamBuffer);
    startProcess(): child.ChildProcess;
    private _handleMessage;
    private _handleError;
    private _handleExit;
    postMessage(command: string, args: any): void;
}
//# sourceMappingURL=worker.d.ts.map