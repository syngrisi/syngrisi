package io.syngrisi.coreapi

/**
 * Port of src/utils.ts — transformOs and errorObject helpers.
 */
class Utils {

    /**
     * Transforms a platform string to a standardized OS name.
     * Lowercases input, then maps known platforms; otherwise returns the
     * original (un-lowercased) input.
     */
    static String transformOs(String platform) {
        String lowercasePlatform = platform.toLowerCase()
        Map<String, String> transform = [
                win32    : 'WINDOWS',
                windows  : 'WINDOWS',
                macintel : 'macOS',
                'mac os' : 'macOS',
        ]
        return transform.containsKey(lowercasePlatform) ? transform[lowercasePlatform] : platform
    }

    /**
     * Builds an ErrorObject map from a throwable / HttpError.
     * Mirrors errorObject(e) in utils.ts:
     *   { error: true, errorMsg: e.toString(), statusCode?, statusMessage?, stack? }
     */
    static Map errorObject(Object e) {
        Map result = [
                error   : true,
                errorMsg: e?.toString(),
        ]

        Integer statusCode = null
        String statusMessage = null
        String stack = null

        if (e instanceof HttpError) {
            statusCode = (e as HttpError).statusCode
            statusMessage = (e as HttpError).statusMessage
            stack = stackTrace(e)
        } else if (e instanceof Throwable) {
            stack = stackTrace((Throwable) e)
        }

        result.statusCode = statusCode
        result.statusMessage = statusMessage
        result.stack = stack
        return result
    }

    private static String stackTrace(Throwable t) {
        StringWriter sw = new StringWriter()
        t.printStackTrace(new PrintWriter(sw))
        return sw.toString()
    }
}
