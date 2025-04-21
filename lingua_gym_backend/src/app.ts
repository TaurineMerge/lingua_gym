import express from 'express';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import accessManagementRoutes from './routes/AccessManagementRoutes.js';
//import dictionaryRoutes from './routes/DictionaryRoutes.js';
import container from './di/Container.js';
import Database from './database/config/db-connection.js';
import { Logger } from 'pino';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

const db: Database = container.resolve('Database');
const logger: Logger = container.resolve('Logger');

const corsOptions = {
  origin: process.env.CLIENT_URL as string || 'http://localhost:3001',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use('/api/access_management', accessManagementRoutes);
//app.use('/api/dictionary', dictionaryRoutes);

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