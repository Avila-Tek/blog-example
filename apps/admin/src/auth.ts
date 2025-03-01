import { signInInput, userSchema } from '@repo/schemas';
import { safe, safeFetch } from '@repo/utils';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        // Check credentials
        const safeParse = safe(() => signInInput.parse(credentials));
        if (!safeParse.success) {
          throw new Error('Error parsing the user input');
        }
        // Sign In
        const safeToken = await safeFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/sign-in`,
          {
            method: 'POST',
            body: JSON.stringify(safeParse.data),
            headers: {
              'content-type': 'application/json',
            },
          }
        );
        if (!safeToken.success) {
          throw new Error(`Login error [sign-in]: ${safeToken.error}`);
        }
        // Check token
        const safeParseToken = safe(() =>
          z
            .object({
              token: z.string(),
            })
            .parse(safeToken.data)
        );
        if (!safeParseToken.success) {
          throw new Error(`Error parsing token: ${safeParseToken.error}`);
        }
        // Get user information
        const safeUser = await safeFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/me`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${safeParseToken.data.token}`,
            },
          }
        );
        if (!safeUser.success) {
          throw new Error(`Login error [me]: ${safeUser.error}`);
        }
        // check user schema
        const safeParseUser = safe(() => userSchema.parse(safeUser.data));
        if (!safeParseUser.success) {
          throw new Error(`Error parsing user: ${safeParseUser.error}`);
        }
        const user = safeParseUser.data;
        return {
          token: safeParseToken.data.token,
          ...user,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.role = user.role;
        token.email = user.email;
        token.token = user.token;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (token) {
        session.token = token.token;
        session.user = {
          id: token.id as any,
          emailVerified: null,
          token: token.token,
          firstName: token.firstName,
          lastName: token.lastName,
          role: token.role,
          email: token.email!,
        };
      }
      return session;
    },
  },
});
