import { Router } from 'express';
import { HealthController } from '../controllers/health.controller';

export const createHealthRoutes = (healthController: HealthController) => {
  const router = Router();

  router.get('/', healthController.getStatus);

  return router;
};
