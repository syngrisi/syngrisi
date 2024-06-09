import { ErrorRequestHandler, RequestHandler } from 'express';
import httpStatus from 'http-status';


const unexpectedRequest: RequestHandler = (_req, res) => {
  res.sendStatus(httpStatus.NOT_FOUND);
};

const addErrorToRequestLog: ErrorRequestHandler = (err, _req, res, next) => {
  res.locals.err = err;
  next(err);
};

export default () => [unexpectedRequest, addErrorToRequestLog];
