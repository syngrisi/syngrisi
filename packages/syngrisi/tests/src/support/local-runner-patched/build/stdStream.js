"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
const utils_1 = require("./utils");
class RunnerStream extends stream_1.Transform {
    constructor() {
        super();
        this.on('pipe', () => {
            utils_1.removeLastListener(this, 'close');
            utils_1.removeLastListener(this, 'drain');
            utils_1.removeLastListener(this, 'error');
            utils_1.removeLastListener(this, 'finish');
            utils_1.removeLastListener(this, 'unpipe');
        });
    }
    _transform(chunk, encoding, callback) {
        callback(undefined, chunk);
    }
    _final(callback) {
        this.unpipe();
        callback();
    }
}
exports.default = RunnerStream;
