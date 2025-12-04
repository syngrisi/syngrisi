#!/usr/bin/env node
import app from './app';
import v8 from 'v8';
import { config } from '@config';
import log from '@logger';
import chalk from 'chalk';
import connectDB from '@lib/connectDb';
import { createTempDir, createBasicUsers, createInitialSettings, createTestsUsers } from '@lib/startup';
import { autoCleanupSchedulers } from '@lib/schedulers/autoCleanupSchedulers';
import { runMigrations } from '@lib/migrations';
import { env } from '@env';
import { errMsg } from './utils';
import { appSettings } from '@settings';

const logMeta = { scope: 'entrypoint' };

log.info('Connect to database', logMeta);
connectDB().then(async () => {
    log.debug('run init jobs', logMeta);
    // const startUp = await import('@lib/startup');
    await appSettings.init();
    await runMigrations();
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
        // Skip schedulers in test mode unless explicitly enabled
        if (!config.testMode || env.SYNGRISI_ENABLE_SCHEDULERS_IN_TEST_MODE) {
            autoCleanupSchedulers.checks.start();
            autoCleanupSchedulers.logs.start();
        } else {
            log.debug('Skipping auto-cleanup schedulers in test mode', logMeta);
        }
    });


    // exit events
    const onCloseSignal = () => {
        log.info('sigint received, shutting down');
        if (!config.testMode || env.SYNGRISI_ENABLE_SCHEDULERS_IN_TEST_MODE) {
            autoCleanupSchedulers.checks.stop();
            autoCleanupSchedulers.logs.stop();
        }
        if (config.codeCoverage && env.SYNGRISI_V8_COVERAGE_ON_EXIT) {
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
