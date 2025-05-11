import jwt from 'jsonwebtoken';
import TokenManagementService from '../../../../src/services/access_management/JwtTokenManagementService.js';
import { UserModel } from '../../../../src/repositories/access_management/access_management.js';
import 'dotenv/config';
import { User } from '../../../../src/database/interfaces/DbInterfaces.js';
import RegistrationService from '../../../../src/services/access_management/RegistrationService.js';
import { clearDatabase, closeDatabase, setupTestModelContainer, setupTestServiceContainer } from '../../../utils/di/TestContainer.js';

let userModel: UserModel;
let tokenService: TokenManagementService;
let registrationService: RegistrationService;

describe('TokenManagementService - Integration Tests', () => {
  let testUser: User;
  let refreshToken: string;

  beforeAll(async () => {
    await clearDatabase();
    
    const modelContainer = await setupTestModelContainer();
    userModel = modelContainer.resolve(UserModel);

    const serviceContainer = await setupTestServiceContainer();
    tokenService = serviceContainer.resolve(TokenManagementService);
    registrationService = serviceContainer.resolve(RegistrationService);

    await registrationService.register('testuser', 'test@example.com', 'password123');

    const user = await userModel.getUserByEmail('test@example.com');
    if (!user) {
      throw new Error('User not found');
    }
    testUser = user;
  });

  afterAll(async () => {
    await clearDatabase();
    await closeDatabase();
  });

  it('should generate and verify an access token', () => {
    const token = tokenService.generateAccessToken(testUser);
    expect(typeof token).toBe('string');

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    expect(decoded).toHaveProperty('userId', testUser.userId);
    expect(decoded).toHaveProperty('exp', expect.any(Number));
  });

  it('should generate and verify a refresh token', () => {
    refreshToken = tokenService.generateRefreshToken(testUser);
    expect(typeof refreshToken).toBe('string');

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET!);
    expect(decoded).toHaveProperty('userId', testUser.userId);
    expect(decoded).toHaveProperty('tokenVersion', testUser.tokenVersion);
  });

  it('should refresh tokens using a valid refresh token', async () => {
    refreshToken = tokenService.generateRefreshToken(testUser);
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await tokenService.refreshToken(refreshToken);

    expect(refreshToken).not.toBe(newRefreshToken);
    expect(typeof newAccessToken).toBe('string');
    expect(typeof newRefreshToken).toBe('string');

    const updatedUser = await userModel.getUserById(testUser.userId);
    expect(updatedUser!.tokenVersion).toBe(testUser.tokenVersion + 1);

    testUser = updatedUser!;
});


  it('should fail on invalid refresh token', async () => {
    await expect(tokenService.refreshToken('invalid_token')).rejects.toThrow('Invalid refresh token');
  });

  it('should increment token version on logout', async () => {
    await tokenService.incrementTokenVersion(testUser.userId);

    const updatedUser = await userModel.getUserById(testUser.userId);
    expect(updatedUser!.tokenVersion).toBe(testUser.tokenVersion + 1);
  });
});
