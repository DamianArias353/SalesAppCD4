import { Sale } from '@prisma/client';
import { SaleEntity } from '../../../../domain/entities/sale.entity';

export const toSaleEntity = (sale: Sale): SaleEntity => ({
  id: sale.id,
  customer: sale.customer,
  product: sale.product,
  amount: sale.amount,
  score: sale.score,
  createdAt: sale.createdAt,
  updatedAt: sale.updatedAt
});
