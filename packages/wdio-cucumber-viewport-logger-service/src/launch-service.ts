/* eslint-disable require-jsdoc */
import logger from '@wdio/logger';

const log = logger('wdio-cucumber-viewport-logger-service');

class LaunchService {
    // eslint-disable-next-line no-unused-vars,no-useless-constructor,no-empty-function
    constructor(serviceOptions?: any, capabilities?: any, config?: any) {
    }

    // eslint-disable-next-line no-unused-vars,class-methods-use-this
    async onPrepare(config?: any, capabilities?: any) {
        log.trace('onPrepare hook START');
        log.trace('onPrepare hook END');
    }
}

module.exports = LaunchService;
