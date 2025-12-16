/* eslint-disable require-jsdoc */
import logger from '@wdio/logger';
import utils from './utils';

const log = logger('wdio-syngrisi-cucumber-service');

export default class SyngrisiLaunchService {
    // eslint-disable-next-line no-unused-vars,no-useless-constructor,no-empty-function
    constructor(serviceOptions, capabilities, config) {
    }

    // eslint-disable-next-line no-unused-vars,class-methods-use-this
    async onPrepare(config, capabilities) {
        log.trace('onPrepare hook START');
        // use env to share variables between this "launch" service and "worker" service
        log.debug('generate run name and ident');
        process.env.SYNGRISY_RUN_NAME = utils.generateRunName();
        process.env.SYNGRISY_RUN_INDENT = utils.generateRunIdent();
        log.debug(`runname: '${process.env.SYNGRISY_RUN_NAME}'`);
        log.debug(`runident: '${process.env.SYNGRISY_RUN_INDENT}'`);

        log.trace('onPrepare hook END');
    }
}
