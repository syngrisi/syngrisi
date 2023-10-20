"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("@wdio/logger"));
const stream_buffers_1 = require("stream-buffers");
const worker_1 = __importDefault(require("./worker"));
const constants_1 = require("./constants");
const log = logger_1.default('@wdio/local-runner');
class LocalRunner {
    constructor(configFile, config) {
        this.workerPool = {};
        this.stdout = new stream_buffers_1.WritableStreamBuffer(constants_1.BUFFER_OPTIONS);
        this.stderr = new stream_buffers_1.WritableStreamBuffer(constants_1.BUFFER_OPTIONS);
        this.config = config;
    }
    initialise() { }
    getWorkerCount() {
        return Object.keys(this.workerPool).length;
    }
    run({ command, args, ...workerOptions }) {
        const workerCnt = this.getWorkerCount();
        if (workerCnt >= process.stdout.getMaxListeners() - 2) {
            process.stdout.setMaxListeners(workerCnt + 2);
            process.stderr.setMaxListeners(workerCnt + 2);
        }
        const worker = new worker_1.default(this.config, workerOptions, this.stdout, this.stderr);
        this.workerPool[workerOptions.cid] = worker;
        worker.postMessage(command, args);
        return worker;
    }
    shutdown() {
        log.info('Shutting down spawned worker');
        for (const [cid, worker] of Object.entries(this.workerPool)) {
            const { caps, server, sessionId, config, isMultiremote, instances } = worker;
            let payload = {};
            if (config && config.watch && (sessionId || isMultiremote)) {
                payload = {
                    config: { ...server, sessionId },
                    caps,
                    watch: true,
                    isMultiremote,
                    instances
                };
            }
            else if (!worker.isBusy) {
                delete this.workerPool[cid];
                continue;
            }
            worker.postMessage('endSession', payload);
        }
        return new Promise((resolve) => {
            const timeout = setTimeout(resolve, constants_1.SHUTDOWN_TIMEOUT);
            const interval = setInterval(() => {
                const busyWorker = Object.entries(this.workerPool)
                    .filter(([, worker]) => worker.isBusy).length;
                log.info(`Waiting for ${busyWorker} to shut down gracefully`);
                if (busyWorker === 0) {
                    clearTimeout(timeout);
                    clearInterval(interval);
                    log.info('shutting down');
                    return resolve();
                }
            }, 250);
        });
    }
}
exports.default = LocalRunner;
