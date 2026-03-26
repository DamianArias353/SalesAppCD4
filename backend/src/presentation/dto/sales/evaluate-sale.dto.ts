import { z } from 'zod';

export const evaluateSaleSchema = z.object({
  score: z.coerce
    .number({ required_error: 'score is required', invalid_type_error: 'score must be numeric' })
    .int('score must be an integer')
    .min(1, 'score must be between 1 and 5')
    .max(5, 'score must be between 1 and 5')
});

export const evaluateSaleParamsSchema = z.object({
  id: z.string().trim().min(1, 'id is required')
});

export type EvaluateSaleRequestDto = z.infer<typeof evaluateSaleSchema>;
export type EvaluateSaleParamsDto = z.infer<typeof evaluateSaleParamsSchema>;
