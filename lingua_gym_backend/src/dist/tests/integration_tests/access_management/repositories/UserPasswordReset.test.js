var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { UserRepository, UserPasswordResetRepository } from '../../../../src/repositories/access_management/access_management.js';
import { v4 as uuidv4 } from 'uuid';
import { clearDatabase, closeDatabase, setupTestRepositoryContainer } from '../../../utils/di/TestContainer.js';
let userModel;
let passwordResetModel;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield clearDatabase();
    const modelContainer = yield setupTestRepositoryContainer();
    userModel = modelContainer.resolve(UserRepository);
    passwordResetModel = modelContainer.resolve(UserPasswordResetRepository);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield clearDatabase();
    yield closeDatabase();
}));
describe('UserPasswordResetModel Integration Tests', () => {
    let testUser;
    let testPasswordReset;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        testUser = {
            userId: uuidv4(),
            username: `testuser_${Date.now()}`,
            displayName: 'Test User',
            passwordHash: 'hashedpassword',
            email: `testuser_${Date.now()}@example.com`,
            tokenVersion: 1,
            emailVerified: false,
        };
        yield userModel.createUser(testUser);
        testPasswordReset = {
            userId: testUser.userId,
            passwordResetToken: uuidv4(),
            passwordResetTokenExpiration: new Date(Date.now() + 1000 * 60 * 60),
        };
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield closeDatabase();
    }));
    test('should create a password reset entry', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(passwordResetModel.createResetEntry(testPasswordReset)).resolves.toBeUndefined();
    }));
    test('should retrieve a password reset entry by token', () => __awaiter(void 0, void 0, void 0, function* () {
        yield passwordResetModel.createResetEntry(testPasswordReset);
        const resetEntry = yield passwordResetModel.getByToken(testPasswordReset.passwordResetToken);
        expect(resetEntry).toMatchObject({
            user_id: testPasswordReset.userId,
            password_reset_token: testPasswordReset.passwordResetToken,
        });
    }));
    test('should invalidate a password reset token', () => __awaiter(void 0, void 0, void 0, function* () {
        yield passwordResetModel.createResetEntry(testPasswordReset);
        yield passwordResetModel.invalidateToken(testPasswordReset.passwordResetToken);
        const resetEntry = yield passwordResetModel.getByToken(testPasswordReset.passwordResetToken);
        expect(resetEntry).toBeNull();
    }));
    test('should delete password reset request by user ID', () => __awaiter(void 0, void 0, void 0, function* () {
        yield passwordResetModel.createResetEntry(testPasswordReset);
        yield passwordResetModel.deleteRequestByUserId(testPasswordReset.userId);
        const resetEntry = yield passwordResetModel.getByToken(testPasswordReset.passwordResetToken);
        expect(resetEntry).toBeNull();
    }));
    test('should delete expired password reset requests', () => __awaiter(void 0, void 0, void 0, function* () {
        const expiredPasswordReset = {
            userId: testUser.userId,
            passwordResetToken: uuidv4(),
            passwordResetTokenExpiration: new Date(Date.now() - 1000 * 60),
        };
        yield passwordResetModel.createResetEntry(expiredPasswordReset);
        yield passwordResetModel.deleteExpiredRequests();
        const resetEntry = yield passwordResetModel.getByToken(expiredPasswordReset.passwordResetToken);
        expect(resetEntry).toBeNull();
    }));
});
