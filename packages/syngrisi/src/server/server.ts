import 'source-map-support/register';
import app from './app';
import v8 from 'v8';
import { config } from '@config';
import log from '@logger';
import chalk from 'chalk';
import connectDB from '@lib/connectDb';
import { createTempDir, createBasicUsers, createInitialSettings, createTestsUsers } from '@lib/startup';
import { errMsg } from './utils';

const logMeta = { scope: 'entrypoint' };

log.info('Connect to database');
connectDB().then(async () => {
    log.debug('run init jobs', logMeta);
    // const startUp = await import('@lib/startup');
    createTempDir();
    await createBasicUsers();
    await createInitialSettings();
    if (config.testMode) await createTestsUsers();

    const server = app.listen(config.port, () => {
        log.info(
            chalk.green(`Syngrisi version: ${chalk.blue((config.version))} started at http://${config.host}:${config.port}`),
            logMeta
        );
        log.info(
            chalk.whiteBright('Press <Ctrl+C> to exit'), logMeta
        );
    });


    // exit events
    const onCloseSignal = () => {
        log.info('sigint received, shutting down');
        if (config.codeCoverage) {
            log.info('take coverage');
            v8.takeCoverage();
            v8.stopCoverage();
        }
        server.close(() => {
            log.info('server closed 👋');
            process.exit();
        });
        setTimeout(() => process.exit(1), 10000).unref(); // Force shutdown after 10s
    };

    process.on('SIGINT', onCloseSignal);
    process.on('SIGTERM', onCloseSignal);
}).catch(err => {
    log.error(`Could not connect to MongoDB: ${errMsg(err)} `);
    process.exit(1);
});

