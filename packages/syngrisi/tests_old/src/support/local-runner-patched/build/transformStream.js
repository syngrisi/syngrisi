"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
const constants_1 = require("./constants");
class RunnerTransformStream extends stream_1.Transform {
    constructor(cid) {
        super();
        this.cid = cid;
    }
    _transform(chunk, encoding, callback) {
        const logMsg = chunk.toString();
        if (constants_1.DEBUGGER_MESSAGES.some(m => logMsg.startsWith(m))) {
            return callback();
        }
        this.push(`[${this.cid}] ${logMsg}`);
        callback();
    }
    _final(callback) {
        this.unpipe();
        callback();
    }
}
exports.default = RunnerTransformStream;
