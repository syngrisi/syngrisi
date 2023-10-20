const { default: logger } = require('@wdio/logger');

const log = logger('wdio-syngrisi-cucumber-service');

module.exports = {
    printErrorResponseBody: (e) => {
        if (e.response && e.response.body) {
            log.error(`ERROR RESPONSE BODY: ${e.response.body}`);
        }
    },
    prettyCheckResult: (result) => {
        if (!result.domDump) {
            return JSON.stringify(result);
        }
        const dump = JSON.parse(result.domDump);
        const resObs = { ...result };
        delete resObs.domDump;
        resObs.domDump = `${JSON.stringify(dump)
            .substr(0, 20)}... and about ${dump.length} items]`;
        return JSON.stringify(resObs);
    },
};
