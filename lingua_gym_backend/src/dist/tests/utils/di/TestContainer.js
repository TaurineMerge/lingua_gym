var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import 'reflect-metadata';
import dotenv from 'dotenv';
import { container } from 'tsyringe';
import { Pool } from 'pg';
import Database from '../../../src/database/config/db-connection.js';
import { UserModel, UserMetadataModel, UserPasswordResetModel } from '../../../src/models/access_management/access_management.js';
import { DictionaryCardModel, DictionarySetModel, SetCardModel, UserSetModel } from '../../../src/models/dictionary/dictionary.js';
import { TagModel, CardTagModel, SetTagModel } from '../../../src/models/tag/tag.js';
import { AuthenticationService, JwtTokenManagementService, RegistrationService, PasswordResetService } from '../../../src/services/access_management/access_management.js';
import { DictionaryCardService, DictionarySetService, SetCardService, UserSetService } from '../../../src/services/dictionary/dictionary.js';
import { TagService, CardTagService, SetTagService } from '../../../src/services/tag/tag.js';
dotenv.config({ path: '.env.test' });
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'dbname',
    max: parseInt(process.env.DB_MAX_CONNECTIONS || '10', 10),
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 2000,
});
export const testDb = new Database(pool);
export function setupTestModelContainer() {
    return __awaiter(this, void 0, void 0, function* () {
        const testContainer = container.createChildContainer();
        testContainer.registerInstance(Database, testDb);
        testContainer.register(DictionaryCardModel, { useClass: DictionaryCardModel });
        testContainer.register(UserModel, { useClass: UserModel });
        testContainer.register(UserMetadataModel, { useClass: UserMetadataModel });
        testContainer.register(UserPasswordResetModel, { useClass: UserPasswordResetModel });
        testContainer.register(DictionarySetModel, { useClass: DictionarySetModel });
        testContainer.register(SetCardModel, { useClass: SetCardModel });
        testContainer.register(UserSetModel, { useClass: UserSetModel });
        testContainer.register(TagModel, { useClass: TagModel });
        testContainer.register(CardTagModel, { useClass: CardTagModel });
        testContainer.register(SetTagModel, { useClass: SetTagModel });
        return testContainer;
    });
}
export function setupTestServiceContainer() {
    return __awaiter(this, void 0, void 0, function* () {
        const testContainer = container.createChildContainer();
        testContainer.registerInstance(Database, testDb);
        testContainer.register(AuthenticationService, { useClass: AuthenticationService });
        testContainer.register(JwtTokenManagementService, { useClass: JwtTokenManagementService });
        testContainer.register(RegistrationService, { useClass: RegistrationService });
        testContainer.register(PasswordResetService, { useClass: PasswordResetService });
        testContainer.register(DictionaryCardService, { useClass: DictionaryCardService });
        testContainer.register(DictionarySetService, { useClass: DictionarySetService });
        testContainer.register(SetCardService, { useClass: SetCardService });
        testContainer.register(UserSetService, { useClass: UserSetService });
        testContainer.register(TagService, { useClass: TagService });
        testContainer.register(CardTagService, { useClass: CardTagService });
        testContainer.register(SetTagService, { useClass: SetTagService });
        return testContainer;
    });
}
export function clearDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        yield pool.query(`DELETE FROM "DictionaryExample"`);
        yield pool.query(`DELETE FROM "DictionaryMeaning"`);
        yield pool.query(`DELETE FROM "DictionaryTranslation"`);
        yield pool.query(`DELETE FROM "DictionaryCard"`);
        yield pool.query(`DELETE FROM "DictionarySet"`);
        yield pool.query(`DELETE FROM "Tag"`);
        yield pool.query(`DELETE FROM "CardTag"`);
        yield pool.query(`DELETE FROM "SetTag"`);
        yield pool.query(`DELETE FROM "UserSet"`);
        yield pool.query(`DELETE FROM "User"`);
        yield pool.query(`DELETE FROM "UserPasswordReset"`);
        yield pool.query(`DELETE FROM "UserMetadata"`);
    });
}
export function closeDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        yield testDb.close();
    });
}
