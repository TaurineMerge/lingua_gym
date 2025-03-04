import Database from '../../../../src/database/config/db-connection.js';
import { UserModel } from '../../../../src/models/access_management/access_management.js';
import { User } from '../../../../src/database/interfaces/DbInterfaces.js';
import { v4 as uuidv4 } from 'uuid';

const db = Database.getInstance();
const userModel = new UserModel(db);

afterAll(async () => {
  await db.close();
});

describe('UserModel Integration Tests', () => {
  let testUser: User;

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

  afterEach(async () => {
    await userModel.deleteUserById(testUser.user_id);
  });

  test('should create a user', async () => {
    await expect(userModel.createUser(testUser)).resolves.toBeUndefined();
  });

  test('should retrieve a user by ID', async () => {
    await userModel.createUser(testUser);
    const user = await userModel.getUserById(testUser.user_id);
    expect(user).toMatchObject({
      user_id: testUser.user_id,
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
    await userModel.updateUserById(testUser.user_id, { display_name: 'Updated Name' });
    const updatedUser = await userModel.getUserById(testUser.user_id);
    expect(updatedUser?.display_name).toBe('Updated Name');
  });

  test('should delete a user', async () => {
    await userModel.createUser(testUser);
    await userModel.deleteUserById(testUser.user_id);
    const user = await userModel.getUserById(testUser.user_id);
    expect(user).toBeNull();
  });
});
