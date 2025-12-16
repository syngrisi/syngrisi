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
      const errors = err.errors.map((e) => {
        const receivedValue = getReceivedValueFromRequest(
          { body: req.body, query: req.query, params: req.params },
          e.path
        );
        return `\nError path: '${e.path.join('.')}': \nError ${e.message}, but received ${JSON.stringify(receivedValue)}`;
      }).join(', ');

      const errorMessage = ` ${endpoint ? '\nValidation error in the endpoint: "' + endpoint + '"' : ''}`
        + `${errors}, \nHTTP PROPERTIES:\n\tbody: ${JSON.stringify(req.body, null, '\t')}, `
        +`\n\tquery: ${JSON.stringify(req.query, null, '\t')}, \n\tparams: ${JSON.stringify(req.params, null, '\t')}`;

      const statusCode = StatusCodes.BAD_REQUEST;
      log.error(errorMessage, logOpts);
      res.status(statusCode).send(new ServiceResponse<null>(ResponseStatus.Failed, errorMessage, null, statusCode));
    } else {
      log.error(`Unexpected error: ${errMsg(err)}`, logOpts);
      next(err);
    }
  }
};
