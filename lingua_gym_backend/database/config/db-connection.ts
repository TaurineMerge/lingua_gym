import { Pool, QueryResult, QueryResultRow } from 'pg';

class Database {
  private static instance: Database | null = null;
  private pool: Pool;

  private constructor() {
    this.pool = new Pool({
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
      console.error('Unexpected error on idle client', err);
      process.exit(-1);
    });

    process.on('SIGINT', async () => {
      await this.close();
      process.exit(0);
    });
    
    process.on('SIGTERM', async () => {
      await this.close();
      process.exit(0);
    });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async query<T extends QueryResultRow>(
    text: string,
    params?: unknown[]
  ): Promise<QueryResult<T>> {
    try {
      return await this.pool.query<T>(text, params);
    } catch (err) {
      console.error('Query failed:', { query: text, params, error: err });
      throw err;
    }
  }

  public async close(): Promise<void> {
    await this.pool.end();
    console.log('Database pool closed');
  }
}

export default Database;
