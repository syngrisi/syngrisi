import logger from '@wdio/logger'
import { ZodObject } from 'zod'

const log = logger('syngrisi-core-api')

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

export interface ErrorObject {
    error: boolean;
    errorMsg: string;
    statusCode?: number; // statusCode is optional because it may not be present if e.response is undefined
    statusMessage?: string; // statusMessage is optional for the same reason as statusCode
    stack?: string; // stack is optional as it may not be present on all error objects
}

export const errorObject = (e: any): ErrorObject => {
    return {
        error: true,
        errorMsg: e.toString(),
        statusCode: e.response?.statusCode,
        statusMessage: e.response?.statusMessage,
        stack: e.stack
    }
}

/**
 * Transforms a given platform string to a standardized operating system name.
 *
 * This function takes a platform identifier string, converts it to lowercase,
 * and then looks up a normalized operating system name from a predefined
 * mapping. If the platform identifier doesn't match any of the predefined
 * keys, it returns the original platform string.
 *
 * @param {string} platform - The platform string to transform.
 * @returns {string} The standardized operating system name or the original
 *                   platform string if no match is found in the transformation mapping.
 * @example
 * // returns 'WINDOWS'
 * transformOs('win32');
 *
 * @example
 * // returns 'macOS'
 * transformOs('macintel');
 *
 * @example
 * // returns 'macOS'
 * transformOs('mac os');
 *
 * @example
 * // returns 'linux'
 * transformOs('linux'); // 'linux' is not in the transform mapping, so returns input 'linux'
 */
export const transformOs = (platform: string) => {
    const lowercasePlatform = platform.toLowerCase();
    const transform: {
        [key: string]: string;
    } = {
        win32: 'WINDOWS',
        windows: 'WINDOWS',
        macintel: 'macOS',
        'mac os': 'macOS',
    };

    return transform[lowercasePlatform] || platform;
};


export const paramsGuard = (params: any, functionName: string, schema: ZodObject<any>) => {
    const result = schema.safeParse(params)
    if (result.success) {
        return true
    } else {
        const errorDetails = result.error.format()
        throw new Error(`
        Invalid '${functionName}' parameters: \n${JSON.stringify(errorDetails, null, 2)}
        \n error: ${result.error?.stack || result.error}
        \n params: ${JSON.stringify(params, null, 2)}
        `)
    }
}
