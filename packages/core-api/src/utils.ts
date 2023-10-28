import logger from '@wdio/logger'

const log = logger('wdio-syngrisi-cucumber-service')

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

export const errorObject = (e: any) => {
    return {
        error: true,
        errorMsg: e.toString(),
        statusCode: e.response?.statusCode,
        statusMessage: e.response?.statusMessage,
        stack: e.stack
    }
}

export const transformOs = (platform: string) => {
    const lowercasePlatform = platform.toLowerCase()
    const transform: {
        [key: string]: string
    } = {
        win32: 'WINDOWS',
        windows: 'WINDOWS',
        macintel: 'macOS',
        'mac os': 'macOS',
    }

    return transform[lowercasePlatform] || platform
}
