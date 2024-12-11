import { createUserInput, findOneUserInput } from '@repo/schemas';
import { safe } from '@repo/utils';
import { User } from './user.model';
import { TContext } from '@/types';

/**
 *
 * @param dto {TCreateUserInput}
 * @param ctx
 * @returns
 */
async function createOneUser(dto: unknown, ctx: TContext) {
  const safeParse = safe(() => createUserInput.parse(dto));
  if (!safeParse.success) {
    ctx.logger.error(safeParse.error, 'error while parsing createUserInput');
    return safeParse;
  }
  const safeCreate = await safe(User.create(safeParse.data));
  if (!safeCreate.success) {
    ctx.logger.error(safeCreate.error, 'error while creting User');
    return safeCreate;
  }
  // remove password
  safeCreate.data.password = undefined;
  return safeCreate;
}

async function findOneUser(dto: unknown, ctx: TContext) {
  const safeParse = safe(() => findOneUserInput.parse(dto));
  if (!safeParse.success) {
    ctx.logger.error(safeParse.error, 'error while parsing findOneUserInput');
    return safeParse;
  }
  const safeFind = await safe(User.findOne(safeParse.data).exec());
  if (!safeFind.success) {
    ctx.logger.error(safeFind.error, 'error while finding user');
    return safeFind;
  }
  return safeFind;
}

export const userService = Object.freeze({
  createOneUser,
  findOneUser,
});
