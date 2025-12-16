import winston, { Logger as WinstonLogger } from 'winston';
import 'winston-mongodb';
import { colors } from '@utils/colors';
import formatISOToDateTime from '@utils/formatISOToDateTime';
import { config } from '@config';
import { LogOpts } from '@types';
import { ApiError } from '../utils';
import { env } from "@env";

const logLevel: string = env.SYNGRISI_LOG_LEVEL;

interface LoggerOptions {
    dbConnectionString: string;
}
function createWinstonLogger(opts: LoggerOptions): WinstonLogger {
    const transports: winston.transport[] = [
        new winston.transports.Console({
            level: logLevel || 'silly',
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp(),
                winston.format.ms(),
                winston.format.metadata(),
                winston.format.printf((info: any) => {
                    const user = info.metadata.user ? colors.blue(` <${info.metadata.user}>`) : '';
                    const ref = info.metadata.ref ? colors.gray(` ${info.metadata.ref}`) : '';
                    const msgType = info.metadata.msgType ? ` ${info.metadata.msgType}` : '';
                    const itemType = info.metadata.itemType ? colors.magenta(` ${info.metadata.itemType}`) : '';
                    const scope = info.metadata.scope ? colors.magenta(` [${info.metadata.scope}]`) : '';
                    const msg = typeof info.message === 'object'
                        ? `\n${JSON.stringify(info.message, null, 2)}`
                        : info.message;

                    return `${info.level} ${scope}${formatISOToDateTime(info.metadata.timestamp)} `
                        + `${info.metadata.ms}${user}${ref}${msgType}${itemType} '${msg}'`;
                }),
                winston.format.padLevels(),
            ),
        }),
    ];

    // Skip Mongo transport in test mode to avoid polluting vrslogs with framework diagnostics
    if (!env.SYNGRISI_TEST_MODE) {
        transports.push(
            new winston.transports.MongoDB({
                level: logLevel || 'debug',
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.json(),
                    winston.format.metadata(),
                ),
                options: {
                },
                db: opts.dbConnectionString,
                collection: 'vrslogs',
            }),
        );
    }

    return winston.createLogger({ transports });
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

    private static sanitizeForLog(obj: any): any {
        try {
            return JSON.parse(JSON.stringify(obj));
        } catch (e) {
            return String(obj);
        }
    }

    private log(severity: string, msg: string | object, meta: LogOpts[]): void {
        const mergedMeta = Logger.sanitizeForLog(Logger.mergeMeta(meta));
        const formattedMsg = typeof msg === 'object' ? JSON.stringify(msg, null, 2) : msg;
        this.winstonLogger.log(severity, formattedMsg, mergedMeta);
    }

    public error(msg: string | object | unknown, ...meta: LogOpts[]): void {
        let message: unknown = String(msg);
        let code = 0;
        if ((msg instanceof Object)) {
            try {
                // Try to sanitize first to avoid BSON errors during stringify
                message = JSON.stringify(Logger.sanitizeForLog(msg));
            } catch (e) {
                message = String(msg);
            }
        }
        if ((msg instanceof Error)) {
            message = msg.stack || msg.message;
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
