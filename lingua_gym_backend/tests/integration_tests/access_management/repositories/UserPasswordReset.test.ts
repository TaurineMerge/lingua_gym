import { IUser, IPasswordResetManager } from '../../../../src/database/interfaces/DbInterfaces.js';
import { UserRepository, UserPasswordResetRepository } from '../../../../src/repositories/access_management/access_management.js';
import { v4 as uuidv4 } from 'uuid';
import { clearDatabase, closeDatabase, setupTestRepositoryContainer } from '../../../utils/di/TestContainer.js';

let userModel: UserRepository;
let passwordResetModel: UserPasswordResetRepository;

beforeAll(async () => {
  await clearDatabase();
  const modelContainer = await setupTestRepositoryContainer();
  userModel = modelContainer.resolve(UserRepository);
  passwordResetModel = modelContainer.resolve(UserPasswordResetRepository);
});

afterAll(async () => {
  await clearDatabase();
  await closeDatabase();
});

describe('UserPasswordResetModel Integration Tests', () => {
  let testUser: IUser;
  let testPasswordReset: IPasswordResetManager;

  beforeEach(async () => {
    testUser = {
      userId: uuidv4(),
      username: `testuser_${Date.now()}`,
      displayName: 'Test User',
      passwordHash: 'hashedpassword',
      email: `testuser_${Date.now()}@example.com`,
      tokenVersion: 1,
      emailVerified: false,
    };

    await userModel.createUser(testUser);

    testPasswordReset = {
      userId: testUser.userId,
      passwordResetToken: uuidv4(),
      passwordResetTokenExpiration: new Date(Date.now() + 1000 * 60 * 60),
    };
  });

  afterEach(async () => {
    await closeDatabase();
  });

  test('should create a password reset entry', async () => {
    await expect(passwordResetModel.createResetEntry(testPasswordReset)).resolves.toBeUndefined();
  });

  test('should retrieve a password reset entry by token', async () => {
    await passwordResetModel.createResetEntry(testPasswordReset);
    const resetEntry = await passwordResetModel.getByToken(testPasswordReset.passwordResetToken);
    expect(resetEntry).toMatchObject({
      user_id: testPasswordReset.userId,
      password_reset_token: testPasswordReset.passwordResetToken,
    });
  });

  test('should invalidate a password reset token', async () => {
    await passwordResetModel.createResetEntry(testPasswordReset);
    await passwordResetModel.invalidateToken(testPasswordReset.passwordResetToken);
    const resetEntry = await passwordResetModel.getByToken(testPasswordReset.passwordResetToken);
    expect(resetEntry).toBeNull();
  });

  test('should delete password reset request by user ID', async () => {
    await passwordResetModel.createResetEntry(testPasswordReset);
    await passwordResetModel.deleteRequestByUserId(testPasswordReset.userId);
    const resetEntry = await passwordResetModel.getByToken(testPasswordReset.passwordResetToken);
    expect(resetEntry).toBeNull();
  });

  test('should delete expired password reset requests', async () => {
    const expiredPasswordReset: IPasswordResetManager = {
      userId: testUser.userId,
      passwordResetToken: uuidv4(),
      passwordResetTokenExpiration: new Date(Date.now() - 1000 * 60),
    };
    
    await passwordResetModel.createResetEntry(expiredPasswordReset);
    await passwordResetModel.deleteExpiredRequests();

    const resetEntry = await passwordResetModel.getByToken(expiredPasswordReset.passwordResetToken);
    expect(resetEntry).toBeNull();
  });
});
