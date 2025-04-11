var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Database from '../../../../src/database/config/db-connection.js';
import { UserModel, UserPasswordResetModel } from '../../../../src/models/access_management/access_management.js';
import { v4 as uuidv4 } from 'uuid';
const db = Database.getInstance();
const userModel = new UserModel(db);
const passwordResetModel = new UserPasswordResetModel(db);
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield db.close();
}));
describe('UserPasswordResetModel Integration Tests', () => {
    let testUser;
    let testPasswordReset;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        testUser = {
            user_id: uuidv4(),
            username: `testuser_${Date.now()}`,
            display_name: 'Test User',
            password_hash: 'hashedpassword',
            email: `testuser_${Date.now()}@example.com`,
            token_version: 1,
            email_verified: false,
        };
        yield userModel.createUser(testUser);
        testPasswordReset = {
            user_id: testUser.user_id,
            password_reset_token: uuidv4(),
            password_reset_token_expiration: new Date(Date.now() + 1000 * 60 * 60),
        };
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield passwordResetModel.deleteRequestByUserId(testUser.user_id);
        yield userModel.deleteUserById(testUser.user_id);
    }));
    test('should create a password reset entry', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(passwordResetModel.createResetEntry(testPasswordReset)).resolves.toBeUndefined();
    }));
    test('should retrieve a password reset entry by token', () => __awaiter(void 0, void 0, void 0, function* () {
        yield passwordResetModel.createResetEntry(testPasswordReset);
        const resetEntry = yield passwordResetModel.getByToken(testPasswordReset.password_reset_token);
        expect(resetEntry).toMatchObject({
            user_id: testPasswordReset.user_id,
            password_reset_token: testPasswordReset.password_reset_token,
        });
    }));
    test('should invalidate a password reset token', () => __awaiter(void 0, void 0, void 0, function* () {
        yield passwordResetModel.createResetEntry(testPasswordReset);
        yield passwordResetModel.invalidateToken(testPasswordReset.password_reset_token);
        const resetEntry = yield passwordResetModel.getByToken(testPasswordReset.password_reset_token);
        expect(resetEntry).toBeNull();
    }));
    test('should delete password reset request by user ID', () => __awaiter(void 0, void 0, void 0, function* () {
        yield passwordResetModel.createResetEntry(testPasswordReset);
        yield passwordResetModel.deleteRequestByUserId(testPasswordReset.user_id);
        const resetEntry = yield passwordResetModel.getByToken(testPasswordReset.password_reset_token);
        expect(resetEntry).toBeNull();
    }));
    test('should delete expired password reset requests', () => __awaiter(void 0, void 0, void 0, function* () {
        const expiredPasswordReset = {
            user_id: testUser.user_id,
            password_reset_token: uuidv4(),
            password_reset_token_expiration: new Date(Date.now() - 1000 * 60),
        };
        yield passwordResetModel.createResetEntry(expiredPasswordReset);
        yield passwordResetModel.deleteExpiredRequests();
        const resetEntry = yield passwordResetModel.getByToken(expiredPasswordReset.password_reset_token);
        expect(resetEntry).toBeNull();
    }));
});
