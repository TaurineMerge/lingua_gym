var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { UserMetadataRepository } from '../../../../src/repositories/access_management/access_management.js';
import logger from '../../../../src/utils/logger/Logger.js';
jest.mock('../../../../src/utils/logger/logger', () => ({
    info: jest.fn(),
    error: jest.fn(),
}));
describe('UserModel', () => {
    let db;
    let userMetadataModel;
    beforeEach(() => {
        db = {
            query: jest.fn(),
        };
        userMetadataModel = new UserMetadataRepository(db);
        jest.clearAllMocks();
    });
    test('createUserMetadata() should call db.query() with correct arguments', () => __awaiter(void 0, void 0, void 0, function* () {
        const userMetadata = {
            userId: '123',
            lastLogin: new Date(),
            signupDate: new Date(),
        };
        yield userMetadataModel.createUserMetadata(userMetadata);
        expect(db.query).toHaveBeenCalledWith(`
      INSERT INTO "UserMetadata" (user_id, last_login, signup_date)
      VALUES ($1, $2, $3)
    `, [userMetadata.userId, userMetadata.lastLogin, userMetadata.signupDate]);
        expect(logger.info).toHaveBeenCalledWith('Creating user metadata...');
        expect(logger.info).toHaveBeenCalledWith('User metadata created successfully');
    }));
    test('createUserMetadata() should log an error and throw if db.query() fails', () => __awaiter(void 0, void 0, void 0, function* () {
        const userMetadata = {
            userId: '123',
            lastLogin: new Date(),
            signupDate: new Date(),
        };
        const dbError = new Error('Database connection failed');
        db.query.mockRejectedValue(dbError);
        yield expect(userMetadataModel.createUserMetadata(userMetadata)).rejects.toThrow(dbError);
        expect(logger.error).toHaveBeenCalledWith('Error creating user metadata:', dbError);
    }));
});
