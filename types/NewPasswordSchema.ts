import { z } from 'zod';

export const newPasswordSchema = z.object({
  password: z.string().min(8, {message: 'Password must be at least 8 characters long'}),
  token: z.string().min(1, 'Token is required'),
});
