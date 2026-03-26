export interface HealthCheckResult {
  status: 'ok';
  timestamp: string;
}

export class HealthCheckUseCase {
  execute(): HealthCheckResult {
    return {
      status: 'ok',
      timestamp: new Date().toISOString()
    };
  }
}
