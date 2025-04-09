import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import accessManagementRoutes from './routes/AccessManagementRoutes.js';
import container from './di/Container.js';
import Database from './database/config/db-connection.js';
import { Logger } from 'pino';

const app = express();
const PORT = process.env.PORT || 3000;

const db: Database = container.resolve('Database');
const logger: Logger = container.resolve('Logger');

app.use(express.json());
app.use(cookieParser());

app.use('/access_management', accessManagementRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

const server = app.listen(PORT, async () => {
  try {
    logger.info(`Server is running on http://localhost:${PORT}`);
  } catch (err) {
    logger.fatal({ err }, 'Failed to start server');
    process.exit(1);
  }
});

const shutdown = async () => {
  logger.info('Shutting down...');
  server.close(async () => {
    await db.close();
    logger.info('Server stopped');
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);