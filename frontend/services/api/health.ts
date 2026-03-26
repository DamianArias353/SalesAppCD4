import { apiFetch } from './client';

export interface HealthResponse {
  data: {
    status: 'ok';
    timestamp: string;
  };
}

export const getApiHealth = async () => {
  return apiFetch<HealthResponse>('/health');
};
