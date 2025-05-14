var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { UserSetModel } from '../../../../src/repositories/dictionary/dictionary.js';
import { Permission } from '../../../../src/database/interfaces/DbInterfaces.js';
describe('UserSetsModel', () => {
    let mockDb;
    let userSetModel;
    let mockUser;
    let mockUsers;
    beforeEach(() => {
        jest.clearAllMocks();
        mockDb = {
            query: jest.fn(),
        };
        userSetModel = new UserSetModel(mockDb);
        mockUser = { userId: 'user1', setId: 'set1', permission: Permission.WRITE };
        mockUsers = [mockUser, { userId: 'user2', setId: 'set1', permission: Permission.READ }];
    });
    test('addUserToSet - should add a user to a set and return the added entry', () => __awaiter(void 0, void 0, void 0, function* () {
        mockDb.query.mockResolvedValueOnce({ rows: [mockUser], rowCount: 1, command: 'INSERT', oid: 0, fields: [] });
        const result = yield userSetModel.addUserToSet(mockUser.userId, mockUser.setId, Permission.WRITE);
        expect(result).toEqual(mockUser);
    }));
    test('addUserToSet - should throw an error if database query fails', () => __awaiter(void 0, void 0, void 0, function* () {
        mockDb.query.mockRejectedValueOnce(new Error('DB error'));
        yield expect(userSetModel.addUserToSet(mockUser.userId, mockUser.setId, mockUser.permission)).rejects.toThrow('DB error');
        expect(mockDb.query).toHaveBeenCalled();
    }));
    test('removeUserFromSet - should remove a user from a set and return the removed entry', () => __awaiter(void 0, void 0, void 0, function* () {
        mockDb.query.mockResolvedValueOnce({ rows: [mockUser], rowCount: 1, command: 'DELETE', oid: 0, fields: [] });
        const result = yield userSetModel.removeUserFromSet(mockUser.userId, mockUser.setId);
        expect(result).toEqual(mockUser);
    }));
    test('removeUserFromSet - should return null if no entry was removed', () => __awaiter(void 0, void 0, void 0, function* () {
        mockDb.query.mockResolvedValueOnce({ rows: [], rowCount: 0, command: 'DELETE', oid: 0, fields: [] });
        const result = yield userSetModel.removeUserFromSet(mockUser.userId, mockUser.setId);
        expect(mockDb.query).toHaveBeenCalled();
        expect(result).toBeNull();
    }));
    test('getUsersBySet - should return users if found', () => __awaiter(void 0, void 0, void 0, function* () {
        mockDb.query.mockResolvedValueOnce({ rows: mockUsers, rowCount: 2, command: 'INSERT', oid: 0, fields: [] });
        const result = yield userSetModel.getUsersBySet('set1');
        expect(mockDb.query).toHaveBeenCalled();
        expect(result).toEqual(mockUsers);
    }));
    test('getUsersBySet - should return null if no users are found', () => __awaiter(void 0, void 0, void 0, function* () {
        mockDb.query.mockResolvedValueOnce({ rows: [], rowCount: 0, command: 'INSERT', oid: 0, fields: [] });
        const result = yield userSetModel.getUsersBySet('set1');
        expect(mockDb.query).toHaveBeenCalled();
        expect(result).toBeNull();
    }));
    test('getUserRole - should return the user permission if found', () => __awaiter(void 0, void 0, void 0, function* () {
        mockDb.query.mockResolvedValueOnce({ rows: [{ permission: Permission.WRITE }], rowCount: 1, command: 'INSERT', oid: 0, fields: [] });
        const result = yield userSetModel.getUserPermission(mockUser.userId, mockUser.setId);
        expect(mockDb.query).toHaveBeenCalled();
        expect(result).toBe(mockUser.permission);
    }));
    test('getUserRole - should return null if no permission is found', () => __awaiter(void 0, void 0, void 0, function* () {
        mockDb.query.mockResolvedValueOnce({ rows: [], rowCount: 0, command: 'INSERT', oid: 0, fields: [] });
        const result = yield userSetModel.getUserPermission(mockUser.userId, mockUser.setId);
        expect(mockDb.query).toHaveBeenCalled();
        expect(result).toBeNull();
    }));
    test('getUserRole - should throw an error if database query fails', () => __awaiter(void 0, void 0, void 0, function* () {
        mockDb.query.mockRejectedValueOnce(new Error('DB error'));
        yield expect(userSetModel.getUserPermission(mockUser.userId, mockUser.setId)).rejects.toThrow('DB error');
        expect(mockDb.query).toHaveBeenCalled();
    }));
});
