/// <reference types="node" />
interface RunnerInterface extends NodeJS.EventEmitter {
    sigintWasCalled: boolean;
    [key: string]: any;
}
export declare const runner: RunnerInterface;
export declare const exitHookFn: (callback: () => void) => void;
export {};
//# sourceMappingURL=run.d.ts.map