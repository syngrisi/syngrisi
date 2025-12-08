import { LogLevelDesc } from 'loglevel'

type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'silent'

const LOG_LEVELS: Record<LogLevel, number> = {
    trace: 0,
    debug: 1,
    info: 2,
    warn: 3,
    error: 4,
    silent: 5,
}

const LEVEL_COLORS: Record<LogLevel, string> = {
    trace: '\x1b[36m',
    debug: '\x1b[32m',
    info: '\x1b[96m',
    warn: '\x1b[33m',
    error: '\x1b[31m',
    silent: '',
}

const RESET = '\x1b[0m'

class SimpleLogger {
    private name: string
    private level: LogLevel = 'info'

    constructor(name: string) {
        this.name = name
    }

    setLevel(level: LogLevelDesc): void {
        const levelStr = typeof level === 'number' 
            ? (['trace', 'debug', 'info', 'warn', 'error', 'silent'] as LogLevel[])[level] || 'info'
            : level as LogLevel
        if (levelStr in LOG_LEVELS) {
            this.level = levelStr as LogLevel
        }
    }

    private shouldLog(level: LogLevel): boolean {
        return LOG_LEVELS[level] >= LOG_LEVELS[this.level]
    }

    private formatMessage(level: LogLevel, ...args: unknown[]): string {
        const timestamp = new Date().toISOString()
        const color = LEVEL_COLORS[level]
        const levelStr = level.toUpperCase().padEnd(5)
        const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' ')
        return `${color}${levelStr}${RESET} ${timestamp} ${this.name}: ${message}`
    }

    trace(...args: unknown[]): void {
        if (this.shouldLog('trace')) {
            console.log(this.formatMessage('trace', ...args))
        }
    }

    debug(...args: unknown[]): void {
        if (this.shouldLog('debug')) {
            console.log(this.formatMessage('debug', ...args))
        }
    }

    info(...args: unknown[]): void {
        if (this.shouldLog('info')) {
            console.log(this.formatMessage('info', ...args))
        }
    }

    warn(...args: unknown[]): void {
        if (this.shouldLog('warn')) {
            console.warn(this.formatMessage('warn', ...args))
        }
    }

    error(...args: unknown[]): void {
        if (this.shouldLog('error')) {
            console.error(this.formatMessage('error', ...args))
        }
    }
}

export default function logger(name: string): SimpleLogger {
    return new SimpleLogger(name)
}
