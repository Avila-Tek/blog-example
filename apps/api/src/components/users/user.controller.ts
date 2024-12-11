import type { FastifyReply, FastifyRequest } from 'fastify';
import { userService } from './user.service';

async function createOne(request: FastifyRequest, reply: FastifyReply) {
  const safeResult = await userService.createOneUser(request.body, {
    logger: request.log,
  });
  if (!safeResult.success) {
    return reply.code(500).send(safeResult.error);
  }
  return reply.code(200).send(safeResult.data);
}

export const userController = Object.freeze({ createOne });
