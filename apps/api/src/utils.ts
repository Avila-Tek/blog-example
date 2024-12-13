import { PageInfo, Pagination } from '@repo/schemas';
import { Safe, safe } from '@repo/utils';
import { Model } from 'mongoose';

export function getCodeAndMessageFromErrorString(candidate: string) {
  // All http codes are 3 digits nombers so in a `000-error` strin the index 3 must be the dash
  if (candidate.charAt(3) === '-') {
    const [_code, _error] = candidate.split('-');
    const code = Number.isNaN(Number(_code)) ? 500 : Number(_code);
    return {
      code,
      error: typeof _error === 'undefined' ? 'Internal server error' : _error,
    };
  }
  return {
    code: 500,
    error:
      typeof candidate === 'undefined' ? 'Internal server error' : candidate,
  };
}

type TPaginationOptions = {
  page: number;
  perPage: number;
  filter?: Record<string, any> | undefined;
  projection?: string;
};

export async function pagination<T = unknown>(
  model: Model<T>,
  { page, perPage, filter = {}, projection = '' }: TPaginationOptions
): Promise<Safe<Pagination<T>>> {
  const safeCount = await safe(model.countDocuments(filter).exec());

  if (!safeCount.success) {
    return safeCount;
  }

  const totalPages = Math.ceil(safeCount.data / perPage);

  if (page > totalPages) {
    return {
      success: false,
      error: `The page isn't avaliable`,
    };
  }

  const skip = Math.max(0, (page - 1) * perPage);

  const safeItems = await safe(
    model
      .find(filter, projection, {
        skip,
        limit: perPage,
      })
      .exec()
  );

  if (!safeItems.success) {
    return safeItems;
  }

  const result: Pagination<T> = {
    count: safeCount.data,
    pageInfo: {
      page,
      perPage,
      itemCount: safeCount.data,
      pageCount: totalPages,
      hasPreviousPage: page > 1,
      hasNextPage:
        safeItems.data.length > perPage || page * perPage < safeCount.data,
    },
    items: safeItems.data,
  };

  return {
    success: true,
    data: result,
  };
}
