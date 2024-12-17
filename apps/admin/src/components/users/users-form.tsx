'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserInput, TUser } from '@repo/schemas';
import { userService } from '@repo/services';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

type UserFormValues = z.infer<typeof createUserInput>;

interface UserFormProps {
  user: TUser;
}

export function UserForm({ user }: UserFormProps) {
  const [isNewUser, _setIsNewUser] = useState(!user);
  const router = useRouter();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(
      !user ? createUserInput : createUserInput.omit({ password: true })
    ),
    defaultValues: user || {
      firstName: '',
      lastName: '',
      email: '',
      role: 'writer',
    },
  });

  const handleSubmit = async (data: UserFormValues) => {
    if (isNewUser) {
      const safeCreate = await userService.createUser(data, {
        baseUrl: process.env.NEXT_PUBLIC_API_URL!,
      });
      if (!safeCreate.success) {
        return;
      }
      return router.push(`/users/${safeCreate.data._id}`);
    } else {
      const safeUpdate = await userService.updateOneUser(
        {
          ...data,
          _id: user?._id,
        },
        {
          baseUrl: process.env.NEXT_PUBLIC_API_URL!,
        }
      );
      if (!safeUpdate.success) {
        return;
      }
      return router.push(`/users/${safeUpdate.data._id}`);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="grid gap-6 grid-cols-1 md:grid-cols-2"
      >
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="John" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="john.doe@example.com"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {isNewUser && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="********" type="password" {...field} />
                </FormControl>
                <FormDescription>
                  Password must be at least 8 characters long.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="reader">Reader</SelectItem>
                  <SelectItem value="writer">Writer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full md:col-span-2">
          {isNewUser ? 'Create User' : 'Update User'}
        </Button>
      </form>
    </Form>
  );
}
