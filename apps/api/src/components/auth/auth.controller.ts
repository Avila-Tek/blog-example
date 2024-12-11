import type { FastifyReply, FastifyRequest } from 'fastify';
import { authService } from './auth.service';

async function signIn(request: FastifyRequest, reply: FastifyReply) {
  const safeResult = await authService.signIn(request.body, {
    logger: request.log,
  });
  if (!safeResult.success) {
    return reply.code(500).send(safeResult.error);
  }
  return reply.code(200).send({
    token: safeResult.data,
  });
}

export const authController = Object.freeze({ signIn });
