import { z } from 'zod';

export const createSaleSchema = z.object({
  customer: z.string().trim().min(1).max(120),
  product: z.string().trim().min(1).max(120),
  amount: z.coerce.number().positive(),
  score: z.union([z.coerce.number().int().min(0).max(100), z.null()]).optional()
});

export type CreateSaleRequestDto = z.infer<typeof createSaleSchema>;
