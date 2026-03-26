import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { DomainError } from '../../domain/errors/domain.error';
import { AppError } from '../../shared/errors/app.error';

export const errorHandlerMiddleware: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next
) => {
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: {
        message: 'Validation failed',
        details: error.issues
      }
    });
  }

  if (error instanceof DomainError) {
    return res.status(400).json({
      error: {
        message: error.message
      }
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: {
        message: error.message,
        details: error.details
      }
    });
  }

  return res.status(500).json({
    error: {
      message: 'Internal server error'
    }
  });
};
