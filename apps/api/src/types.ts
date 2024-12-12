import type { FastifyRequest } from 'fastify';

export type TContext = {
  logger: FastifyRequest['log'];
};
