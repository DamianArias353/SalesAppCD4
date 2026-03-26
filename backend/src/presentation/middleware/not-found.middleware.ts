import { RequestHandler } from 'express';
import { NotFoundError } from '../../shared/errors/app.error';

export const notFoundMiddleware: RequestHandler = (req, _res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
};
