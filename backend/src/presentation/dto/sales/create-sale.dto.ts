import { z } from 'zod';

export const createSaleSchema = z.object({
  customer: z
    .string({ required_error: 'customer is required' })
    .trim()
    .min(1, 'customer is required')
    .max(120),
  product: z
    .string({ required_error: 'product is required' })
    .trim()
    .min(1, 'product is required')
    .max(120),
  amount: z.coerce
    .number({ invalid_type_error: 'amount must be numeric' })
    .positive('amount must be greater than 0')
});

export type CreateSaleRequestDto = z.infer<typeof createSaleSchema>;
