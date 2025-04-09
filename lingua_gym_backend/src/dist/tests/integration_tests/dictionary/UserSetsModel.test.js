var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Database from '../../../src/database/config/db-connection.js';
import { UserSetsModel, DictionarySetModel } from '../../../src/models/dictionary/dictionary.js';
import { UserModel } from '../../../src/models/access_management/access_management.js';
import { Permission } from '../../../src/database/interfaces/DbInterfaces.js';
import { v4 as uuidv4 } from 'uuid';
import hashPassword from '../../../src/utils/hash/HashPassword.js';
let db;
let userSetsModel;
let userModel;
let setModel;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    db = Database.getInstance();
    userSetsModel = new UserSetsModel(db);
    userModel = new UserModel(db);
    setModel = new DictionarySetModel(db);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield db.close();
}));
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield clearDatabase();
}));
const clearDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    yield db.query('DELETE FROM "UserSets";');
    yield db.query('DELETE FROM "DictionarySets";');
    yield db.query('DELETE FROM "User";');
});
const createUser = () => __awaiter(void 0, void 0, void 0, function* () {
    const id = uuidv4();
    const pwdHash = hashPassword('password123');
    const username = Array(5).fill(null).map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
    const email = Array(5).fill(null).map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('') + '@example.com';
    const tokenVersion = 1;
    const displayName = 'Test User';
    const emailVerified = false;
    const user = {
        user_id: id,
        username: username,
        email: email,
        password_hash: pwdHash,
        display_name: displayName,
        email_verified: emailVerified,
        token_version: tokenVersion
    };
    yield userModel.createUser(user);
    return id;
});
const createSet = (ownerId) => __awaiter(void 0, void 0, void 0, function* () {
    const id = uuidv4();
    const name = 'Test set';
    const set = {
        dictionarySetId: id,
        name: name,
        ownerId: ownerId,
        description: 'Set for testing',
        isPublic: false,
        createdAt: new Date(),
    };
    yield setModel.createSet(set);
    return id;
});
describe('UserSetsModel integration', () => {
    test('addUserToSet should insert and return UserSets record', () => __awaiter(void 0, void 0, void 0, function* () {
        const userId = yield createUser();
        const setId = yield createSet(userId);
        const permission = Permission.WRITE;
        const result = yield userSetsModel.addUserToSet(userId, setId, permission);
        expect(result).not.toBeNull();
        expect(result.userId).toBe(userId);
        expect(result.setId).toBe(setId);
        expect(result.permission).toBe(permission);
    }));
    test('removeUserFromSet should delete and return removed UserSets record', () => __awaiter(void 0, void 0, void 0, function* () {
        const userId = yield createUser();
        const setId = yield createSet(userId);
        const permission = Permission.READ;
        yield userSetsModel.addUserToSet(userId, setId, permission);
        const removed = yield userSetsModel.removeUserFromSet(userId, setId);
        expect(removed).not.toBeNull();
        expect(removed.userId).toBe(userId);
        expect(removed.setId).toBe(setId);
        expect(removed.permission).toBe(permission);
    }));
    test('removeUserFromSet should return null if no link exists', () => __awaiter(void 0, void 0, void 0, function* () {
        const userId = yield createUser();
        const setId = yield createSet(userId);
        const removed = yield userSetsModel.removeUserFromSet(userId, setId);
        expect(removed).toBeNull();
    }));
    test('getUsersBySet should return all users linked to set', () => __awaiter(void 0, void 0, void 0, function* () {
        const user1 = yield createUser();
        const user2 = yield createUser();
        const setId = yield createSet(user1);
        const user1Permission = Permission.WRITE;
        const user2Permission = Permission.READ;
        yield userSetsModel.addUserToSet(user1, setId, user1Permission);
        yield userSetsModel.addUserToSet(user2, setId, user2Permission);
        const users = yield userSetsModel.getUsersBySet(setId);
        expect(users).not.toBeNull();
        expect(users.length).toBe(2);
        const userIds = users.map(u => u.user_id);
        expect(userIds).toContain(user1);
        expect(userIds).toContain(user2);
    }));
    test('getUsersBySet should return null if no users in set', () => __awaiter(void 0, void 0, void 0, function* () {
        const userId = yield createUser();
        const setId = yield createSet(userId);
        const users = yield userSetsModel.getUsersBySet(setId);
        expect(users).toBeNull();
    }));
    test('getUserPermission should return correct permission', () => __awaiter(void 0, void 0, void 0, function* () {
        const userId = yield createUser();
        const setId = yield createSet(userId);
        const userPermission = Permission.WRITE;
        yield userSetsModel.addUserToSet(userId, setId, userPermission);
        const permission = yield userSetsModel.getUserPermission(userId, setId);
        expect(permission).toBe(userPermission);
    }));
    test('getUserPermission should return null if user not linked', () => __awaiter(void 0, void 0, void 0, function* () {
        const userId = yield createUser();
        const setId = yield createSet(userId);
        const permission = yield userSetsModel.getUserPermission(userId, setId);
        expect(permission).toBeNull();
    }));
});
