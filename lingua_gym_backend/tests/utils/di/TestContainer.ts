import dotenv from 'dotenv';
import { container, DependencyContainer } from 'tsyringe';
import { Pool } from 'pg';
import { DictionaryCardModel } from '../../../src/models/dictionary/dictionary.js';
import Database from '../../../src/database/config/db-connection.js';

dotenv.config({ path: '.env.test' });

const pool: Pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'dbname',
    max: parseInt(process.env.DB_MAX_CONNECTIONS || '10', 10),
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 2000,
});

export const testDb: Database = new Database(pool);

export async function setupTestContainer(): Promise<DependencyContainer> {
  const testContainer = container.createChildContainer();

  testContainer.registerInstance(Database, testDb);
  testContainer.register<DictionaryCardModel>(
    DictionaryCardModel,
    { useClass: DictionaryCardModel }
  );

  return testContainer;
}

export async function clearDatabase() {
  await pool.query(`DELETE FROM "DictionaryExamples"`);
  await pool.query(`DELETE FROM "DictionaryMeanings"`);
  await pool.query(`DELETE FROM "DictionaryTranslations"`);
  await pool.query(`DELETE FROM "DictionaryCards"`);
}

export async function closeDatabase() {
  await testDb.close();
}
