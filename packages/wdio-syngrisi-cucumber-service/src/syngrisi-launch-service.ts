/* eslint-disable require-jsdoc */
import logger from '@wdio/logger';
import { generateRunName, generateRunIdent } from './utils';

const log = logger('wdio-syngrisi-cucumber-service');

export default class SyngrisiLaunchService {
    // eslint-disable-next-line no-unused-vars,no-useless-constructor,no-empty-function
    constructor(serviceOptions?: unknown, capabilities?: unknown, config?: unknown) {
    }

    // eslint-disable-next-line no-unused-vars,class-methods-use-this
    async onPrepare(config?: unknown, capabilities?: unknown) {
        log.trace('onPrepare hook START');
        // use env to share variables between this "launch" service and "worker" service
        log.debug('generate run name and ident');
        process.env.SYNGRISY_RUN_NAME = generateRunName();
        process.env.SYNGRISY_RUN_INDENT = generateRunIdent();
        log.debug(`runname: '${process.env.SYNGRISY_RUN_NAME}'`);
        log.debug(`runident: '${process.env.SYNGRISY_RUN_INDENT}'`);

        log.trace('onPrepare hook END');
    }
}
