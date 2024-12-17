import { getCodeAndMessageFromErrorString } from '@/utils';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { userService } from './user.service';

async function createOne(request: FastifyRequest, reply: FastifyReply) {
  const safeResult = await userService.createOneUser(request.body, {
    logger: request.log,
  });
  if (!safeResult.success) {
    const { code, error } = getCodeAndMessageFromErrorString(safeResult.error);
    return reply.code(code).send({ error });
  }
  return reply.code(200).send(safeResult.data);
}

async function pagination(request: FastifyRequest, reply: FastifyReply) {
  const safeResult = await userService.paginationUser(request.query, {
    logger: request.log,
  });
  if (!safeResult.success) {
    const { code, error } = getCodeAndMessageFromErrorString(safeResult.error);
    return reply.code(code).send({ error });
  }
  return reply.code(200).send(safeResult.data);
}

async function findOne(request: FastifyRequest, reply: FastifyReply) {
  const safeResult = await userService.findOneUser(
    { _id: (request.params as any)._id },
    {
      logger: request.log,
    }
  );
  if (!safeResult.success) {
    const { code, error } = getCodeAndMessageFromErrorString(safeResult.error);
    return reply.code(code).send({ error });
  }
  return reply.code(200).send(safeResult.data);
}

async function updateOne(request: FastifyRequest, reply: FastifyReply) {
  const safeResult = await userService.updateOneUser(request.body, {
    logger: request.log,
  });
  if (!safeResult.success) {
    const { code, error } = getCodeAndMessageFromErrorString(safeResult.error);
    return reply.code(code).send({ error });
  }
  return reply.code(200).send(safeResult.data);
}

export const userController = Object.freeze({
  createOne,
  pagination,
  findOne,
  updateOne,
});
