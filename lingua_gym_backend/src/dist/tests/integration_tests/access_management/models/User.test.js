var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { UserModel } from '../../../../src/repositories/access_management/access_management.js';
import { v4 as uuidv4 } from 'uuid';
import { clearDatabase, closeDatabase, setupTestModelContainer } from '../../../utils/di/TestContainer.js';
let userModel;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield clearDatabase();
    const modelContainer = yield setupTestModelContainer();
    userModel = modelContainer.resolve(UserModel);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield clearDatabase();
    yield closeDatabase();
}));
describe('UserModel Integration Tests', () => {
    let testUser;
    beforeEach(() => {
        testUser = {
            userId: uuidv4(),
            username: 'testuser',
            displayName: 'Test User',
            passwordHash: 'hashedpassword',
            email: 'test@example.com',
            tokenVersion: 1,
            emailVerified: false,
        };
    });
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield clearDatabase();
    }));
    test('should create a user', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(userModel.createUser(testUser)).resolves.toBeUndefined();
    }));
    test('should retrieve a user by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        yield userModel.createUser(testUser);
        const user = yield userModel.getUserById(testUser.userId);
        expect(user).toMatchObject({
            userId: testUser.userId,
            username: testUser.username,
        });
    }));
    test('should retrieve a user by email', () => __awaiter(void 0, void 0, void 0, function* () {
        yield userModel.createUser(testUser);
        const user = yield userModel.getUserByEmail(testUser.email);
        expect(user).toMatchObject({ email: testUser.email });
    }));
    test('should retrieve a user by username', () => __awaiter(void 0, void 0, void 0, function* () {
        yield userModel.createUser(testUser);
        const user = yield userModel.getUserByUsername(testUser.username);
        expect(user).toMatchObject({ username: testUser.username });
    }));
    test('should update a user', () => __awaiter(void 0, void 0, void 0, function* () {
        yield userModel.createUser(testUser);
        yield userModel.updateUserById(testUser.userId, { displayName: 'Updated Name' });
        const updatedUser = yield userModel.getUserById(testUser.userId);
        expect(updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.displayName).toBe('Updated Name');
    }));
    test('should delete a user', () => __awaiter(void 0, void 0, void 0, function* () {
        yield userModel.createUser(testUser);
        yield userModel.deleteUserById(testUser.userId);
        const user = yield userModel.getUserById(testUser.userId);
        expect(user).toBeNull();
    }));
});
