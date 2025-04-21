import pg from 'pg';
import logger from '../../utils/logger/Logger.js';
import 'dotenv/config';

class Database {
  private pool: pg.Pool;

  public constructor(pool?: pg.Pool) {
    this.pool = pool || new pg.Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      user: process.env.DB_USER || 'user',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'dbname',
      max: parseInt(process.env.DB_MAX_CONNECTIONS || '10', 10),
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 2000,
    });

    this.pool.on('error', (err) => {
      logger.fatal({ err }, 'Unexpected error on idle client');
      process.exit(-1);
    });
  }

  public async query<T extends pg.QueryResultRow>(
    text: string,
    params?: unknown[]
  ): Promise<pg.QueryResult<T>> {
    try {
      logger.info({ query: text, params }, 'Executing query');
      return await this.pool.query<T>(text, params);
    } catch (err) {
      logger.error({ query: text, params, err }, 'Query failed');
      throw err;
    }
  }

  public async close(): Promise<void> {
    await this.pool.end();
    logger.info('Database pool closed');
  }
}

export default Database;
