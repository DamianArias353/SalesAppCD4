import { Router } from 'express';
import { SalesController } from '../controllers/sales.controller';
import { createSaleSchema } from '../dto/sales/create-sale.dto';
import {
  evaluateSaleParamsSchema,
  evaluateSaleSchema
} from '../dto/sales/evaluate-sale.dto';
import {
  validateBody,
  validateParams
} from '../middleware/validation.middleware';

export const createSalesRoutes = (salesController: SalesController) => {
  const router = Router();

  router.get('/', salesController.listSales);
  router.post('/', validateBody(createSaleSchema), salesController.createSale);
  // NOTE: This URI came from an initial recommendation.
  // Following the REST argument for this assessment, `evaluate` is not a resource;
  // a cleaner URI could be `POST /sales/:id` since routes are already differentiated
  // by whether an `id` is present in the path.
  router.post(
    '/:id/evaluate',
    validateParams(evaluateSaleParamsSchema),
    validateBody(evaluateSaleSchema),
    salesController.evaluateSale
  );

  return router;
};
