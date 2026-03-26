const defaultApiUrl = 'http://localhost:4000';

export const clientEnv = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? defaultApiUrl
};
