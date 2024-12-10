// import { createLogger, transports, format, Logger } from 'winston';
// import LokiTransport from 'winston-loki';
import pino, { Logger } from 'pino';
import type { LokiOptions } from 'pino-loki';

let logger: Logger<string, boolean>;

export const getLogger = () => {
  const transport = pino.transport<LokiOptions>({
    target: 'pino-loki',
    options: {
      batching: true,
      interval: 5,
      labels: {
        app: process.env.LOKI_APP_NAME!,
      },
      host: process.env.LOKI_HOST!,
      basicAuth: {
        username: process.env.LOKI_USERNAME!,
        password: process.env.LOKI_PASSWORD!,
      },
    },
  });

  if (process.env.NODE_ENV === 'production') {
    logger = pino(transport);
  } else {
    logger = pino();
  }

  return logger;
};
