import request from 'supertest';
import { randomUUID } from 'node:crypto';
import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../src/app';
import { CreateSaleUseCase } from '../../src/application/use-cases/create-sale.use-case';
import { EvaluateSaleUseCase } from '../../src/application/use-cases/evaluate-sale.use-case';
import { HealthCheckUseCase } from '../../src/application/use-cases/health-check.use-case';
import { ListSalesUseCase } from '../../src/application/use-cases/list-sales.use-case';
import { SaleEntity } from '../../src/domain/entities/sale.entity';
import {
  CreateSaleInput,
  SaleRepository
} from '../../src/domain/repositories/sale.repository';
import { HealthController } from '../../src/presentation/controllers/health.controller';
import { SalesController } from '../../src/presentation/controllers/sales.controller';
import { type PresentationControllers } from '../../src/presentation/routes';
import { NotFoundError } from '../../src/shared/errors/app.error';

class InMemorySaleRepository implements SaleRepository {
  private sales: SaleEntity[] = [];

  reset() {
    this.sales = [];
  }

  async create(data: CreateSaleInput) {
    const now = new Date();
    const sale: SaleEntity = {
      id: randomUUID(),
      customer: data.customer,
      product: data.product,
      amount: data.amount,
      score: null,
      createdAt: now,
      updatedAt: now
    };

    this.sales.push(sale);

    return sale;
  }

  async findAll() {
    return [...this.sales];
  }

  async findById(id: string) {
    return this.sales.find((sale) => sale.id === id) ?? null;
  }

  async updateScore(id: string, score: number) {
    const saleIndex = this.sales.findIndex((sale) => sale.id === id);
    if (saleIndex === -1) {
      throw new NotFoundError(`Sale with id ${id} not found`);
    }

    const updatedSale: SaleEntity = {
      ...this.sales[saleIndex],
      score,
      updatedAt: new Date()
    };
    this.sales[saleIndex] = updatedSale;

    return updatedSale;
  }
}

const buildControllers = (saleRepository: SaleRepository): PresentationControllers => {
  const healthController = new HealthController(new HealthCheckUseCase());
  const salesController = new SalesController(
    new CreateSaleUseCase(saleRepository),
    new ListSalesUseCase(saleRepository),
    new EvaluateSaleUseCase(saleRepository)
  );

  return {
    healthController,
    salesController
  };
};

describe('Sales API', () => {
  const saleRepository = new InMemorySaleRepository();
  const app = createApp(buildControllers(saleRepository));

  beforeEach(() => {
    saleRepository.reset();
  });

  it('creates a valid sale', async () => {
    const response = await request(app).post('/sales').send({
      customer: 'Acme Corp',
      product: 'Premium Plan',
      amount: 1200
    });

    expect(response.status).toBe(201);
    expect(response.body.data.customer).toBe('Acme Corp');
    expect(response.body.data.product).toBe('Premium Plan');
    expect(response.body.data.amount).toBe(1200);
    expect(response.body.data.score).toBeNull();
  });

  it('rejects invalid sale creation', async () => {
    const response = await request(app).post('/sales').send({
      customer: '',
      product: '',
      amount: -20
    });

    expect(response.status).toBe(400);
    expect(response.body.error.message).toBe('Validation failed');
  });

  it('lists sales', async () => {
    await request(app).post('/sales').send({
      customer: 'Customer One',
      product: 'Product A',
      amount: 500
    });
    await request(app).post('/sales').send({
      customer: 'Customer Two',
      product: 'Product B',
      amount: 1000
    });

    const response = await request(app).get('/sales');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data).toHaveLength(2);
  });

  it('evaluates an existing sale', async () => {
    const createdSale = await request(app).post('/sales').send({
      customer: 'Customer One',
      product: 'Product A',
      amount: 500
    });

    const response = await request(app)
      .post(`/sales/${createdSale.body.data.id}/evaluate`)
      .send({ score: 4 });

    expect(response.status).toBe(200);
    expect(response.body.data.score).toBe(4);
  });

  it('rejects invalid score', async () => {
    const createdSale = await request(app).post('/sales').send({
      customer: 'Customer One',
      product: 'Product A',
      amount: 500
    });

    const response = await request(app)
      .post(`/sales/${createdSale.body.data.id}/evaluate`)
      .send({ score: 6 });

    expect(response.status).toBe(400);
    expect(response.body.error.message).toBe('Validation failed');
  });

  it('returns 404 when evaluating a non-existing sale', async () => {
    const response = await request(app)
      .post('/sales/non-existing-sale/evaluate')
      .send({ score: 3 });

    expect(response.status).toBe(404);
    expect(response.body.error.message).toContain('not found');
  });
});
