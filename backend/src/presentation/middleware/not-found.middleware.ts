import { RequestHandler } from 'express';
import { AppError } from '../../shared/errors/app.error';

export const notFoundMiddleware: RequestHandler = (req, _res, next) => {
  next(new AppError(404, `Route ${req.method} ${req.originalUrl} not found`));
};
