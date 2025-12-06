import { ErrorRequestHandler, RequestHandler } from 'express';
import { Request, Response } from "express";
import { env } from "@env";
import log from "@logger";
import { ApiError, HttpStatus } from '../utils';


const unexpectedRequest: RequestHandler = (req: Request, res: Response) => {
  res.status(HttpStatus.NOT_FOUND).json({ error: `url: '${req.originalUrl}' not found` });
};

const addErrorToRequestLog: ErrorRequestHandler = (err, _req, res, next) => {
  log.error(err);
  res.locals.err = err;
  if (env.NODE_ENV !== "production") {
    if (err instanceof ApiError) {
      return res.status(err.statusCode)
        .json({
          name: err.name,
          type: 'ApiError',
          message: err.message,
          status: err.statusCode,
          // sanitise stacktrace
          stacktrace: JSON.stringify(err.stack),
        });
    }
    else if(err instanceof Error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          name: err.name,
          type: 'Error',
          message: err.message,
          stacktrace: JSON.stringify(err.stack),
        });
    }
  }
  next(err);
};

export default () => [unexpectedRequest, addErrorToRequestLog];
