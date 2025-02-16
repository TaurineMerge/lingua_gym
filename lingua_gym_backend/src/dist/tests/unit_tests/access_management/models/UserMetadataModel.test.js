var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import UserMetadataModel from '../../../../src/models/access_management/UserMetadataModel';
import logger from '../../../../src/utils/logger/Logger';
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
        userMetadataModel = new UserMetadataModel(db);
        jest.clearAllMocks();
    });
    test('createUserMetadata() should call db.query() with correct arguments', () => __awaiter(void 0, void 0, void 0, function* () {
        const userMetadata = {
            user_id: '123',
            last_login: new Date(),
            signup_date: new Date(),
        };
        yield userMetadataModel.createUserMetadata(userMetadata);
        expect(db.query).toHaveBeenCalledWith(`
      INSERT INTO "UserMetadata" (user_id, last_login, signup_date)
      VALUES ($1, $2, $3)
    `, [userMetadata.user_id, userMetadata.last_login, userMetadata.signup_date]);
        expect(logger.info).toHaveBeenCalledWith('Creating user metadata...');
        expect(logger.info).toHaveBeenCalledWith('User metadata created successfully');
    }));
    test('createUserMetadata() should log an error and throw if db.query() fails', () => __awaiter(void 0, void 0, void 0, function* () {
        const userMetadata = {
            user_id: '123',
            last_login: new Date(),
            signup_date: new Date(),
        };
        const dbError = new Error('Database connection failed');
        db.query.mockRejectedValue(dbError);
        yield expect(userMetadataModel.createUserMetadata(userMetadata)).rejects.toThrow(dbError);
        expect(logger.error).toHaveBeenCalledWith('Error creating user metadata:', dbError);
    }));
});
