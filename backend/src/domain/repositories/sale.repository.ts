import { SaleEntity } from '../entities/sale.entity';

export interface CreateSaleInput {
  customer: string;
  product: string;
  amount: number;
}

export interface SaleRepository {
  create(data: CreateSaleInput): Promise<SaleEntity>;
  findAll(): Promise<SaleEntity[]>;
  findById(id: string): Promise<SaleEntity | null>;
  updateScore(id: string, score: number): Promise<SaleEntity>;
}
