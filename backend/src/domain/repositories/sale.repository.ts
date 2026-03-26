import { SaleEntity } from '../entities/sale.entity';

export interface CreateSaleInput {
  customer: string;
  product: string;
  amount: number;
  score?: number | null;
}

export interface SaleRepository {
  create(data: CreateSaleInput): Promise<SaleEntity>;
  findAll(): Promise<SaleEntity[]>;
}
