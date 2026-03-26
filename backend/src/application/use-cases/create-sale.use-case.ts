import {
  CreateSaleInput,
  SaleRepository
} from '../../domain/repositories/sale.repository';

export class CreateSaleUseCase {
  constructor(private readonly saleRepository: SaleRepository) {}

  async execute(input: CreateSaleInput) {
    return this.saleRepository.create(input);
  }
}
