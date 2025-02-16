import PasswordResetService from '../../../../src/services/access_management/PasswordResetService.js';
import UserModel from '../../../../src/models/access_management/UserModel.js';
import UserPasswordResetModel from '../../../../src/models/access_management/UserPasswordResetModel.js';
import Database from '../../../../src/database/config/db-connection.js';
import 'dotenv/config';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import RegistrationService from '../../../../src/services/access_management/RegistrationService.js';
import UserMetadataModel from '../../../../src/models/access_management/UserMetadataModel.js';
import User from '../../../../src/database/interfaces/User/User.js';

const db = Database.getInstance();
const userModel = new UserModel(db);
const userMetadataModel = new UserMetadataModel(db);
const registrationService = new RegistrationService(userModel, userMetadataModel);
const userPasswordResetModel = new UserPasswordResetModel(db);
const passwordResetService = new PasswordResetService(userModel, userPasswordResetModel);

describe('PasswordResetService Integration Tests', () => {
  let testUser: User;
  let resetToken: string;

  beforeEach(async () => {
    await db.query('DELETE FROM "User"');
    await db.query('DELETE FROM "UserPasswordReset"');
    await db.query('DELETE FROM "UserMetadata"');

    const email = `test_${uuidv4()}@example.com`;
    const password = await bcrypt.hash('password123', 10);

    testUser = await registrationService.register('testuser', email, password);
  });

  afterAll(async () => {
    await db.close();
  });

  test('should generate a reset token and save it to the database', async () => {
    resetToken = await passwordResetService.requestPasswordReset(testUser.email);
    expect(resetToken).toBeDefined();
  });

  test('should reset password successfully', async () => {
    const newPassword = 'newPassword123';

    resetToken = await passwordResetService.requestPasswordReset(testUser.email);
    await passwordResetService.resetPassword(resetToken, newPassword);
    
    const userResult = await userModel.getUserById(testUser.user_id);
    console.log(newPassword);
    console.log(userResult?.password_hash);
    expect(userResult!.token_version).toBe(testUser.token_version + 1);
    expect(await bcrypt.compare(newPassword, userResult!.password_hash)).toBe(true);
  });

  test('should fail for invalid reset token', async () => {
    const error = await passwordResetService.resetPassword('invalid_token', 'password123').catch(e => e);
    expect(error.message).toContain('Invalid or expired reset token');
  });

  test('should fail for expired reset token', async () => {
    const expiredToken = jwt.sign(
      { userId: testUser.user_id, tokenVersion: testUser.token_version },
      process.env.RESET_TOKEN_SECRET || 'SECRET',
      { expiresIn: '-1s' }
    );

    const error = await passwordResetService.resetPassword(expiredToken, 'password123').catch(e => e);
    expect(error.message).toContain('Invalid or expired reset token');
  });
});