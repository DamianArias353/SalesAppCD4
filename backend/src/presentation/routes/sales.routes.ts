import { Router } from 'express';
import { SalesController } from '../controllers/sales.controller';

export const createSalesRoutes = (salesController: SalesController) => {
  const router = Router();

  router.get('/', salesController.listSales);
  router.post('/', salesController.createSale);

  return router;
};
