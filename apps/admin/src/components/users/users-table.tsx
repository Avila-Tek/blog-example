'use client';

import { Pagination, TUser } from '@repo/schemas';
import { ColumnDef } from '@tanstack/react-table';
import { Pencil } from 'lucide-react';
import Link from 'next/link';
import { DataTable } from '../ui/data-table';

export const columns: ColumnDef<TUser>[] = [
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'firstName',
    header: 'First Name',
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
  },
  {
    accessorKey: '_id',
    header: () => <div className="">Actions</div>,
    cell({ row }) {
      return (
        <Link href={`/users/${row.original._id}`} className="text-right">
          <span className="sr-only">edit user</span>
          <Pencil className="w-4 h-4 text-muted/500" />
        </Link>
      );
    },
  },
];

type TUserTableProps = {
  pagination: Pagination<TUser>;
};

export function UserTable({ pagination }: TUserTableProps) {
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={pagination.items} />
    </div>
  );
}
