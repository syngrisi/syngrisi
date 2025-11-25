import { NextFunction, Request, Response } from 'express';
import StatusCodes from 'http-status';
import { ZodError, ZodSchema } from 'zod';
import { ResponseStatus, ServiceResponse } from './ServiceResponse';
import log from '@logger';
import { LogOpts } from '@root/src/types';
import { errMsg } from './errMsg';

const logOpts: LogOpts = {
  scope: 'validateRequests',
  itemType: 'type',
  msgType: 'VALIDATION',
};

const sensitiveKeys = new Set(['password', 'currentpassword', 'newpassword', 'apikey']);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sanitizeValueForLogging = (value: any): any => {
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValueForLogging(item));
  }
  if (value && typeof value === 'object') {
    return Object.entries(value).reduce((acc, [key, val]) => {
      if (sensitiveKeys.has(key.toLowerCase())) {
        acc[key] = '[REDACTED]';
      } else {
        acc[key] = sanitizeValueForLogging(val);
      }
      return acc;
    }, Array.isArray(value) ? [] : {} as Record<string, unknown>);
  }
  return value;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getReceivedValueFromRequest(request: { body: any; query: any; params: any }, path: (string | number)[]): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let currentValue: any = request;
  path.forEach(segment => {
    currentValue = currentValue[segment];
  });
  return currentValue;
}

export const validateRequest = (schema: ZodSchema, endpoint = '') => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params
    });
    next();
  } catch (err) {

    if (err instanceof ZodError) {
      log.error(`ZodError caught: ${JSON.stringify(err)}`, logOpts);
      if (!err.errors) {
        log.error(`ZodError has no errors property! Keys: ${Object.keys(err)}`, logOpts);
      }
      const sanitizedBody = sanitizeValueForLogging(req.body);
      const sanitizedQuery = sanitizeValueForLogging(req.query);
      const sanitizedParams = sanitizeValueForLogging(req.params);
      const zodErrors = err.errors || (err as any).issues || [];
      const errors = zodErrors.map((e: any) => {
        const receivedValue = getReceivedValueFromRequest(
          { body: sanitizedBody, query: sanitizedQuery, params: sanitizedParams },
          e.path
        );
        return `\nError path: '${e.path.join('.')}': \nError ${e.message}, but received ${JSON.stringify(receivedValue)}`;
      }).join(', ');

      const errorMessage = ` ${endpoint ? '\nValidation error in the endpoint: "' + endpoint + '"' : ''}`
        + `${errors}, \nHTTP PROPERTIES:\n\tbody: ${JSON.stringify(sanitizedBody, null, '\t')}, `
        + `\n\tquery: ${JSON.stringify(sanitizedQuery, null, '\t')}, \n\tparams: ${JSON.stringify(sanitizedParams, null, '\t')}`;

      const statusCode = StatusCodes.BAD_REQUEST;
      log.error(errorMessage, logOpts);
      res.status(statusCode).send(new ServiceResponse<null>(ResponseStatus.Failed, errorMessage, null, statusCode));
    } else {
      log.error(`Unexpected error: ${errMsg(err)}`, logOpts);
      next(err);
    }
  }
};
