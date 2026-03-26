import { Prisma, PrismaClient } from '@prisma/client';
import {
  CreateSaleInput,
  SaleRepository
} from '../../../../domain/repositories/sale.repository';
import { NotFoundError } from '../../../../shared/errors/app.error';
import { toSaleEntity } from '../mappers/sale.mapper';

export class PrismaSaleRepository implements SaleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateSaleInput) {
    const sale = await this.prisma.sale.create({
      data: {
        customer: data.customer,
        product: data.product,
        amount: data.amount,
        score: null
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

  async findById(id: string) {
    const sale = await this.prisma.sale.findUnique({
      where: { id }
    });

    return sale ? toSaleEntity(sale) : null;
  }

  async updateScore(id: string, score: number) {
    try {
      const sale = await this.prisma.sale.update({
        where: { id },
        data: { score }
      });

      return toSaleEntity(sale);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError(`Sale with id ${id} not found`);
      }

      throw error;
    }
  }
}
