import { User, UserMetadata } from '../../../../src/database/interfaces/DbInterfaces.js';
import { UserModel, UserMetadataModel } from '../../../../src/repositories/access_management/access_management.js';
import { v4 as uuidv4 } from 'uuid';
import { clearDatabase, closeDatabase, setupTestModelContainer } from '../../../utils/di/TestContainer.js';

let userModel: UserModel;
let userMetadataModel: UserMetadataModel;

beforeAll(async () => {
  await clearDatabase();
  const modelContainer = await setupTestModelContainer();
  userModel = modelContainer.resolve(UserModel);
  userMetadataModel = modelContainer.resolve(UserMetadataModel);
});

afterAll(async () => {
  await clearDatabase();
  await closeDatabase();
});

describe('UserMetadataModel Integration Tests', () => {
  let testUser: User;
  let testUserMetadata: UserMetadata;

  beforeEach(async () => {
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

    await userModel.createUser(testUser);
  });

  afterEach(async () => {
    await clearDatabase();
  });

  test('should create a user metadata', async () => {
    await expect(userMetadataModel.createUserMetadata(testUserMetadata)).resolves.toBeUndefined();
  });

  test('should retrieve a user metadata by user id', async () => {
    await userMetadataModel.createUserMetadata(testUserMetadata);
    const userMetadata = await userMetadataModel.getUserMetadataById(testUserMetadata.userId);
    expect(userMetadata).toMatchObject({
      userId: testUserMetadata.userId,
      lastLogin: testUserMetadata.lastLogin,
      signupDate: testUserMetadata.signupDate
    });
  });

  test('should update a user metadata', async () => {
    const newLoginDate = new Date();
    await userMetadataModel.createUserMetadata(testUserMetadata);
    await userMetadataModel.updateUserMetadataById(testUserMetadata.userId, { lastLogin: newLoginDate });
    const updatedUserMetadata = await userMetadataModel.getUserMetadataById(testUserMetadata.userId);
    expect(updatedUserMetadata?.lastLogin).toEqual(newLoginDate);
  });

  test('should delete a user metadata', async () => {
    await userMetadataModel.createUserMetadata(testUserMetadata);
    await userMetadataModel.deleteUserMetadataById(testUserMetadata.userId);
    const userMetadata = await userMetadataModel.getUserMetadataById(testUserMetadata.userId);
    expect(userMetadata).toBeNull();
  });
});
