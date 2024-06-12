import { ErrorRequestHandler, RequestHandler } from 'express';
import httpStatus from 'http-status';
import { Request, Response } from "express";
import { env } from "@env";
import log from "@logger";
import { ApiError } from '../utils';


const unexpectedRequest: RequestHandler = (req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({ error: `url: '${req.originalUrl}' not found` });
};

const addErrorToRequestLog: ErrorRequestHandler = (err, _req, res, next) => {
  log.error(err);
  res.locals.err = err;
  if (env.NODE_ENV !== "production") {
    if (err instanceof ApiError) {
      res.status(err.statusCode).json({
        name: err.name,
        message: err.message,
        status: err.statusCode,
        // sanitise stacktrace
        stacktrace: JSON.stringify(err.stack),
      });
    }
    else {
      next(err);
    }
  }
  next(err);
};

export default () => [unexpectedRequest, addErrorToRequestLog];
