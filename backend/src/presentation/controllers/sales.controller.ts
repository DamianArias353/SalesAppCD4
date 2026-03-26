import { RequestHandler } from 'express';
import { CreateSaleUseCase } from '../../application/use-cases/create-sale.use-case';
import { EvaluateSaleUseCase } from '../../application/use-cases/evaluate-sale.use-case';
import { ListSalesUseCase } from '../../application/use-cases/list-sales.use-case';
import { CreateSaleRequestDto } from '../dto/sales/create-sale.dto';
import {
  EvaluateSaleParamsDto,
  EvaluateSaleRequestDto
} from '../dto/sales/evaluate-sale.dto';
import { toSaleResponseDto } from '../dto/sales/sale-response.dto';

export class SalesController {
  constructor(
    private readonly createSaleUseCase: CreateSaleUseCase,
    private readonly listSalesUseCase: ListSalesUseCase,
    private readonly evaluateSaleUseCase: EvaluateSaleUseCase
  ) {}

  createSale: RequestHandler = async (req, res, next) => {
    try {
      const request = req.body as CreateSaleRequestDto;
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

  evaluateSale: RequestHandler = async (req, res, next) => {
    try {
      const params = req.params as EvaluateSaleParamsDto;
      const body = req.body as EvaluateSaleRequestDto;
      const sale = await this.evaluateSaleUseCase.execute({
        saleId: params.id,
        score: body.score
      });

      res.status(200).json({ data: toSaleResponseDto(sale) });
    } catch (error) {
      next(error);
    }
  };
}
