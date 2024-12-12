import type { FastifyInstance } from 'fastify';
import { userController } from './user.controller';

export function userPublicRouter(fastify: FastifyInstance) {
  fastify.post('/v1/users/create', userController.createOne);
}

export function userProtectedRouter(_fastify: FastifyInstance) {
  //
}
