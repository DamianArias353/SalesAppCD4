import { ApplicationError } from '../../shared/errors/app.error';

export class DomainError extends ApplicationError {
  constructor(message: string, details?: unknown) {
    super(message, 400, details);
    this.name = 'DomainError';
  }
}
