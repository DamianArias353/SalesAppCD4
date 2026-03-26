import { RequestHandler } from 'express';
import { AnyZodObject, z } from 'zod';
import { ValidationError } from '../../shared/errors/app.error';

const parseWithSchema = <T extends AnyZodObject>(
  schema: T,
  payload: unknown
): z.infer<T> => {
  const result = schema.safeParse(payload);
  if (!result.success) {
    throw new ValidationError('Validation failed', result.error.issues);
  }

  return result.data;
};

export const validateBody = <T extends AnyZodObject>(schema: T): RequestHandler => {
  return (req, _res, next) => {
    try {
      req.body = parseWithSchema(schema, req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const validateParams = <T extends AnyZodObject>(
  schema: T
): RequestHandler => {
  return (req, _res, next) => {
    try {
      req.params = parseWithSchema(schema, req.params);
      next();
    } catch (error) {
      next(error);
    }
  };
};
