import { fastify, type FastifyInstance } from 'fastify';
import { userController } from './user.controller';

export function userPublicRouter(fastify: FastifyInstance) {
  fastify.post('/v1/users/create', userController.createOne);
}

export function userProtectedRouter(fastify: FastifyInstance) {
  //
  fastify.get('/v1/users', userController.pagination);
}
