import jwt from 'jsonwebtoken';
import TokenManagementService from '../../../../src/services/access_management/JwtTokenManagementService.js';
import UserModel from '../../../../src/models/access_management/UserModel.js';
import UserMetadataModel from '../../../../src/models/access_management/UserMetadataModel.js';
import 'dotenv/config';
import Database from '../../../../src/database/config/db-connection.js';
import User from '../../../../src/database/interfaces/User/User.js';
import RegistrationService from '../../../../src/services/access_management/RegistrationService.js';

const db = Database.getInstance();
const userModel = new UserModel(db);
const tokenService = new TokenManagementService(userModel);
const userMetadataModel = new UserMetadataModel(db);
const registrationService = new RegistrationService(userModel, userMetadataModel);

describe('TokenManagementService - Integration Tests', () => {
  let testUser: User;
  let refreshToken: string;

  beforeAll(async () => {
    await db.query('DELETE FROM "User"');

    await registrationService.register('testuser', 'test@example.com', 'password123');

    const user = await userModel.getUserByEmail('test@example.com');
    if (!user) {
      throw new Error('User not found');
    }
    testUser = user;
  });

  afterAll(async () => {
    await db.close();
  });

  it('should generate and verify an access token', () => {
    const token = tokenService.generateAccessToken(testUser);
    expect(typeof token).toBe('string');

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    expect(decoded).toHaveProperty('userId', testUser.user_id);
    expect(decoded).toHaveProperty('exp', expect.any(Number));
  });

  it('should generate and verify a refresh token', () => {
    refreshToken = tokenService.generateRefreshToken(testUser);
    expect(typeof refreshToken).toBe('string');

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET!);
    expect(decoded).toHaveProperty('userId', testUser.user_id);
    expect(decoded).toHaveProperty('tokenVersion', testUser.token_version);
  });

  it('should refresh tokens using a valid refresh token', async () => {
    refreshToken = tokenService.generateRefreshToken(testUser);
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await tokenService.refreshToken(refreshToken);

    expect(refreshToken).not.toBe(newRefreshToken);
    expect(typeof newAccessToken).toBe('string');
    expect(typeof newRefreshToken).toBe('string');

    const updatedUser = await userModel.getUserById(testUser.user_id);
    expect(updatedUser!.token_version).toBe(testUser.token_version + 1);

    testUser = updatedUser!;
});


  it('should fail on invalid refresh token', async () => {
    await expect(tokenService.refreshToken('invalid_token')).rejects.toThrow('Invalid refresh token');
  });

  it('should increment token version on logout', async () => {
    await tokenService.incrementTokenVersion(testUser.user_id);

    const updatedUser = await userModel.getUserById(testUser.user_id);
    expect(updatedUser!.token_version).toBe(testUser.token_version + 1);
  });
});
