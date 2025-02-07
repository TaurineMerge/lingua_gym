import pino from 'pino';

const {NODE_ENV, LOG_LEVEL_DEV, LOG_LEVEL_PROD} = process.env;

const logger = pino({
    level: NODE_ENV === 'production' ? LOG_LEVEL_PROD : LOG_LEVEL_DEV || 'info',
    transport: {
    target: 'pino-pretty',
      options: {
          colorize: true
      }
    }
});

export default logger;