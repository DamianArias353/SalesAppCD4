import { clientEnv } from '@/lib/env';

interface ApiErrorPayload {
  error?: {
    message?: string;
    details?: unknown;
  };
}

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

const buildApiUrl = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${clientEnv.apiBaseUrl}${normalizedPath}`;
};

export const apiFetch = async <T>(
  path: string,
  init?: RequestInit
): Promise<T> => {
  const response = await fetch(buildApiUrl(path), {
    ...init,
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    }
  });

  const isJsonResponse = response.headers
    .get('content-type')
    ?.includes('application/json');

  const payload = (isJsonResponse ? await response.json() : null) as
    | T
    | ApiErrorPayload
    | null;

  if (!response.ok) {
    const message =
      (payload as ApiErrorPayload | null)?.error?.message ??
      `API request failed with status ${response.status}`;

    throw new ApiClientError(
      message,
      response.status,
      (payload as ApiErrorPayload | null)?.error?.details
    );
  }

  return payload as T;
};
