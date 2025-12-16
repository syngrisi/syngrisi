/* eslint-disable require-jsdoc */
const logger  = require('@wdio/logger').default;
const log = logger('wdio-cucumber-viewport-logger-service');

class LaunchService {
    // eslint-disable-next-line no-unused-vars,no-useless-constructor,no-empty-function
    constructor(serviceOptions, capabilities, config) {
    }

    // eslint-disable-next-line no-unused-vars,class-methods-use-this
    async onPrepare(config, capabilities) {
        log.trace('onPrepare hook START');
        log.trace('onPrepare hook END');
    }
}

module.exports = LaunchService;
