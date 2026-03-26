import cors from 'cors';
import express from 'express';
import { env } from './config/env';
import { errorHandlerMiddleware } from './presentation/middleware/error-handler.middleware';
import { notFoundMiddleware } from './presentation/middleware/not-found.middleware';
import {
  type PresentationControllers,
  registerRoutes
} from './presentation/routes';

export const createApp = (controllers: PresentationControllers) => {
  const app = express();

  app.use(
    cors({
      origin: env.FRONTEND_ORIGIN
    })
  );
  app.use(express.json());

  app.use(registerRoutes(controllers));
  app.use('/api', registerRoutes(controllers));

  app.use(notFoundMiddleware);
  app.use(errorHandlerMiddleware);

  return app;
};
