import { UserModel } from '../../../../src/models/access_management/access_management.js';
import { User } from '../../../../src/database/interfaces/DbInterfaces.js';
import { v4 as uuidv4 } from 'uuid';
import { clearDatabase, closeDatabase, setupTestModelContainer } from '../../../utils/di/TestContainer.js';

let userModel: UserModel;

beforeAll(async () => {
  await clearDatabase();
  const modelContainer = await setupTestModelContainer();
  userModel = modelContainer.resolve(UserModel);
});

afterAll(async () => {
  await clearDatabase();
  await closeDatabase();
});

describe('UserModel Integration Tests', () => {
  let testUser: User;

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

  afterEach(async () => {
    await clearDatabase();
  });

  test('should create a user', async () => {
    await expect(userModel.createUser(testUser)).resolves.toBeUndefined();
  });

  test('should retrieve a user by ID', async () => {
    await userModel.createUser(testUser);
    const user = await userModel.getUserById(testUser.userId);
    expect(user).toMatchObject({
      userId: testUser.userId,
      username: testUser.username,
    });
  });

  test('should retrieve a user by email', async () => {
    await userModel.createUser(testUser);
    const user = await userModel.getUserByEmail(testUser.email);
    expect(user).toMatchObject({ email: testUser.email });
  });

  test('should retrieve a user by username', async () => {
    await userModel.createUser(testUser);
    const user = await userModel.getUserByUsername(testUser.username);
    expect(user).toMatchObject({ username: testUser.username });
  });

  test('should update a user', async () => {
    await userModel.createUser(testUser);
    await userModel.updateUserById(testUser.userId, { displayName: 'Updated Name' });
    const updatedUser = await userModel.getUserById(testUser.userId);
    expect(updatedUser?.displayName).toBe('Updated Name');
  });

  test('should delete a user', async () => {
    await userModel.createUser(testUser);
    await userModel.deleteUserById(testUser.userId);
    const user = await userModel.getUserById(testUser.userId);
    expect(user).toBeNull();
  });
});
