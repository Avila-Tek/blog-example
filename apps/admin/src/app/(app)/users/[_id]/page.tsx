import { UserForm } from '@/components/users/users-form';
import { TUser } from '@repo/schemas';
import { userService } from '@repo/services';
import { notFound } from 'next/navigation';

type TUserProfilePage = {
  params: { _id: string };
  searchParams: {};
};

export default async function page({ params }: TUserProfilePage) {
  let user: TUser | undefined = undefined;
  if ('_id' in params && params._id !== 'create') {
    const safeUser = await userService.findOneUser(
      {
        _id: params._id,
      },
      {
        baseUrl: process.env.NEXT_PUBLIC_API_URL!,
      }
    );
    if (!safeUser.success) {
      return notFound();
    }
    user = safeUser.data;
    // FIXME: issue for password
    user.password = '';
  }
  return (
    <div className="container mx-auto max-w-screen-md">
      <UserForm user={user as any} />
    </div>
  );
}
