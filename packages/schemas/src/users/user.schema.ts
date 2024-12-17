import { z } from 'zod';

export const userSchema = z.object({
  _id: z.any().optional().nullable(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email().min(5, 'Email must be at least 5 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .optional(),
  role: z.enum(['reader', 'writer', 'admin']).default('reader'),
});

export type TUser = z.infer<typeof userSchema>;
