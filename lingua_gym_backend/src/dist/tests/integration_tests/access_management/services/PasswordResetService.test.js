var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import PasswordResetService from '../../../../src/services/access_management/PasswordResetService.js';
import 'dotenv/config';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import RegistrationService from '../../../../src/services/access_management/RegistrationService.js';
import { UserRepository } from '../../../../src/repositories/access_management/access_management.js';
import { clearDatabase, closeDatabase, setupTestRepositoryContainer, setupTestServiceContainer } from '../../../utils/di/TestContainer.js';
let userModel;
let registrationService;
let passwordResetService;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield clearDatabase();
    const modelContainer = yield setupTestRepositoryContainer();
    userModel = modelContainer.resolve(UserRepository);
    const serviceContainer = yield setupTestServiceContainer();
    registrationService = serviceContainer.resolve(RegistrationService);
    passwordResetService = serviceContainer.resolve(PasswordResetService);
}));
describe('PasswordResetService Integration Tests', () => {
    let testUser;
    let resetToken;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield clearDatabase();
        const email = `test_${uuidv4()}@example.com`;
        const password = yield bcrypt.hash('password123', 10);
        testUser = yield registrationService.register('testuser', email, password);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield clearDatabase();
        yield closeDatabase();
    }));
    test('should generate a reset token and save it to the database', () => __awaiter(void 0, void 0, void 0, function* () {
        resetToken = yield passwordResetService.requestPasswordReset(testUser.email);
        expect(resetToken).toBeDefined();
    }));
    test('should reset password successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const newPassword = 'newPassword123';
        resetToken = yield passwordResetService.requestPasswordReset(testUser.email);
        yield passwordResetService.resetPassword(resetToken, newPassword);
        const userResult = yield userModel.getUserById(testUser.userId);
        if (!userResult) {
            throw new Error('User not found');
        }
        if (!userResult.passwordHash) {
            throw new Error('Password hash not found');
        }
        expect(userResult.tokenVersion).toBe(testUser.tokenVersion + 1);
        expect(bcrypt.compare(newPassword, userResult.passwordHash)).toBe(true);
    }));
    test('should fail for invalid reset token', () => __awaiter(void 0, void 0, void 0, function* () {
        const error = yield passwordResetService.resetPassword('invalid_token', 'password123').catch(e => e);
        expect(error.message).toContain('Invalid or expired reset token');
    }));
    test('should fail for expired reset token', () => __awaiter(void 0, void 0, void 0, function* () {
        const expiredToken = jwt.sign({ userId: testUser.userId, tokenVersion: testUser.tokenVersion }, process.env.RESET_TOKEN_SECRET || 'SECRET', { expiresIn: '-1s' });
        const error = yield passwordResetService.resetPassword(expiredToken, 'password123').catch(e => e);
        expect(error.message).toContain('Invalid or expired reset token');
    }));
});
