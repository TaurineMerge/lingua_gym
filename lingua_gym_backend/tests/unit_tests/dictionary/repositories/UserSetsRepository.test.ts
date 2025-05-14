import { UserSetRepository } from '../../../../src/repositories/dictionary/dictionary.js';
import Database from '../../../../src/database/config/db-connection.js';
import { Permission, IUserSet } from '../../../../src/database/interfaces/DbInterfaces.js';

describe('UserSetsModel', () => {
    let mockDb: jest.Mocked<Database>;
    let userSetModel: UserSetRepository;

    let mockUser: IUserSet;
    let mockUsers: Array<IUserSet>;

    beforeEach(() => {
        jest.clearAllMocks();

        mockDb = {
            query: jest.fn(),
        } as unknown as jest.Mocked<Database>;

        userSetModel = new UserSetRepository(mockDb as unknown as Database);

        mockUser = { userId: 'user1', setId: 'set1', permission: Permission.WRITE };
        mockUsers = [mockUser, { userId: 'user2', setId: 'set1', permission: Permission.READ }];
    });

    test('addUserToSet - should add a user to a set and return the added entry', async () => {
        mockDb.query.mockResolvedValueOnce({ rows: [mockUser], rowCount: 1, command: 'INSERT', oid: 0, fields: [] });

        const result = await userSetModel.addUserToSet(mockUser.userId, mockUser.setId, Permission.WRITE);

        expect(result).toEqual(mockUser);
    });

    test('addUserToSet - should throw an error if database query fails', async () => {
        mockDb.query.mockRejectedValueOnce(new Error('DB error'));

        await expect(userSetModel.addUserToSet(mockUser.userId, mockUser.setId, mockUser.permission)).rejects.toThrow('DB error');
        expect(mockDb.query).toHaveBeenCalled();
    });

    test('removeUserFromSet - should remove a user from a set and return the removed entry', async () => {
        mockDb.query.mockResolvedValueOnce({ rows: [mockUser], rowCount: 1, command: 'DELETE', oid: 0, fields: [] });

        const result = await userSetModel.removeUserFromSet(mockUser.userId, mockUser.setId);

        expect(result).toEqual(mockUser);
    });

    test('removeUserFromSet - should return null if no entry was removed', async () => {
        mockDb.query.mockResolvedValueOnce({ rows: [], rowCount: 0, command: 'DELETE', oid: 0, fields: [] });

        const result = await userSetModel.removeUserFromSet(mockUser.userId, mockUser.setId);
        
        expect(mockDb.query).toHaveBeenCalled();
        expect(result).toBeNull();
    });

    test('getUsersBySet - should return users if found', async () => {
        mockDb.query.mockResolvedValueOnce({ rows: mockUsers, rowCount: 2, command: 'INSERT', oid: 0, fields: [] });

        const result = await userSetModel.getUsersBySet('set1');
        
        expect(mockDb.query).toHaveBeenCalled();
        expect(result).toEqual(mockUsers);
    });

    test('getUsersBySet - should return null if no users are found', async () => {
        mockDb.query.mockResolvedValueOnce({ rows: [], rowCount: 0, command: 'INSERT', oid: 0, fields: [] });

        const result = await userSetModel.getUsersBySet('set1');
        
        expect(mockDb.query).toHaveBeenCalled();
        expect(result).toBeNull();
    });

    test('getUserRole - should return the user permission if found', async () => {
        mockDb.query.mockResolvedValueOnce({ rows: [{ permission: Permission.WRITE }], rowCount: 1, command: 'INSERT', oid: 0, fields: [] });

        const result = await userSetModel.getUserPermission(mockUser.userId, mockUser.setId);
        
        expect(mockDb.query).toHaveBeenCalled();
        expect(result).toBe(mockUser.permission);
    });

    test('getUserRole - should return null if no permission is found', async () => {
        mockDb.query.mockResolvedValueOnce({ rows: [], rowCount: 0, command: 'INSERT', oid: 0, fields: [] });

        const result = await userSetModel.getUserPermission(mockUser.userId, mockUser.setId);
        
        expect(mockDb.query).toHaveBeenCalled();
        expect(result).toBeNull();
    });

    test('getUserRole - should throw an error if database query fails', async () => {
        mockDb.query.mockRejectedValueOnce(new Error('DB error'));

        await expect(userSetModel.getUserPermission(mockUser.userId, mockUser.setId)).rejects.toThrow('DB error');
        expect(mockDb.query).toHaveBeenCalled();
    });
});
