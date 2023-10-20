/// <reference types="node" />
import type { ChildProcess } from 'child_process';
import WDIORepl from './repl';
export default class ReplQueue {
    private _repls;
    runningRepl?: WDIORepl;
    add(childProcess: ChildProcess, options: any, onStart: Function, onEnd: Function): void;
    next(): void;
    get isRunning(): boolean;
}
//# sourceMappingURL=replQueue.d.ts.map