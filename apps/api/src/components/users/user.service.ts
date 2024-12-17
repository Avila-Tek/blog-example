import { TContext } from '@/types';
import { pagination } from '@/utils';
import {
  createUserInput,
  findOneUserInput,
  paginationInfo,
  TUser,
  updateUserInput,
} from '@repo/schemas';
import { Safe, safe } from '@repo/utils';
import { User } from './user.model';

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

async function paginationUser(dto: unknown, ctx: TContext) {
  const safeParse = safe(() => paginationInfo.parse(dto));
  if (!safeParse.success) {
    ctx.logger.error(safeParse.error, 'error while parsing findOneUserInput');
    return safeParse;
  }
  const safePagination = await pagination(User, {
    ...safeParse.data,
    projection: '-password',
  });
  return safePagination;
}

async function updateOneUser(
  dto: unknown,
  ctx: TContext
): Promise<Safe<TUser>> {
  const safeParse = safe(() => updateUserInput.parse(dto));
  if (!safeParse.success) {
    ctx.logger.error(safeParse.error, 'error while parsing updateUserInput');
    return safeParse;
  }
  delete safeParse.data.password;
  const safeUpdate = await safe(
    User.findOneAndUpdate(
      {
        _id: safeParse.data._id,
      },
      safeParse.data,
      {
        new: true,
        runValidators: true,
      }
    ).exec()
  );
  if (!safeUpdate.success) {
    ctx.logger.error(safeUpdate.error, 'error while updating User');
    return safeUpdate;
  }
  if (!safeUpdate.data) {
    ctx.logger.error('user not found', 'error while updating User');
    return {
      success: false,
      error: '404-users',
    };
  }
  // remove password
  safeUpdate.data.password = undefined;
  return {
    success: true,
    data: safeUpdate.data!,
  };
}

export const userService = Object.freeze({
  createOneUser,
  findOneUser,
  paginationUser,
  updateOneUser,
});
