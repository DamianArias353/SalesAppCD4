export class ApplicationError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'ApplicationError';
  }
}

export class ValidationError extends ApplicationError {
  constructor(message = 'Validation failed', details?: unknown) {
    super(message, 400, details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends ApplicationError {
  constructor(message = 'Resource not found', details?: unknown) {
    super(message, 404, details);
    this.name = 'NotFoundError';
  }
}

// Backward-compatible alias for existing references.
export class AppError extends ApplicationError {}
