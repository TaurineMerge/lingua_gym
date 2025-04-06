import Database from '../../../src/database/config/db-connection.js';
import { UserSetsModel, DictionarySetModel } from '../../../src/models/dictionary/dictionary.js';
import { UserModel } from '../../../src/models/access_management/access_management.js';
import { Permission, User, UserSets, DictionarySet } from '../../../src/database/interfaces/DbInterfaces.js';
import { v4 as uuidv4 } from 'uuid';
import hashPassword from '../../../src/utils/hash/HashPassword.js';

let db: Database;
let userSetsModel: UserSetsModel;
let userModel: UserModel;
let setModel: DictionarySetModel;

beforeAll(async () => {
    db = Database.getInstance();
    userSetsModel = new UserSetsModel(db);
    userModel = new UserModel(db);
    setModel = new DictionarySetModel(db);
});

afterAll(async () => {
    await db.close();
});

afterEach(async () => {
    await clearDatabase();
});

const clearDatabase = async () => {
    await db.query('DELETE FROM "UserSets";');
    await db.query('DELETE FROM "DictionarySets";');
    await db.query('DELETE FROM "User";');
}

const createUser = async (): Promise<string> => {
    const id = uuidv4();
    const pwdHash = hashPassword('password123');
    const username = Array(5).fill(null).map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('');
    const email = Array(5).fill(null).map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('') + '@example.com';
    const tokenVersion = 1;
    const displayName = 'Test User';
    const emailVerified = false;

    const user: User = {
        user_id: id,
        username: username,
        email: email,
        password_hash: pwdHash,
        display_name: displayName,
        email_verified: emailVerified,
        token_version: tokenVersion
    }

    await userModel.createUser(user);

    return id;
};

const createSet = async (ownerId: string): Promise<string> => {
    const id = uuidv4();
    const name = 'Test set';

    const set: DictionarySet = {
        dictionarySetId: id,
        name: name,
        ownerId: ownerId,
        description: 'Set for testing',
        isPublic: false,
        createdAt: new Date(),
    }

    await setModel.createSet(set);

    return id;
};

describe('UserSetsModel integration', () => {
    test('addUserToSet should insert and return UserSets record', async () => {
        const userId = await createUser();
        const setId = await createSet(userId);
        const permission: Permission = Permission.WRITE;

        const result = await userSetsModel.addUserToSet(userId, setId, permission) as UserSets;

        expect(result).not.toBeNull();
        expect(result!.userId).toBe(userId);
        expect(result!.setId).toBe(setId);
        expect(result!.permission).toBe(permission);
    });

    test('removeUserFromSet should delete and return removed UserSets record', async () => {
        const userId = await createUser();
        const setId = await createSet(userId);
        const permission: Permission = Permission.READ;

        await userSetsModel.addUserToSet(userId, setId, permission);
        const removed = await userSetsModel.removeUserFromSet(userId, setId) as UserSets;

        expect(removed).not.toBeNull();
        expect(removed!.userId).toBe(userId);
        expect(removed!.setId).toBe(setId);
        expect(removed!.permission).toBe(permission);
    });

    test('removeUserFromSet should return null if no link exists', async () => {
        const userId = await createUser();
        const setId = await createSet(userId);

        const removed = await userSetsModel.removeUserFromSet(userId, setId) as UserSets;

        expect(removed).toBeNull();
    });

    test('getUsersBySet should return all users linked to set', async () => {
        const user1 = await createUser();
        const user2 = await createUser();
        const setId = await createSet(user1);

        const user1Permission: Permission = Permission.WRITE;
        const user2Permission: Permission = Permission.READ;

        await userSetsModel.addUserToSet(user1, setId, user1Permission);
        await userSetsModel.addUserToSet(user2, setId, user2Permission);

        const users = await userSetsModel.getUsersBySet(setId) as User[] | null;

        expect(users).not.toBeNull();
        expect(users!.length).toBe(2);

        const userIds = users!.map(u => u.user_id);

        expect(userIds).toContain(user1);
        expect(userIds).toContain(user2);
    });

    test('getUsersBySet should return null if no users in set', async () => {
        const userId = await createUser();
        const setId = await createSet(userId);

        const users = await userSetsModel.getUsersBySet(setId);

        expect(users).toBeNull();
    });

    test('getUserPermission should return correct permission', async () => {
        const userId = await createUser();
        const setId = await createSet(userId);
        const userPermission: Permission = Permission.WRITE;

        await userSetsModel.addUserToSet(userId, setId, userPermission);

        const permission = await userSetsModel.getUserPermission(userId, setId);

        expect(permission).toBe(userPermission);
    });

    test('getUserPermission should return null if user not linked', async () => {
        const userId = await createUser();
        const setId = await createSet(userId);

        const permission = await userSetsModel.getUserPermission(userId, setId);
        
        expect(permission).toBeNull();
    });
});
