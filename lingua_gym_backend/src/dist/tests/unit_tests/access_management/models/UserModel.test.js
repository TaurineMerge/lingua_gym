var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import UserModel from '../../../../src/models/access_management/UserModel';
import logger from '../../../../src/utils/logger/Logger';
jest.mock('../../../../src/utils/logger/logger', () => ({
    info: jest.fn(),
    error: jest.fn(),
}));
describe('UserModel', () => {
    let db;
    let userModel;
    beforeEach(() => {
        db = { query: jest.fn() };
        userModel = new UserModel(db);
        jest.clearAllMocks();
    });
    const mockUser = {
        user_id: '123',
        username: 'testUser',
        display_name: 'Test User',
        password_hash: 'hashed_password',
        email: 'test@example.com',
        profile_picture: 'avatar.png',
        email_verified: true,
        token_version: 1,
    };
    test('createUser() should call db.query() with correct arguments', () => __awaiter(void 0, void 0, void 0, function* () {
        yield userModel.createUser(mockUser);
        expect(db.query).toHaveBeenCalledWith('INSERT INTO "User" (user_id, username, display_name, password_hash, email, token_version, profile_picture, email_verified) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [
            mockUser.user_id,
            mockUser.username,
            mockUser.display_name,
            mockUser.password_hash,
            mockUser.email,
            mockUser.token_version,
            mockUser.profile_picture,
            mockUser.email_verified,
        ]);
        expect(logger.info).toHaveBeenCalledWith('Creating user...');
        expect(logger.info).toHaveBeenCalledWith('User created successfully');
    }));
    test('createUser() should log an error and throw if db.query() fails', () => __awaiter(void 0, void 0, void 0, function* () {
        const error = new Error('Database error');
        db.query.mockRejectedValue(error);
        yield expect(userModel.createUser(mockUser)).rejects.toThrow(error);
        expect(logger.error).toHaveBeenCalledWith('Error creating user:', error);
    }));
    test('getUserById() should return a user if found', () => __awaiter(void 0, void 0, void 0, function* () {
        db.query.mockResolvedValue({
            rows: [mockUser],
            rowCount: 1,
            command: 'SELECT',
            oid: 0,
            fields: [],
        });
        const result = yield userModel.getUserById(mockUser.user_id);
        expect(db.query).toHaveBeenCalledWith('SELECT * FROM "User" WHERE user_id = $1', [mockUser.user_id]);
        expect(result).toEqual(mockUser);
    }));
    test('getUserById() should return null if no user found', () => __awaiter(void 0, void 0, void 0, function* () {
        db.query.mockResolvedValue({ rows: [], rowCount: 0, command: '', oid: 0, fields: [] });
        const result = yield userModel.getUserById(mockUser.user_id);
        expect(result).toBeNull();
    }));
    test('getUserById() should throw an error if db.query() fails', () => __awaiter(void 0, void 0, void 0, function* () {
        const error = new Error('Database error');
        db.query.mockRejectedValue(error);
        yield expect(userModel.getUserById(mockUser.user_id)).rejects.toThrow(error);
    }));
    test('getUserByEmail() should return a user if found', () => __awaiter(void 0, void 0, void 0, function* () {
        db.query.mockResolvedValue({
            rows: [mockUser],
            rowCount: 1,
            command: 'SELECT',
            oid: 0,
            fields: [],
        });
        const result = yield userModel.getUserByEmail(mockUser.email);
        expect(db.query).toHaveBeenCalledWith('SELECT * FROM "User" WHERE email = $1', [mockUser.email]);
        expect(result).toEqual(mockUser);
    }));
    test('getUserByUsername() should return a user if found', () => __awaiter(void 0, void 0, void 0, function* () {
        db.query.mockResolvedValue({
            rows: [mockUser],
            rowCount: 1,
            command: 'SELECT',
            oid: 0,
            fields: [],
        });
        const result = yield userModel.getUserByUsername(mockUser.username);
        expect(db.query).toHaveBeenCalledWith('SELECT * FROM "User" WHERE username = $1', [mockUser.username]);
        expect(result).toEqual(mockUser);
    }));
    test('updateUser() should call db.query() with correct SQL and parameters', () => __awaiter(void 0, void 0, void 0, function* () {
        const updates = { display_name: 'New Name', email_verified: false };
        const query = 'UPDATE "User" SET "display_name" = $2, "email_verified" = $3 WHERE user_id = $1';
        yield userModel.updateUserById(mockUser.user_id, updates);
        expect(db.query).toHaveBeenCalledWith(query, [mockUser.user_id, updates.display_name, updates.email_verified]);
    }));
    test('updateUser() should throw an error if db.query() fails', () => __awaiter(void 0, void 0, void 0, function* () {
        const error = new Error('Update failed');
        db.query.mockRejectedValue(error);
        yield expect(userModel.updateUserById(mockUser.user_id, { display_name: 'New Name' })).rejects.toThrow(error);
    }));
    test('deleteUser() should call db.query() with correct SQL', () => __awaiter(void 0, void 0, void 0, function* () {
        yield userModel.deleteUserById(mockUser.user_id);
        expect(db.query).toHaveBeenCalledWith('DELETE FROM "User" WHERE user_id = $1', [mockUser.user_id]);
    }));
    test('deleteUser() should throw an error if db.query() fails', () => __awaiter(void 0, void 0, void 0, function* () {
        const error = new Error('Delete failed');
        db.query.mockRejectedValue(error);
        yield expect(userModel.deleteUserById(mockUser.user_id)).rejects.toThrow(error);
    }));
});
