export interface Sale {
  id: string;
  customer: string;
  product: string;
  amount: number;
  score: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSaleRequest {
  customer: string;
  product: string;
  amount: number;
}

export interface EvaluateSaleRequest {
  score: number;
}
