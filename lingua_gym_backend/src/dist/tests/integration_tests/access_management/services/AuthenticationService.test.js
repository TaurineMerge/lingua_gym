var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AuthenticationService, RegistrationService } from '../../../../src/services/access_management/access_management.js';
import { UserModel } from '../../../../src/models/access_management/access_management.js';
import bcrypt from 'bcrypt';
import { clearDatabase, closeDatabase, setupTestModelContainer, setupTestServiceContainer } from '../../../utils/di/TestContainer.js';
let userModel;
let authService;
let registrationService;
const testUserData = {
    userId: '',
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    passwordHash: bcrypt.hashSync('password123', 10),
    tokenVersion: 0,
    emailVerified: true,
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield clearDatabase();
    const modelContainer = yield setupTestModelContainer();
    userModel = modelContainer.resolve(UserModel);
    const serviceContainer = yield setupTestServiceContainer();
    authService = serviceContainer.resolve(AuthenticationService);
    registrationService = serviceContainer.resolve(RegistrationService);
    testUserData.userId = (yield registrationService.register(testUserData.username, testUserData.email, testUserData.password)).userId;
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield clearDatabase();
    yield closeDatabase();
}));
describe('AuthenticationService (Integration)', () => {
    test('should login with correct credentials', () => __awaiter(void 0, void 0, void 0, function* () {
        const tokens = yield authService.login(testUserData.email, testUserData.password);
        expect(tokens).toHaveProperty('accessToken');
        expect(tokens).toHaveProperty('refreshToken');
    }));
    test('should fail to login with incorrect password', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(authService.login(testUserData.email, 'wrongpassword')).rejects.toThrow('Invalid password');
    }));
    test('should fail to login with non-existing email', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(authService.login('nonexistent@example.com', 'password123')).rejects.toThrow('User not found');
    }));
    test('should invalidate refresh token on logout', () => __awaiter(void 0, void 0, void 0, function* () {
        yield authService.logout(testUserData.userId);
        const updatedUser = yield userModel.getUserById(testUserData.userId);
        expect(updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.tokenVersion).toBe(testUserData.tokenVersion + 1);
    }));
});
