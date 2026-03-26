import { Router } from 'express';
import { HealthController } from '../controllers/health.controller';
import { SalesController } from '../controllers/sales.controller';
import { createHealthRoutes } from './health.routes';
import { createSalesRoutes } from './sales.routes';

export interface PresentationControllers {
  healthController: HealthController;
  salesController: SalesController;
}

export const registerRoutes = (controllers: PresentationControllers) => {
  const router = Router();

  router.use('/health', createHealthRoutes(controllers.healthController));
  router.use('/sales', createSalesRoutes(controllers.salesController));

  return router;
};
