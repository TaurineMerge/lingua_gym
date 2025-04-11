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
import { UserModel, UserMetadataModel } from '../../../../src/models/access_management/access_management.js';
import { v4 as uuidv4 } from 'uuid';
const db = Database.getInstance();
const userModel = new UserModel(db);
const userMetadataModel = new UserMetadataModel(db);
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield db.close();
}));
describe('UserMetadataModel Integration Tests', () => {
    let testUser;
    let testUserMetadata;
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
        testUserMetadata = {
            user_id: testUser.user_id,
            last_login: new Date(),
            signup_date: new Date(),
        };
        yield userModel.createUser(testUser);
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield userMetadataModel.deleteUserMetadataById(testUserMetadata.user_id);
        yield userModel.deleteUserById(testUser.user_id);
    }));
    test('should create a user metadata', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(userMetadataModel.createUserMetadata(testUserMetadata)).resolves.toBeUndefined();
    }));
    test('should retrieve a user metadata by user id', () => __awaiter(void 0, void 0, void 0, function* () {
        yield userMetadataModel.createUserMetadata(testUserMetadata);
        const userMetadata = yield userMetadataModel.getUserMetadataById(testUserMetadata.user_id);
        expect(userMetadata).toMatchObject({
            user_id: testUserMetadata.user_id,
            last_login: testUserMetadata.last_login,
            signup_date: testUserMetadata.signup_date
        });
    }));
    test('should update a user metadata', () => __awaiter(void 0, void 0, void 0, function* () {
        const newLoginDate = new Date();
        yield userMetadataModel.createUserMetadata(testUserMetadata);
        yield userMetadataModel.updateUserMetadataById(testUserMetadata.user_id, { last_login: newLoginDate });
        const updatedUserMetadata = yield userMetadataModel.getUserMetadataById(testUserMetadata.user_id);
        expect(updatedUserMetadata === null || updatedUserMetadata === void 0 ? void 0 : updatedUserMetadata.last_login).toEqual(newLoginDate);
    }));
    test('should delete a user metadata', () => __awaiter(void 0, void 0, void 0, function* () {
        yield userMetadataModel.createUserMetadata(testUserMetadata);
        yield userMetadataModel.deleteUserMetadataById(testUserMetadata.user_id);
        const userMetadata = yield userMetadataModel.getUserMetadataById(testUserMetadata.user_id);
        expect(userMetadata).toBeNull();
    }));
});
