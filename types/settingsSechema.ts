import { z } from 'zod';

export const SettingsSchema = z.object({
  name: z.optional(z.string()),
  image: z.optional(z.string()),
  password: z.optional(z.string()),
  newPassword: z.optional(z.string()),
  twoFactorEnabled: z.optional(z.boolean()),
});