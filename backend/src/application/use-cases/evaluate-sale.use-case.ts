import { SaleRepository } from '../../domain/repositories/sale.repository';
import { NotFoundError } from '../../shared/errors/app.error';

export interface EvaluateSaleInput {
  saleId: string;
  score: number;
}

export class EvaluateSaleUseCase {
  constructor(private readonly saleRepository: SaleRepository) {}

  async execute(input: EvaluateSaleInput) {
    const sale = await this.saleRepository.findById(input.saleId);

    if (!sale) {
      throw new NotFoundError(`Sale with id ${input.saleId} not found`);
    }

    return this.saleRepository.updateScore(input.saleId, input.score);
  }
}
