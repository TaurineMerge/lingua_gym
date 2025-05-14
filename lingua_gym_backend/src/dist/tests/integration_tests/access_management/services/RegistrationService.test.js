var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import RegistrationService from '../../../../src/services/access_management/RegistrationService.js';
import { UserRepository, UserMetadataRepository } from '../../../../src/repositories/access_management/access_management.js';
import bcrypt from 'bcrypt';
import { clearDatabase, closeDatabase, setupTestRepositoryContainer, setupTestServiceContainer } from '../../../utils/di/TestContainer.js';
let userModel;
let userMetadataModel;
let registrationService;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield clearDatabase();
    const modelContainer = yield setupTestRepositoryContainer();
    userModel = modelContainer.resolve(UserRepository);
    const serviceContainer = yield setupTestServiceContainer();
    userMetadataModel = serviceContainer.resolve(UserMetadataRepository);
    registrationService = serviceContainer.resolve(RegistrationService);
}));
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield clearDatabase();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield clearDatabase();
    yield closeDatabase();
}));
describe('RegistrationService (Integration)', () => {
    test('should register a new user', () => __awaiter(void 0, void 0, void 0, function* () {
        const password = 'password';
        const userData = {
            username: 'testuser',
            email: 'test@example.com',
            displayName: 'Test User',
            tokenVersion: 0,
            emailVerified: false
        };
        yield registrationService.register(userData.username, userData.email, password, userData.displayName);
        const userResult = yield userModel.getUserByEmail('test@example.com');
        expect(userResult).toMatchObject(Object.assign(Object.assign({}, userData), { passwordHash: expect.any(String), userId: expect.any(String) }));
        expect(bcrypt.compareSync(password, (userResult === null || userResult === void 0 ? void 0 : userResult.passwordHash) == null ? expect.any(String) : userResult.passwordHash)).toBe(true);
        const metadataResult = yield userMetadataModel.getUserMetadataById((userResult === null || userResult === void 0 ? void 0 : userResult.userId) == null ? expect.any(String) : userResult.userId);
        expect(metadataResult).toMatchObject({ userId: (userResult === null || userResult === void 0 ? void 0 : userResult.userId) == null ? expect.any(String) : userResult.userId, signupDate: expect.any(Date), lastLogin: null });
    }));
    test('should fail if email already exists', () => __awaiter(void 0, void 0, void 0, function* () {
        yield registrationService.register('testuser', 'test@example.com', 'password123');
        yield expect(registrationService.register('anotheruser', 'test@example.com', 'password456')).rejects.toThrow('Email already exists');
    }));
    test('should fail if username already exists', () => __awaiter(void 0, void 0, void 0, function* () {
        yield registrationService.register('testuser', 'test@example.com', 'password123');
        yield expect(registrationService.register('testuser', 'newemail@example.com', 'password456')).rejects.toThrow('Username already exists');
    }));
});
