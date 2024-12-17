import { UserTable } from '@/components/users/users-table';
import { paginationInfo } from '@repo/schemas';
import { userService } from '@repo/services';
import { safe } from '@repo/utils';
import { redirect } from 'next/navigation';
import React from 'react';

type TUserPageProps = {
  searchParams: Record<string, string>;
};

export default async function UserPage({ searchParams }: TUserPageProps) {
  const qs = new URLSearchParams(searchParams);
  if (!(qs.has('page') && qs.has('perPage'))) {
    redirect(`/users?page=1&perPage=20`);
  }
  const safeParse = safe(() =>
    paginationInfo.parse(Object.fromEntries(qs.entries()))
  );
  if (!safeParse.success) {
    return <div>Error</div>;
  }
  const safePagination = await userService.paginationUser(safeParse.data, {
    baseUrl: process.env.NEXT_PUBLIC_API_URL!,
    next: {
      tags: ['users', `page:${qs.get('page')}`, `perPage:${qs.get('perPage')}`],
    },
  });
  if (!safePagination.success) {
    return <div>Error</div>;
  }

  return (
    <div className="">
      <UserTable pagination={safePagination.data} />
    </div>
  );
}
