import { z } from 'zod';
import { userSchema } from './user.schema';

export const createUserInput = userSchema.required();

export type TCreateUserInput = z.infer<typeof createUserInput>;

export const updateUserInput = userSchema.partial().extend({
  _id: z.string(),
});

export type TUpdateUserInput = z.infer<typeof updateUserInput>;

export const findOneUserInput = z
  .object({
    email: z.string().email().min(5),
    firstName: z.string(),
    lastName: z.string(),
  })
  .partial();

export type TFindOneUserInput = z.infer<typeof findOneUserInput>;
