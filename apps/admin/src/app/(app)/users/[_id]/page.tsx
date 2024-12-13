import { UserForm } from '@/components/users/users-form';

export default async function page() {
  return (
    <div className="container mx-auto max-w-screen-md">
      <UserForm />
    </div>
  );
}
