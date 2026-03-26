import { RequestHandler } from 'express';
import { HealthCheckUseCase } from '../../application/use-cases/health-check.use-case';

export class HealthController {
  constructor(private readonly healthCheckUseCase: HealthCheckUseCase) {}

  getStatus: RequestHandler = async (_req, res, next) => {
    try {
      const health = this.healthCheckUseCase.execute();
      res.status(200).json({ data: health });
    } catch (error) {
      next(error);
    }
  };
}
