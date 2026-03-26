import { CreateSaleUseCase } from '../../application/use-cases/create-sale.use-case';
import { HealthCheckUseCase } from '../../application/use-cases/health-check.use-case';
import { ListSalesUseCase } from '../../application/use-cases/list-sales.use-case';
import { HealthController } from '../../presentation/controllers/health.controller';
import { SalesController } from '../../presentation/controllers/sales.controller';
import { PresentationControllers } from '../../presentation/routes';
import { createPrismaClient } from '../persistence/prisma/prisma.client';
import { PrismaSaleRepository } from '../persistence/prisma/repositories/prisma-sale.repository';

export interface AppContainer {
  prisma: ReturnType<typeof createPrismaClient>;
  controllers: PresentationControllers;
}

export const buildContainer = (): AppContainer => {
  const prisma = createPrismaClient();

  const saleRepository = new PrismaSaleRepository(prisma);

  const healthCheckUseCase = new HealthCheckUseCase();
  const createSaleUseCase = new CreateSaleUseCase(saleRepository);
  const listSalesUseCase = new ListSalesUseCase(saleRepository);

  const healthController = new HealthController(healthCheckUseCase);
  const salesController = new SalesController(createSaleUseCase, listSalesUseCase);

  return {
    prisma,
    controllers: {
      healthController,
      salesController
    }
  };
};
