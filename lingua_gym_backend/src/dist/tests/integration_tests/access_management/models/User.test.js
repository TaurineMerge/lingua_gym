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
import { UserModel } from '../../../../src/models/access_management/access_management.js';
import { v4 as uuidv4 } from 'uuid';
const db = Database.getInstance();
const userModel = new UserModel(db);
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield db.close();
}));
describe('UserModel Integration Tests', () => {
    let testUser;
    beforeEach(() => {
        testUser = {
            user_id: uuidv4(),
            username: 'testuser',
            display_name: 'Test User',
            password_hash: 'hashedpassword',
            email: 'test@example.com',
            token_version: 1,
            email_verified: false,
        };
    });
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield userModel.deleteUserById(testUser.user_id);
    }));
    test('should create a user', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(userModel.createUser(testUser)).resolves.toBeUndefined();
    }));
    test('should retrieve a user by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        yield userModel.createUser(testUser);
        const user = yield userModel.getUserById(testUser.user_id);
        expect(user).toMatchObject({
            user_id: testUser.user_id,
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
        yield userModel.updateUserById(testUser.user_id, { display_name: 'Updated Name' });
        const updatedUser = yield userModel.getUserById(testUser.user_id);
        expect(updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.display_name).toBe('Updated Name');
    }));
    test('should delete a user', () => __awaiter(void 0, void 0, void 0, function* () {
        yield userModel.createUser(testUser);
        yield userModel.deleteUserById(testUser.user_id);
        const user = yield userModel.getUserById(testUser.user_id);
        expect(user).toBeNull();
    }));
});
