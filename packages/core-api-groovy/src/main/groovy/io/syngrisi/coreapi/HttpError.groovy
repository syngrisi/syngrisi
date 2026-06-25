package io.syngrisi.coreapi

/**
 * Error raised for non-2xx HTTP responses.
 * Analogous to got's HTTPError where e.response.statusCode / e.response.statusMessage
 * are available — here exposed directly as statusCode / statusMessage.
 */
class HttpError extends RuntimeException {
    final int statusCode
    final String statusMessage
    final String body

    HttpError(int statusCode, String statusMessage, String body) {
        super("Response code ${statusCode} (${statusMessage})".toString())
        this.statusCode = statusCode
        this.statusMessage = statusMessage
        this.body = body
    }
}
