import { clientEnv } from '@/lib/env';

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

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
};
