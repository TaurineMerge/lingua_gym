import Database from '../../../../src/database/config/db-connection.js';
import { User, UserPasswordReset } from '../../../../src/database/interfaces/DbInterfaces.js';
import UserModel from '../../../../src/models/access_management/UserModel.js';
import UserPasswordResetModel from '../../../../src/models/access_management/UserPasswordResetModel.js';
import { v4 as uuidv4 } from 'uuid';

const db = Database.getInstance();
const userModel = new UserModel(db);
const passwordResetModel = new UserPasswordResetModel(db);

afterAll(async () => {
  await db.close();
});

describe('UserPasswordResetModel Integration Tests', () => {
  let testUser: User;
  let testPasswordReset: UserPasswordReset;

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

    await userModel.createUser(testUser);

    testPasswordReset = {
      user_id: testUser.user_id,
      password_reset_token: uuidv4(),
      password_reset_token_expiration: new Date(Date.now() + 1000 * 60 * 60),
    };
  });

  afterEach(async () => {
    await passwordResetModel.deleteRequestByUserId(testUser.user_id);
    await userModel.deleteUserById(testUser.user_id);
  });

  test('should create a password reset entry', async () => {
    await expect(passwordResetModel.createResetEntry(testPasswordReset)).resolves.toBeUndefined();
  });

  test('should retrieve a password reset entry by token', async () => {
    await passwordResetModel.createResetEntry(testPasswordReset);
    const resetEntry = await passwordResetModel.getByToken(testPasswordReset.password_reset_token);
    expect(resetEntry).toMatchObject({
      user_id: testPasswordReset.user_id,
      password_reset_token: testPasswordReset.password_reset_token,
    });
  });

  test('should invalidate a password reset token', async () => {
    await passwordResetModel.createResetEntry(testPasswordReset);
    await passwordResetModel.invalidateToken(testPasswordReset.password_reset_token);
    const resetEntry = await passwordResetModel.getByToken(testPasswordReset.password_reset_token);
    expect(resetEntry).toBeNull();
  });

  test('should delete password reset request by user ID', async () => {
    await passwordResetModel.createResetEntry(testPasswordReset);
    await passwordResetModel.deleteRequestByUserId(testPasswordReset.user_id);
    const resetEntry = await passwordResetModel.getByToken(testPasswordReset.password_reset_token);
    expect(resetEntry).toBeNull();
  });

  test('should delete expired password reset requests', async () => {
    const expiredPasswordReset = {
      user_id: testUser.user_id,
      password_reset_token: uuidv4(),
      password_reset_token_expiration: new Date(Date.now() - 1000 * 60),
    };
    
    await passwordResetModel.createResetEntry(expiredPasswordReset);
    await passwordResetModel.deleteExpiredRequests();

    const resetEntry = await passwordResetModel.getByToken(expiredPasswordReset.password_reset_token);
    expect(resetEntry).toBeNull();
  });
});
