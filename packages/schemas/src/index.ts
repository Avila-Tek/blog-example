import { z } from 'zod';
export * from './auth';
export * from './users';

// AUX MODELS

export const paginationInfo = z.object({
  page: z.preprocess(
    (x) => Number(x),
    z
      .number()
      .min(1)
      .max(Number.MAX_SAFE_INTEGER - 1)
      .default(1)
  ),
  perPage: z.preprocess(
    (x) => Number(x),
    z.number().min(1).max(100).default(20)
  ),
  filter: z.any(),
});

export type TPaginationInfo = z.infer<typeof paginationInfo>;

export const pageInfoSchema = z.object({
  page: z.number(),
  perPage: z.number(),
  itemCount: z.number(),
  pageCount: z.number(),
  hasPreviousPage: z.boolean(),
  hasNextPage: z.boolean(),
});

export type PageInfo = z.infer<typeof pageInfoSchema>;

export function createPaginationSchema<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>
) {
  return z.object({
    count: z.number(),
    items: z.array(schema),
    pageInfo: pageInfoSchema,
  });
}

export type Pagination<T> = {
  count: number;
  items: T[];
  pageInfo: PageInfo;
};

export type DocumentModel = {
  file?: File;
  id?: string;
  src?: string | ArrayBuffer;
  name?: string;
};
