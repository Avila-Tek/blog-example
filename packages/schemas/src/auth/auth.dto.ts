import { z } from 'zod';

export const signInInput = z.object({
  email: z.string().email().min(5),
  password: z.string().min(8),
});

export type TSignInInput = z.infer<typeof signInInput>;
