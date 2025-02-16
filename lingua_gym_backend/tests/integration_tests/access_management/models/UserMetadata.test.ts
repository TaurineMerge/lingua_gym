import Database from '../../../../src/database/config/db-connection.js';
import User from '../../../../src/database/interfaces/User/User.js';
import UserMetadata from '../../../../src/database/interfaces/User/UserMetadata.js';
import UserModel from '../../../../src/models/access_management/UserModel.js';
import UserMetadataModel from '../../../../src/models/access_management/UserMetadataModel.js';
import { v4 as uuidv4 } from 'uuid';

const db = Database.getInstance();
const userModel = new UserModel(db);
const userMetadataModel = new UserMetadataModel(db);

afterAll(async () => {
  await db.close();
});

describe('UserMetadataModel Integration Tests', () => {
  let testUser: User;
  let testUserMetadata: UserMetadata;

  beforeEach(async () => {
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

    await userModel.createUser(testUser);
  });

  afterEach(async () => {
    await userMetadataModel.deleteUserMetadataById(testUserMetadata.user_id);
    await userModel.deleteUserById(testUser.user_id);
  });

  test('should create a user metadata', async () => {
    await expect(userMetadataModel.createUserMetadata(testUserMetadata)).resolves.toBeUndefined();
  });

  test('should retrieve a user metadata by user id', async () => {
    await userMetadataModel.createUserMetadata(testUserMetadata);
    const userMetadata = await userMetadataModel.getUserMetadataById(testUserMetadata.user_id);
    expect(userMetadata).toMatchObject({
      user_id: testUserMetadata.user_id,
      last_login: testUserMetadata.last_login,
      signup_date: testUserMetadata.signup_date
    });
  });

  test('should update a user metadata', async () => {
    const newLoginDate = new Date();
    await userMetadataModel.createUserMetadata(testUserMetadata);
    await userMetadataModel.updateUserMetadataById(testUserMetadata.user_id, { last_login: newLoginDate });
    const updatedUserMetadata = await userMetadataModel.getUserMetadataById(testUserMetadata.user_id);
    expect(updatedUserMetadata?.last_login).toEqual(newLoginDate);
  });

  test('should delete a user metadata', async () => {
    await userMetadataModel.createUserMetadata(testUserMetadata);
    await userMetadataModel.deleteUserMetadataById(testUserMetadata.user_id);
    const userMetadata = await userMetadataModel.getUserMetadataById(testUserMetadata.user_id);
    expect(userMetadata).toBeNull();
  });
});
