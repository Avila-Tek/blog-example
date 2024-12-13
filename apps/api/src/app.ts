// Import this first!
import './instrument';
import { Server } from 'http';
import {
  authProtectedRouter,
  authPublicRouter,
} from '@/components/auth/auth.router';
import {
  userProtectedRouter,
  userPublicRouter,
} from '@/components/users/user.router';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import * as Sentry from '@sentry/node';
import Fastify, { FastifyHttpOptions } from 'fastify';
import mongoose from 'mongoose';
import { getLogger } from './logger';

export async function createApp() {
  let connection: typeof mongoose | null = null;
  try {
    connection = await mongoose
      .connect(String(process.env.DATABASE))
      .then((conn) => {
        console.log('Connected to database');
        return conn;
      });

    mongoose.connection.on('error', (err) => `❌🤬❌🤬 ${err}`);
  } catch (err) {
    console.log(`ERROR: ${err}`);
    if (connection && connection.connection) {
      connection.connection.close();
    }
    process.exit(1);
  }

  let config: FastifyHttpOptions<Server> = {};

  if (process.env.NODE_ENV === 'production') {
    config = {
      loggerInstance: getLogger(),
    };
  }

  const app = Fastify(config);

  if (process.env.NODE_ENV === 'production') {
    Sentry.setupFastifyErrorHandler(app);
    await app.register(helmet);
    await app.register(rateLimit);
  }

  await app.register(cors, {
    origin: JSON.parse(process.env.CORS_ORIGINS ?? '["*"]'),
    credentials: true,
  });

  // REGISTER ROUTES
  // public routes
  app.register(userPublicRouter, {
    prefix: '/api',
  });
  app.register(authPublicRouter, {
    prefix: '/api',
  });

  // private routes
  app.register(authProtectedRouter, { prefix: '/api' });
  app.register(userProtectedRouter, { prefix: '/api' });

  await app.ready();

  return app;
}
