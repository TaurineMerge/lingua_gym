var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { UserRepository, UserMetadataRepository } from '../../../../src/repositories/access_management/access_management.js';
import { v4 as uuidv4 } from 'uuid';
import { clearDatabase, closeDatabase, setupTestRepositoryContainer } from '../../../utils/di/TestContainer.js';
let userModel;
let userMetadataModel;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield clearDatabase();
    const modelContainer = yield setupTestRepositoryContainer();
    userModel = modelContainer.resolve(UserRepository);
    userMetadataModel = modelContainer.resolve(UserMetadataRepository);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield clearDatabase();
    yield closeDatabase();
}));
describe('UserMetadataModel Integration Tests', () => {
    let testUser;
    let testUserMetadata;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        testUser = {
            userId: uuidv4(),
            username: `testUser${Date.now()}`,
            displayName: 'Test User',
            passwordHash: 'hashedpassword',
            email: `testUser${Date.now()}@example.com`,
            tokenVersion: 1,
            emailVerified: false,
        };
        testUserMetadata = {
            userId: testUser.userId,
            lastLogin: new Date(),
            signupDate: new Date(),
        };
        yield userModel.createUser(testUser);
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield clearDatabase();
    }));
    test('should create a user metadata', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(userMetadataModel.createUserMetadata(testUserMetadata)).resolves.toBeUndefined();
    }));
    test('should retrieve a user metadata by user id', () => __awaiter(void 0, void 0, void 0, function* () {
        yield userMetadataModel.createUserMetadata(testUserMetadata);
        const userMetadata = yield userMetadataModel.getUserMetadataById(testUserMetadata.userId);
        expect(userMetadata).toMatchObject({
            userId: testUserMetadata.userId,
            lastLogin: testUserMetadata.lastLogin,
            signupDate: testUserMetadata.signupDate
        });
    }));
    test('should update a user metadata', () => __awaiter(void 0, void 0, void 0, function* () {
        const newLoginDate = new Date();
        yield userMetadataModel.createUserMetadata(testUserMetadata);
        yield userMetadataModel.updateUserMetadataById(testUserMetadata.userId, { lastLogin: newLoginDate });
        const updatedUserMetadata = yield userMetadataModel.getUserMetadataById(testUserMetadata.userId);
        expect(updatedUserMetadata === null || updatedUserMetadata === void 0 ? void 0 : updatedUserMetadata.lastLogin).toEqual(newLoginDate);
    }));
    test('should delete a user metadata', () => __awaiter(void 0, void 0, void 0, function* () {
        yield userMetadataModel.createUserMetadata(testUserMetadata);
        yield userMetadataModel.deleteUserMetadataById(testUserMetadata.userId);
        const userMetadata = yield userMetadataModel.getUserMetadataById(testUserMetadata.userId);
        expect(userMetadata).toBeNull();
    }));
});
