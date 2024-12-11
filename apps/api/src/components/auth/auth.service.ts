import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { signInInput } from '@repo/schemas';
import { Safe, safe } from '@repo/utils';
import { userService } from '@/components/users/user.service';
import { TContext } from '@/types';
import { IUser } from '@/components/users/user.model';

function getKeys() {
  const privateString = String(process.env.PRIVATE_KEY).replaceAll('\\n', '\n');
  const publicString = String(process.env.PUBLIC_KEY).replaceAll('\\n', '\n');
  return {
    privateKey: crypto.createPrivateKey(Buffer.from(privateString)),
    publicKey: crypto.createPublicKey(Buffer.from(publicString)),
  };
}

function signToken(data: Record<string, string>) {
  const { privateKey } = getKeys();
  const safeToken = safe(() =>
    jwt.sign({}, privateKey, {
      expiresIn: '7d',
      subject: String(data.id),
      issuer: 'http://localhost:3000',
      algorithm: 'ES256',
    })
  );
  return safeToken;
}

function verifyToken(candidate: string) {
  const { publicKey } = getKeys();
  const safeValidate = safe(() =>
    jwt.verify(candidate, publicKey, {
      complete: true,
      clockTolerance: 2 * 60 * 1000,
      algorithms: ['ES256'],
    })
  );
  return safeValidate;
}

/**
 *
 * @param dto {TSignInInput}
 */
async function signIn(dto: unknown, ctx: TContext): Promise<Safe<string>> {
  const safeParse = safe(() => signInInput.parse(dto));
  if (!safeParse.success) {
    ctx.logger.error(safeParse.error, 'error while parsing signInInput');
    return {
      ...safeParse,
      error: `422-${safeParse}`,
    };
  }
  const safeUser = await userService.findOneUser(safeParse.data, ctx);
  if (!safeUser.success) {
    return safeUser;
  }
  if (!safeUser.data) {
    return {
      success: false,
      error: '404-users',
    };
  }
  const safeToken = signToken({ id: safeUser.data._id });
  return safeToken;
}

async function currentUser(token: string, ctx: TContext): Promise<Safe<IUser>> {
  const safeVerify = verifyToken(token);
  if (!safeVerify.success) {
    return {
      ...safeVerify,
      error: `401-${safeVerify.error}`,
    };
  }
  const id =
    typeof safeVerify.data.payload === 'string'
      ? JSON.parse(safeVerify.data.payload)
      : safeVerify.data.payload;
  const safeUser = await userService.findOneUser({ _id: id.sub }, ctx);
  if (!safeUser.success) {
    return safeUser;
  }
  if (!safeUser.data) {
    return {
      success: false,
      error: '404-user',
    };
  }
  safeUser.data.password = undefined;
  return {
    success: true,
    data: safeUser.data!,
  };
}

export const authService = Object.freeze({
  signIn,
  currentUser,
});
