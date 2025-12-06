/**
 * HTTP Status Codes - native replacement for 'http-status' package
 * Only includes codes actually used in the project
 */

export const HttpStatus = {
    // 2xx Success
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,

    // 4xx Client Errors
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,

    // 5xx Server Errors
    INTERNAL_SERVER_ERROR: 500,
} as const;

export type HttpStatusCode = typeof HttpStatus[keyof typeof HttpStatus];

export default HttpStatus;
