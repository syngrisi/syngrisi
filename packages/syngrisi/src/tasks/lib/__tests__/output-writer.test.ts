import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'events';
import { HTTP_TASK_HEARTBEAT_MS, HttpOutputWriter } from '../output-writer';

class FakeResponse extends EventEmitter {
    headers: Record<string, string> = {};
    chunks: string[] = [];
    ended = false;
    writableEnded = false;

    writeHead(_code: number, headers: Record<string, string>) {
        this.headers = headers;
    }

    write(chunk: string) {
        this.chunks.push(chunk);
        return true;
    }

    end() {
        this.ended = true;
        this.writableEnded = true;
    }

    flush() {
        // no-op
    }
}

test('HttpOutputWriter sets streaming headers that disable proxy buffering', () => {
    const res = new FakeResponse() as any;
    const writer = new HttpOutputWriter(res, 0);
    assert.equal(res.headers['Content-Type'], 'text/event-stream');
    assert.equal(res.headers['X-Accel-Buffering'], 'no');
    assert.equal(res.headers['Content-Encoding'], 'identity');
    writer.end();
});

test('HttpOutputWriter writes messages and ends cleanly', () => {
    const res = new FakeResponse() as any;
    const writer = new HttpOutputWriter(res, 0);
    writer.write('hello');
    writer.write('world');
    writer.end();
    assert.deepEqual(res.chunks, ['hello\n', 'world\n']);
    assert.equal(res.ended, true);
});

test('HttpOutputWriter sends SSE comment heartbeats', async () => {
    const res = new FakeResponse() as any;
    const writer = new HttpOutputWriter(res, 20);
    await new Promise((r) => setTimeout(r, 55));
    writer.end();
    const heartbeats = res.chunks.filter((c: string) => c.startsWith(':'));
    assert.ok(heartbeats.length >= 2, `expected heartbeats, got ${JSON.stringify(res.chunks)}`);
    assert.ok(HTTP_TASK_HEARTBEAT_MS >= 1000);
});
