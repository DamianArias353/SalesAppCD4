export interface SaleEntity {
  id: string;
  customer: string;
  product: string;
  amount: number;
  score: number | null;
  createdAt: Date;
  updatedAt: Date;
}
