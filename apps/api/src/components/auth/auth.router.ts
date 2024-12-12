import type { FastifyInstance } from 'fastify';
import { authController } from './auth.controller';

export function authPublicRouter(fastify: FastifyInstance) {
  fastify.post('/v1/auth/sign-in', authController.signIn);
  fastify.post('/v1/auth/sign-up', authController.signUp);
}

export function authProtectedRouter(fastify: FastifyInstance) {
  //
  fastify.get('/v1/auth/me', authController.currentUser);
}
