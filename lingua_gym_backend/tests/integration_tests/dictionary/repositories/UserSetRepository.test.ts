import { UserSetRepository, DictionarySetRepository } from '../../../../src/repositories/dictionary/dictionary.js';
import { UserRepository } from '../../../../src/repositories/access_management/access_management.js';
import { Permission, IUser, IDictionarySet, IUserSet, LanguageCode } from '../../../../src/database/interfaces/DbInterfaces.js';
import { v4 as uuidv4 } from 'uuid';
import { clearDatabase, closeDatabase, setupTestRepositoryContainer } from '../../../utils/di/TestContainer.js';
import User from '../../../../src/models/access_management/User.js';

let userSetModel: UserSetRepository;
let userModel: UserRepository;
let setModel: DictionarySetRepository;

beforeAll(async () => {
    clearDatabase();
    const modelContainer = await setupTestRepositoryContainer();
    
    userSetModel = modelContainer.resolve(UserSetRepository);
    userModel = modelContainer.resolve(UserRepository);
    setModel = modelContainer.resolve(DictionarySetRepository);
});

afterAll(async () => {
    await clearDatabase();
    await closeDatabase();
});

afterEach(async () => {
    await clearDatabase();
});

const createUser = async (): Promise<string> => {
    const pwd = 'password123';
    const username = Array(5).fill(null).map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
    const email = Array(5).fill(null).map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('') + '@example.com';

    const user = new User({
        username: username,
        email: email,
        password: pwd,
    });

    await userModel.createUser(user);

    return user.userId;
};

const createSet = async (ownerId: string): Promise<string> => {
    const id = uuidv4();
    const name = 'Test set';

    const set: IDictionarySet = {
        dictionarySetId: id,
        name: name,
        ownerId: ownerId,
        description: 'Set for testing',
        isPublic: false,
        languageCode: LanguageCode.ENGLISH,
    }

    await setModel.createSet(set);

    return id;
};

describe('UserSetsModel integration', () => {
    test('addUserToSet should insert and return UserSets record', async () => {
        const userId = await createUser();
        const setId = await createSet(userId);
        const permission: Permission = Permission.WRITE;

        const result = await userSetModel.addUserToSet(userId, setId, permission) as IUserSet;

        expect(result).not.toBeNull();
        expect(result!.userId).toBe(userId);
        expect(result!.setId).toBe(setId);
        expect(result!.permission).toBe(permission);
    });

    test('removeUserFromSet should delete and return removed UserSets record', async () => {
        const userId = await createUser();
        const setId = await createSet(userId);
        const permission: Permission = Permission.READ;

        await userSetModel.addUserToSet(userId, setId, permission);
        const removed = await userSetModel.removeUserFromSet(userId, setId) as IUserSet;

        expect(removed).not.toBeNull();
        expect(removed!.userId).toBe(userId);
        expect(removed!.setId).toBe(setId);
        expect(removed!.permission).toBe(permission);
    });

    test('removeUserFromSet should return null if no link exists', async () => {
        const userId = await createUser();
        const setId = await createSet(userId);

        const removed = await userSetModel.removeUserFromSet(userId, setId) as IUserSet;

        expect(removed).toBeNull();
    });

    test('getUsersBySet should return all users linked to set', async () => {
        const user1 = await createUser();
        const user2 = await createUser();
        const setId = await createSet(user1);

        const user1Permission: Permission = Permission.WRITE;
        const user2Permission: Permission = Permission.READ;

        await userSetModel.addUserToSet(user1, setId, user1Permission);
        await userSetModel.addUserToSet(user2, setId, user2Permission);

        const users = await userSetModel.getUsersBySet(setId) as IUser[] | null;

        expect(users).not.toBeNull();
        expect(users!.length).toBe(2);

        const userIds = users!.map(u => u.userId);

        expect(userIds).toContain(user1);
        expect(userIds).toContain(user2);
    });

    test('getUsersBySet should return null if no users in set', async () => {
        const userId = await createUser();
        const setId = await createSet(userId);

        const users = await userSetModel.getUsersBySet(setId);

        expect(users).toBeNull();
    });

    test('getUserPermission should return correct permission', async () => {
        const userId = await createUser();
        const setId = await createSet(userId);
        const userPermission: Permission = Permission.WRITE;

        await userSetModel.addUserToSet(userId, setId, userPermission);

        const permission = await userSetModel.getUserPermission(userId, setId);

        expect(permission).toBe(userPermission);
    });

    test('getUserPermission should return null if user not linked', async () => {
        const userId = await createUser();
        const setId = await createSet(userId);

        const permission = await userSetModel.getUserPermission(userId, setId);
        
        expect(permission).toBeNull();
    });
});
