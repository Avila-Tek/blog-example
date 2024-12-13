import { getCodeAndMessageFromErrorString } from '@/utils';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { authService } from './auth.service';

async function signIn(request: FastifyRequest, reply: FastifyReply) {
  const safeResult = await authService.signIn(request.body, {
    logger: request.log,
  });
  if (!safeResult.success) {
    const { code, error } = getCodeAndMessageFromErrorString(safeResult.error);
    return reply.code(code).send(error);
  }
  return reply.code(200).send({
    token: safeResult.data,
  });
}

async function currentUser(request: FastifyRequest, reply: FastifyReply) {
  const token = request.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return reply.status(401).send({ error: 'Unauthorized' });
  }
  const safeResult = await authService.currentUser(token, {
    logger: request.log,
  });
  if (!safeResult.success) {
    const { code, error } = getCodeAndMessageFromErrorString(safeResult.error);
    return reply.code(code).send({ error });
  }
  return reply.code(200).send(safeResult.data);
}

async function signUp(request: FastifyRequest, reply: FastifyReply) {
  const safeResult = await authService.signUp(request.body, {
    logger: request.log,
  });
  if (!safeResult.success) {
    const { code, error } = getCodeAndMessageFromErrorString(safeResult.error);
    return reply.code(code).send({ error });
  }
  return reply.code(200).send({
    token: safeResult.data,
  });
}

export const authController = Object.freeze({ signIn, signUp, currentUser });
