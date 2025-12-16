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

/**
 * Output writer for HTTP streaming (Server-Sent Events)
 * Writes output to an Express Response object
 */
export class HttpOutputWriter implements IOutputWriter {
    constructor(private res: Response) {
        this.res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Content-Encoding': 'none',
            'x-no-compression': 'true',
        });
    }

    write(message: string): void {
        this.res.write(`${message}\n`);
        log.debug(message);
    }

    flush(): void {
        if (typeof (this.res as any).flush === 'function') {
            (this.res as any).flush();
        }
    }

    end(): void {
        this.res.end();
    }
}

/**
 * Output writer for CLI execution
 * Writes output to console.log
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
