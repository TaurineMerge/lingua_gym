import PasswordResetService from '../../../../src/services/access_management/PasswordResetService.js';
import 'dotenv/config';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import RegistrationService from '../../../../src/services/access_management/RegistrationService.js';
import { UserRepository } from '../../../../src/repositories/access_management/access_management.js';
import { IUser } from '../../../../src/database/interfaces/DbInterfaces.js';
import { clearDatabase, closeDatabase, setupTestRepositoryContainer, setupTestServiceContainer } from '../../../utils/di/TestContainer.js';

let userModel: UserRepository;
let registrationService: RegistrationService;
let passwordResetService: PasswordResetService;

beforeAll(async () => {
  await clearDatabase();
  
  const modelContainer = await setupTestRepositoryContainer();
  userModel = modelContainer.resolve(UserRepository);

  const serviceContainer = await setupTestServiceContainer();
  registrationService = serviceContainer.resolve(RegistrationService);
  passwordResetService = serviceContainer.resolve(PasswordResetService);
});

describe('PasswordResetService Integration Tests', () => {
  let testUser: IUser;
  let resetToken: string;

  beforeEach(async () => {
    await clearDatabase();

    const email = `test_${uuidv4()}@example.com`;
    const password = await bcrypt.hash('password123', 10);

    testUser = await registrationService.register('testuser', email, password);
  });

  afterAll(async () => {
    await clearDatabase();
    await closeDatabase();
  });

  test('should generate a reset token and save it to the database', async () => {
    resetToken = await passwordResetService.requestPasswordReset(testUser.email);
    expect(resetToken).toBeDefined();
  });

  test('should reset password successfully', async () => {
    const newPassword = 'newPassword123';

    resetToken = await passwordResetService.requestPasswordReset(testUser.email);
    await passwordResetService.resetPassword(resetToken, newPassword);
    
    const userResult = await userModel.getUserById(testUser.userId);
    
    if (!userResult) {
      throw new Error('User not found');
    }

    if (!userResult.passwordHash) {
      throw new Error('Password hash not found');
    }

    expect(userResult!.tokenVersion).toBe(testUser.tokenVersion + 1);
    expect(bcrypt.compare(newPassword, userResult!.passwordHash)).toBe(true);
  });

  test('should fail for invalid reset token', async () => {
    const error = await passwordResetService.resetPassword('invalid_token', 'password123').catch(e => e);
    expect(error.message).toContain('Invalid or expired reset token');
  });

  test('should fail for expired reset token', async () => {
    const expiredToken = jwt.sign(
      { userId: testUser.userId, tokenVersion: testUser.tokenVersion },
      process.env.RESET_TOKEN_SECRET || 'SECRET',
      { expiresIn: '-1s' }
    );

    const error = await passwordResetService.resetPassword(expiredToken, 'password123').catch(e => e);
    expect(error.message).toContain('Invalid or expired reset token');
  });
});