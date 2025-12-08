import logger from './logger'
import { LogLevelDesc } from 'loglevel';

const log = logger('syngrisi-wdio-sdk')
if (process.env.SYNGRISI_LOG_LEVEL) {
    log.setLevel(process.env.SYNGRISI_LOG_LEVEL as LogLevelDesc)
}

export const printErrorResponseBody = (e: any): void => {
    if (e.response && e.response?.body) {
        log.error(`ERROR RESPONSE BODY: ${e.response?.body}`)
    }
}

export const prettyCheckResult = (result: any): string => {
    if (!result.domDump) {
        return JSON.stringify(result)
    }
    const dump = JSON.parse(result.domDump)
    const resObs = { ...result }
    delete resObs.domDump
    resObs.domDump = `${JSON.stringify(dump)
        .substr(0, 20)}... and about ${dump.length} items]`
    return JSON.stringify(resObs)
}
