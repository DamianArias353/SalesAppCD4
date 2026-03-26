import { RequestHandler } from 'express';
import { CreateSaleUseCase } from '../../application/use-cases/create-sale.use-case';
import { ListSalesUseCase } from '../../application/use-cases/list-sales.use-case';
import { createSaleSchema } from '../dto/sales/create-sale.dto';
import { toSaleResponseDto } from '../dto/sales/sale-response.dto';

export class SalesController {
  constructor(
    private readonly createSaleUseCase: CreateSaleUseCase,
    private readonly listSalesUseCase: ListSalesUseCase
  ) {}

  createSale: RequestHandler = async (req, res, next) => {
    try {
      const request = createSaleSchema.parse(req.body);
      const sale = await this.createSaleUseCase.execute(request);

      res.status(201).json({ data: toSaleResponseDto(sale) });
    } catch (error) {
      next(error);
    }
  };

  listSales: RequestHandler = async (_req, res, next) => {
    try {
      const sales = await this.listSalesUseCase.execute();
      res.status(200).json({ data: sales.map(toSaleResponseDto) });
    } catch (error) {
      next(error);
    }
  };
}
