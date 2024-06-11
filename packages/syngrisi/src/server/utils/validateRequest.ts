import { NextFunction, Request, Response } from 'express';
import StatusCodes from 'http-status';
import { ZodError, ZodSchema } from 'zod';
import { ResponseStatus, ServiceResponse } from './ServiceResponse';
import log from '@logger';
import { LogOpts } from '@root/src/types';

const logOpts: LogOpts = {
  scope: 'validateRequests',
  itemType: 'type',
  msgType: 'VALIDATION',
};
// import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';

// export const handleServiceResponse = (serviceResponse: ServiceResponse<any>, response: Response) => {
//   return response.status(serviceResponse.statusCode).send(serviceResponse);
// };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getReceivedValueFromRequest(request: { body: any; query: any; params: any }, path: (string | number)[]): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let currentValue: any = request;
  path.forEach(segment => {
    currentValue = currentValue[segment];
  });
  return currentValue;
}

export const validateRequest = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
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
        return `${e.path.join('.')}: Expected ${e.message}, but received ${JSON.stringify(receivedValue)}`;
      }).join(', ');

      const errorMessage = `Validation failed: ${errors}, \nbody: ${JSON.stringify(req.body)}, \nquery: ${JSON.stringify(req.query)}, \nparams: ${JSON.stringify(req.params)}`;
      const statusCode = StatusCodes.BAD_REQUEST;
      log.error(errorMessage, logOpts);
      res.status(statusCode).send(new ServiceResponse<null>(ResponseStatus.Failed, errorMessage, null, statusCode));
    } else {
      next(err);
    }
  }
};
