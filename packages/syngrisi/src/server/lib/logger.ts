import winston, { Logger as WinstonLogger } from 'winston';
import 'winston-mongodb';
import chalk from 'chalk';
import formatISOToDateTime from '@utils/formatISOToDateTime';
import { config } from '@config';
import path from 'path';
import { LogOpts } from '@types';
import { ApiError } from '../utils';
import { env } from "@env";

const logLevel: string = env.SYNGRISI_LOG_LEVEL;

interface LoggerOptions {
    dbConnectionString: string;
}
function getScriptLine(): string {
    const stack = new Error().stack;

    if (stack) {
        const stackLines = stack.split('\n');
        let loggerLineIndex = -1;

        // last string contains 'lib/logger'
        for (let i = 0; i < stackLines.length; i++) {
            if (stackLines[i].includes('lib/logger')) {
                loggerLineIndex = i;
            }
        }

        // check string after 'lib/logger'
        const targetLineIndex = loggerLineIndex + 1;
        if (targetLineIndex >= 0 && targetLineIndex < stackLines.length) {
            const targetLine = stackLines[targetLineIndex];
            const match = targetLine.match(/at\s+(?:.+\s+\()?(.+):(\d+):(\d+)\)?/);
            if (match) {
                const scriptPath = match[1];
                const relativePath = path.relative(process.cwd(), scriptPath);
                const lineNumber = match[2];
                return `${relativePath}:${lineNumber}`;
            }
        }
    }
    return 'unknown';
}

function createWinstonLogger(opts: LoggerOptions): WinstonLogger {
    return winston.createLogger({
        transports: [
            new winston.transports.Console({
                level: logLevel || 'silly',
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.timestamp(),
                    winston.format.ms(),
                    winston.format.metadata(),
                    winston.format.printf((info) => {
                        const user = info.metadata.user ? chalk.blue(` <${info.metadata.user}>`) : '';
                        const ref = info.metadata.ref ? chalk.gray(` ${info.metadata.ref}`) : '';
                        const msgType = info.metadata.msgType ? ` ${info.metadata.msgType}` : '';
                        const itemType = info.metadata.itemType ? chalk.magenta(` ${info.metadata.itemType}`) : '';
                        const scope = info.metadata.scope ? chalk.magenta(` [${info.metadata.scope}] `) : chalk.magenta(` [${getScriptLine()}] `);
                        const msg = typeof info.message === 'object'
                            ? `\n${JSON.stringify(info.message, null, 2)}`
                            : info.message;

                        return `${info.level} ${scope}${formatISOToDateTime(info.metadata.timestamp)} `
                            + `${info.metadata.ms}${user}${ref}${msgType}${itemType} '${msg}'`;
                    }),
                    winston.format.padLevels(),
                ),
            }),
            new winston.transports.MongoDB({
                level: logLevel || 'debug',
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.json(),
                    winston.format.metadata(),
                ),
                options: {
                    useUnifiedTopology: true,
                },
                db: opts.dbConnectionString,
                collection: 'vrslogs',
            }),
        ],
    });
}

class Logger {
    private winstonLogger: WinstonLogger;

    constructor(opts: LoggerOptions = { dbConnectionString: config.connectionString }) {
        this.winstonLogger = createWinstonLogger(opts);
    }

    private static mergeMeta(objects: LogOpts[]): LogOpts {
        return objects.reduce((acc, obj) => {
            return { ...acc, ...obj };
        }, {});
    }

    private log(severity: string, msg: string | object, meta: LogOpts[]): void {
        const mergedMeta = Logger.mergeMeta(meta);
        if (!mergedMeta.scope) {
            mergedMeta.scope = getScriptLine();
        }
        const formattedMsg = typeof msg === 'object' ? JSON.stringify(msg, null, 2) : msg;
        this.winstonLogger.log(severity, formattedMsg, mergedMeta);
    }

    public error(msg: string | object | unknown, ...meta: LogOpts[]): void {
        let message: unknown = String(msg);
        let code = 0;
        if ((msg instanceof Object)) {
            message = JSON.stringify(msg);
        }
        if ((msg instanceof Error)) {
            message = msg.stack;
        }
        if ((msg instanceof ApiError)) {
            code = msg.statusCode;
        }
        this.log('error', `${code !== 0 ? '[' + code + ']' : ''}${message}\n stacktrace: ${new Error().stack}`, meta);
    }

    public warn(msg: string | object, ...meta: LogOpts[]): void {
        this.log('warn', `${msg}\n stacktrace: ${new Error().stack}`, meta);
    }

    public info(msg: string | object, ...meta: LogOpts[]): void {
        this.log('info', msg, meta);
    }

    public verbose(msg: string | object, ...meta: LogOpts[]): void {
        this.log('verbose', msg, meta);
    }

    public debug(msg: string | object, ...meta: LogOpts[]): void {
        this.log('debug', msg, meta);
    }

    public silly(msg: string | object, ...meta: LogOpts[]): void {
        this.log('silly', msg, meta);
    }
}

export default new Logger();
