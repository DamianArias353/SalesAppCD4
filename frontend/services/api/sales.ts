import {
  CreateSaleRequest,
  EvaluateSaleRequest,
  Sale
} from '@/types/sale';
import { apiFetch } from './client';

interface SaleItemResponse {
  data: Sale;
}

interface SalesListResponse {
  data: Sale[];
}

export const getSales = () => {
  return apiFetch<SalesListResponse>('/sales');
};

export const createSale = (payload: CreateSaleRequest) => {
  return apiFetch<SaleItemResponse>('/sales', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
};

export const evaluateSale = (saleId: string, payload: EvaluateSaleRequest) => {
  return apiFetch<SaleItemResponse>(`/sales/${saleId}/evaluate`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
};
