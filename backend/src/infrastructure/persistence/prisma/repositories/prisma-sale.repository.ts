import { PrismaClient } from '@prisma/client';
import {
  CreateSaleInput,
  SaleRepository
} from '../../../../domain/repositories/sale.repository';
import { toSaleEntity } from '../mappers/sale.mapper';

export class PrismaSaleRepository implements SaleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateSaleInput) {
    const sale = await this.prisma.sale.create({
      data: {
        customer: data.customer,
        product: data.product,
        amount: data.amount,
        score: data.score ?? null
      }
    });

    return toSaleEntity(sale);
  }

  async findAll() {
    const sales = await this.prisma.sale.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return sales.map(toSaleEntity);
  }
}
