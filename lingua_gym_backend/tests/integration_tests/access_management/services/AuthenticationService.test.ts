import { AuthenticationService, RegistrationService } from '../../../../src/services/access_management/access_management.js';
import { UserRepository } from '../../../../src/repositories/access_management/access_management.js';
import bcrypt from 'bcrypt';
import { clearDatabase, closeDatabase, setupTestRepositoryContainer, setupTestServiceContainer } from '../../../utils/di/TestContainer.js';
import User from '../../../../src/models/access_management/User.js';

let userModel: UserRepository;
let authService: AuthenticationService;
let registrationService: RegistrationService;

const testUserData = {
  userId: '',
  username: 'testuser',
  email: 'test@example.com',
  password: 'password123',
  passwordHash: bcrypt.hashSync('password123', 10),
  tokenVersion: 0,
  emailVerified: true,
};

beforeAll(async () => {
  await clearDatabase();
  const modelContainer = await setupTestRepositoryContainer();
  userModel = modelContainer.resolve(UserRepository);
  const serviceContainer = await setupTestServiceContainer();
  authService = serviceContainer.resolve(AuthenticationService);
  registrationService = serviceContainer.resolve(RegistrationService);

  testUserData.userId = (await registrationService.register(testUserData.username, testUserData.email, testUserData.password)).userId;
})

afterAll(async () => {
  await clearDatabase();
  await closeDatabase();
});

describe('AuthenticationService (Integration)', () => {
  test('should login with correct credentials', async () => {
    const tokens = await authService.login(testUserData.email, testUserData.password);

    expect(tokens).toHaveProperty('accessToken');
    expect(tokens).toHaveProperty('refreshToken');
  });

  test('should fail to login with incorrect password', async () => {
    await expect(authService.login(testUserData.email, 'wrongpassword')).rejects.toThrow('Invalid password');
  });

  test('should fail to login with non-existing email', async () => {
    await expect(authService.login('nonexistent@example.com', 'password123')).rejects.toThrow('User not found');
  });

  test('should invalidate refresh token on logout', async () => {
    const user = new User(testUserData);

    const updatedUser = await userModel.getUserById(user.userId);
    expect(updatedUser?.tokenVersion).toBe(testUserData.tokenVersion + 1);
  });
});
