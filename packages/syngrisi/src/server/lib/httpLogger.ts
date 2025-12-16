import pinoLogger from 'pino-http';
import {config} from '@config';
import pino from 'pino';

const httpLogger = pinoLogger(
    {
        name: 'vrs',
        autoLogging: true,
        useLevel: 'info',
    },
    pino.destination(config.httpLoggerFilePath)
);

export default httpLogger;
