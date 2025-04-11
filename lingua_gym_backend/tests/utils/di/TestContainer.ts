import 'reflect-metadata';
import dotenv from 'dotenv';
import { container, DependencyContainer } from 'tsyringe';
import { Pool } from 'pg';
import Database from '../../../src/database/config/db-connection.js';
import { UserModel, UserMetadataModel, UserPasswordResetModel } from '../../../src/models/access_management/access_management.js';
import { DictionaryCardModel, DictionarySetModel, SetCardModel, UserSetModel } from '../../../src/models/dictionary/dictionary.js';
import { TagModel, CardTagModel, SetTagModel } from '../../../src/models/tag/tag.js';
import { AuthenticationService, JwtTokenManagementService, RegistrationService, PasswordResetService } from '../../../src/services/access_management/access_management.js';
import { DictionaryCardService, DictionarySetService, SetCardService, UserSetService } from '../../../src/services/dictionary/dictionary.js';
import { TagService, CardTagService, SetTagService } from '../../../src/services/tag/tag.js';

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

export async function setupTestModelContainer(): Promise<DependencyContainer> {
  const testContainer = container.createChildContainer();

  testContainer.registerInstance(Database, testDb);
  testContainer.register<DictionaryCardModel>(DictionaryCardModel,{ useClass: DictionaryCardModel });
  testContainer.register<UserModel>(UserModel, { useClass: UserModel });
  testContainer.register<UserMetadataModel>(UserMetadataModel, { useClass: UserMetadataModel });
  testContainer.register<UserPasswordResetModel>(UserPasswordResetModel, { useClass: UserPasswordResetModel });
  testContainer.register<DictionarySetModel>(DictionarySetModel, { useClass: DictionarySetModel });
  testContainer.register<SetCardModel>(SetCardModel, { useClass: SetCardModel });
  testContainer.register<UserSetModel>(UserSetModel, { useClass: UserSetModel });
  testContainer.register<TagModel>(TagModel, { useClass: TagModel });
  testContainer.register<CardTagModel>(CardTagModel, { useClass: CardTagModel });
  testContainer.register<SetTagModel>(SetTagModel, { useClass: SetTagModel });

  return testContainer;
}

export async function setupTestServiceContainer(): Promise<DependencyContainer> {
  const testContainer = container.createChildContainer();

  testContainer.registerInstance(Database, testDb);
  testContainer.register<AuthenticationService>(AuthenticationService, { useClass: AuthenticationService });
  testContainer.register<JwtTokenManagementService>(JwtTokenManagementService, { useClass: JwtTokenManagementService });
  testContainer.register<RegistrationService>(RegistrationService, { useClass: RegistrationService });
  testContainer.register<PasswordResetService>(PasswordResetService, { useClass: PasswordResetService });
  testContainer.register<DictionaryCardService>(DictionaryCardService, { useClass: DictionaryCardService });
  testContainer.register<DictionarySetService>(DictionarySetService, { useClass: DictionarySetService });
  testContainer.register<SetCardService>(SetCardService, { useClass: SetCardService });
  testContainer.register<UserSetService>(UserSetService, { useClass: UserSetService });
  testContainer.register<TagService>(TagService, { useClass: TagService });
  testContainer.register<CardTagService>(CardTagService, { useClass: CardTagService });
  testContainer.register<SetTagService>(SetTagService, { useClass: SetTagService });

  return testContainer;
}

export async function clearDatabase() {
  await pool.query(`DELETE FROM "DictionaryExample"`);
  await pool.query(`DELETE FROM "DictionaryMeaning"`);
  await pool.query(`DELETE FROM "DictionaryTranslation"`);
  await pool.query(`DELETE FROM "DictionaryCard"`);
  await pool.query(`DELETE FROM "DictionarySet"`);
  await pool.query(`DELETE FROM "Tag"`);
  await pool.query(`DELETE FROM "CardTag"`);
  await pool.query(`DELETE FROM "SetTag"`);
  await pool.query(`DELETE FROM "UserSet"`);
  await pool.query(`DELETE FROM "User"`);
  await pool.query(`DELETE FROM "UserPasswordReset"`);
  await pool.query(`DELETE FROM "UserMetadata"`);
}

export async function closeDatabase() {
  await testDb.close();
}
