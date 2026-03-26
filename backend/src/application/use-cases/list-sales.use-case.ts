import { SaleRepository } from '../../domain/repositories/sale.repository';

export class ListSalesUseCase {
  constructor(private readonly saleRepository: SaleRepository) {}

  async execute() {
    return this.saleRepository.findAll();
  }
}
