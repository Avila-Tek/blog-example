import type { FastifyInstance } from 'fastify';
import { authController } from './auth.controller';

export function authPublicRouter(fastify: FastifyInstance) {
  fastify.post('/v1/auth/sign-in', authController.signIn);

  fastify.get('/v1/auth/me', authController.currentUser);
}

export function authProtectedRouter(_fastify: FastifyInstance) {
  //
}
