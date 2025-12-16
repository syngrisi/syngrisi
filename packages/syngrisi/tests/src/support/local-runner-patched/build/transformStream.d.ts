/// <reference types="node" />
import { Transform, TransformCallback } from 'stream';
export default class RunnerTransformStream extends Transform {
    cid: string;
    constructor(cid: string);
    _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback): void;
    _final(callback: (error?: Error | null) => void): void;
}
//# sourceMappingURL=transformStream.d.ts.map