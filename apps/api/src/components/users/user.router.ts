import { type FastifyInstance } from 'fastify';
import { userController } from './user.controller';

export function userPublicRouter(_fastify: FastifyInstance) {
  //
}

export function userProtectedRouter(fastify: FastifyInstance) {
  //
  fastify.post('/v1/users', userController.createOne);
  fastify.get('/v1/users', userController.pagination);
}
