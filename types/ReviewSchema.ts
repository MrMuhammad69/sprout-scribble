import * as z from 'zod';

export const reviewSchema = z.object({
  productID: z.number(),
  rating: z.number().min(1, { message: 'Rating must be at least 1' }).max(5, { message: 'Rating must be at most 5' }),
  comment: z.string().min(10, { message: 'Review must be at least 10 character long' }),
});
