import { Response } from 'express';
import log from '@/server/lib/logger';

/**
 * Interface for output writing abstraction
 * Allows tasks to output messages regardless of execution context (HTTP/CLI)
 */
export interface IOutputWriter {
    /**
     * Write a message to the output
     * @param message - The message to write
     */
    write(message: string): void;

    /**
     * Flush any buffered output (optional, for streaming contexts)
     */
    flush?(): void;

    /**
     * End the output stream
     */
    end(): void;
}

/** Interval for SSE comment heartbeats that keep reverse proxies from timing out. */
export const HTTP_TASK_HEARTBEAT_MS = 15_000;

/**
 * Output writer for HTTP streaming (Server-Sent Events)
 * Writes output to an Express Response object
 */
export class HttpOutputWriter implements IOutputWriter {
    private heartbeatTimer: ReturnType<typeof setInterval> | null = null;

    constructor(
        private res: Response,
        private heartbeatMs: number = HTTP_TASK_HEARTBEAT_MS,
    ) {
        this.res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Content-Encoding': 'identity',
            // Disable nginx response buffering for this stream
            'X-Accel-Buffering': 'no',
            Connection: 'keep-alive',
        });
        this.startHeartbeat();
    }

    write(message: string): void {
        if (this.res.writableEnded) {
            return;
        }
        this.res.write(`${message}\n`);
        log.debug(message);
        this.flush();
    }

    flush(): void {
        if (typeof (this.res as any).flush === 'function') {
            (this.res as any).flush();
        }
    }

    end(): void {
        this.stopHeartbeat();
        if (!this.res.writableEnded) {
            this.res.end();
        }
    }

    private startHeartbeat(): void {
        if (this.heartbeatMs <= 0) {
            return;
        }
        this.heartbeatTimer = setInterval(() => {
            if (this.res.writableEnded) {
                this.stopHeartbeat();
                return;
            }
            // SSE comment — ignored by Task UI, resets proxy_read_timeout
            this.res.write(': \n\n');
            this.flush();
        }, this.heartbeatMs);
        // Do not keep the process alive solely for heartbeats
        this.heartbeatTimer.unref?.();
    }

    private stopHeartbeat(): void {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
    }
}

/**
 * Output writer for CLI execution
 * Writes to console.log
 */
export class ConsoleOutputWriter implements IOutputWriter {
    write(message: string): void {
        console.log(message);
    }

    end(): void {
        // Nothing to do for console output
    }
}

/**
 * Mock output writer for testing
 * Collects all messages in an array
 */
export class MockOutputWriter implements IOutputWriter {
    public messages: string[] = [];

    write(message: string): void {
        this.messages.push(message);
    }

    end(): void {
        // Nothing to do for mock
    }

    getOutput(): string {
        return this.messages.join('\n');
    }

    clear(): void {
        this.messages = [];
    }
}

/**
 * Output writer that logs to the server logger
 * Useful for scheduled/background tasks
 */
export class LoggerOutputWriter implements IOutputWriter {
    constructor(private scope = 'task') {}

    write(message: string): void {
        log.info(message, { scope: this.scope });
    }

    end(): void {
        // Nothing to do for logger output
    }
}
