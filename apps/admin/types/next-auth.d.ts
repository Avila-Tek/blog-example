import { TUser } from '@repo/schemas';
import { DefaultJWT, JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User extends TUser {
    token: string;
  }
  /**
   * Returned by `useSession`, `auth`, contains information about the active session.
   */
  interface Session {
    user: TUser;
    token: string;
  }
}

type CustomJWT = DefaultJWT & TUser;

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT extends CustomJWT {
    token: string;
  }
}
