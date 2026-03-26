import { SaleEntity } from '../../../domain/entities/sale.entity';

export interface SaleResponseDto {
  id: string;
  customer: string;
  product: string;
  amount: number;
  score: number | null;
  createdAt: string;
  updatedAt: string;
}

export const toSaleResponseDto = (sale: SaleEntity): SaleResponseDto => ({
  id: sale.id,
  customer: sale.customer,
  product: sale.product,
  amount: sale.amount,
  score: sale.score,
  createdAt: sale.createdAt.toISOString(),
  updatedAt: sale.updatedAt.toISOString()
});
