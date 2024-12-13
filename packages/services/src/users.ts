import {
  Pagination,
  TCreateUserInput,
  TPaginationInfo,
  TUser,
  createPaginationSchema,
  userSchema,
} from '@repo/schemas';
import { Safe, safe, safeFetch } from '@repo/utils';
import { TRequestConfig } from './types';

async function createUser(
  input: TCreateUserInput,
  config: Omit<TRequestConfig, 'url'>
): Promise<Safe<TUser>> {
  const response = await safeFetch(new URL(`${config.baseUrl}/api/v1/users`), {
    ...(config ?? {}),
    body: JSON.stringify(input),
    method: 'POST',
    headers: {
      ...(config?.headers ?? {}),
      'Content-Type': 'application/json',
    },
  });
  if (!response.success) {
    return response;
  }
  console.log(response);
  const parseResponse = safe(() => userSchema.parse(response.data));
  return parseResponse;
}

async function paginationUser(
  input: TPaginationInfo,
  config: Omit<TRequestConfig, 'url'>
): Promise<Safe<Pagination<TUser>>> {
  const qs = new URLSearchParams({
    page: String(input.page),
    perPage: String(input.perPage),
    // filter: String(input.filter),
  });
  const response = await safeFetch(
    new URL(`${config.baseUrl}/api/v1/users?${qs.toString()}`),
    {
      ...(config ?? {}),
      method: 'GET',
    }
  );
  if (!response.success) {
    return response;
  }
  console.log(response.data);
  const parseResponse = safe(() =>
    createPaginationSchema(userSchema).parse(response.data)
  );
  return parseResponse;
}

export const userService = Object.freeze({ createUser, paginationUser });
